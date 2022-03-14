function FreehandTool() {
    //set an icon and a name for the object
    this.icon = "assets/freehand.jpg";
    this.name = "freehand";

    //to smoothly draw we'll draw a line from the previous mouse location
    //to the current mouse location. The following values store
    //the locations from the last frame. They are -1 to start with because
    //we haven't started drawing yet.
    var previousMouseX = -1;
    var previousMouseY = -1;

    // A reference to FreehandOptions, will be initialized to instance in populateOptions().
    var options = null;

    // A reference to the ColourPalette. Set from the setColourPalette function.
    var colourPalette = null;

    // A reference to the current graphics object we're drawing to
    var graphics = null;

    var lastDotX = -1;
    var lastDotY = -1;

    this.draw = function() {
        //if the mouse is pressed
        if (mouseIsPressed) {
            //check if they previousX and Y are -1. set them to the current
            //mouse X and Y if they are.
            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
                //if we already have values for previousX and Y we can draw a line from
            //there to the current mouse location
            else {
                drawLine();
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
        }
            //if the user has released the mouse we want to set the previousMouse values
            //back to -1.
        //try and comment out these lines and see what happens!
        else {
            previousMouseX = -1;
            previousMouseY = -1;
            // Reset also the last dot positions.
            lastDotX = -1;
            lastDotY = -1;
        }
    };

    /**
     * Restore the state: remove options, restore stroke and opacity, turn off erase mode, restore cursor.
     */
    this.unselectTool = function() {
        options = null;
        select(".options").html("");
        graphics.strokeWeight(1);
        colourPalette.alpha(255);
        graphics.noErase();
        cursor(ARROW);
    };

    /**
     * Build the options UI for the Freehand tool.
     */
    this.populateOptions = function() {
        // Instantiate the options class and invoke its createUi method, setting the .options container as the parent.
        options = new FreehandOptions();
        options.createUi(select(".options"));

        // Set stroke weight on the current rendering surface when the line thickness is changed in options.
        options.onLineThicknessChanged(function(lineThickness) {
            graphics.strokeWeight(lineThickness);
        });

        // Set the opacity on the colour palette as it was adjusted on the opacity slider, first remapping it to the
        // 0-255 range.
        options.onOpacityChanged(function(alpha) {
            var mappedAlpha = Math.round(map(alpha, 0.0, 1.0, 0, 255));
            colourPalette.alpha(mappedAlpha);
        });

        // Handle change of line type.
        options.onLineTypeChanged(function(lineType) {

            // If line type was changed, reset the lastDot markers.
            lastDotX = -1;
            lastDotY = -1;

            // If jitter was selected or deselected, show or hide the jitter radius slider.
            if (lineType === 'Jitter') {
                options.jitterSlider.setVisible(true);
            } else {
                options.jitterSlider.setVisible(false);
            }
        });

        // Handle eraser mode change.
        options.onEraserModeChanged(function(eraserMode) {

            // If eraser mode on, enter the eraser mode and set the cursor to the eraser.
            if (eraserMode === true) {
                erase();
                graphics.erase();

                cursor('assets/eraser.cur');
            }
            else {
                // Exit eraser mode and set the standard cursor.
                graphics.noErase();
                noErase();
                cursor(ARROW);
            }
        });
    };

    /**
     * Remember the reference to the colour palette.
     * @param palette The colour palette reference to remember.
     */
    this.setColourPalette = function(palette) {
        colourPalette = palette;
    }

    /**
     * Set the current rendering surface (of the active layer).
     * @param g {p5.Graphics} The active layer's rendering surface.
     */
    this.setGraphics = function(g) {
        graphics = g;
    }

    /**
     * Draw the line, taking line type and jitter into account.
     */
    var drawLine = function() {
        var jitter = options.jitterRadius;

        // If this is a solid line, just draw it from the previous mouse location to the current one.
        if (options.lineType === 'Solid') {
            graphics.line(previousMouseX, previousMouseY, mouseX, mouseY);
        }
        // Otherwise, call a specific method to draw the line of correct type.
        else if (options.lineType === 'Jitter') {
            drawJitter(jitter);
        }
        else if (options.lineType === 'Dotted') {
            drawDotted();
        } else {
            drawDashed();
        }
    };

    /**
     * Draws the line, with pixels randomly displaced (jitter effect) from the straight line inside a certain jitter
     * radius.
     *
     * @param jitter The jitter radius.
     */
    var drawJitter = function(jitter) {
        // Vector to the previous mouse location.
        var v1 = createVector(previousMouseX, previousMouseY);
        // Vector to the current mouse location.
        var v2 = createVector(mouseX, mouseY);

        // The distance between the two points. If greater than 0, apply jitter.
        var d = p5.Vector.dist(v1, v2);
        if (d > 0) {
            // Calculate the jitter randomly - between 1 and jitter pixels.
            var actualJitter = floor(random(0, jitter)) + 1;
            // Get the vector that is perpendicular to the difference v2 - v1.
            var vp = getPerpendicularVector(v1, v2, actualJitter);
            // This snippet will randomly decide whether to reverse the perpendicular vector in order to displace the
            // drawn pixel in the other direction.
            if (randomBoolean()) {
                vp.mult(-1.0);
            }

            // Calculate how many steps (pixels) to draw between the previous location and the current one.
            var steps = ceil(d / options.lineThickness);
            var step = 1.0 / steps;

            for (var s = 0; s < steps; s++) {
                // Draw the pixels, displace them by the calculated jitter displacement vector vp.
                var x = lerp(previousMouseX, mouseX, (s + 1) * step) + vp.x;
                var y = lerp(previousMouseY, mouseY, (s + 1) * step) + vp.y;

                graphics.ellipse(x, y, options.lineThickness);
            }
        }
    }

    /**
     * Draw a dotted line.
     */
    var drawDotted = function() {
        // The distance between the previous mouse location and the current one.
        var d = dist(previousMouseX, previousMouseY, mouseX, mouseY);

        if (d > 0) {
            // Calculate how many dots to draw.
            var steps = ceil(d / options.lineThickness);
            var step = 1.0 / steps;
            var gap = 2 * options.lineThickness;

            // Interpolate the next dot location and draw it.
            for (var s = 0; s < steps; s++) {
                var x = lerp(previousMouseX, mouseX, (s + 1) * step);
                var y = lerp(previousMouseY, mouseY, (s + 1) * step);


                if (lastDotX === -1 || dist(lastDotX, lastDotY, x, y) > gap) {
                    graphics.ellipse(x, y, options.lineThickness);
                    lastDotX = x;
                    lastDotY = y;
                }
            }
        }
    };

    /**
     * Draw a dashed line.
     */
    var drawDashed = function() {

        // Construct the vectors representing previous and current locations.
        var v1 = createVector(previousMouseX, previousMouseY);
        var v2 = createVector(mouseX, mouseY);

        // Calculate the vector difference between the previous and current locations, make the vector 75% of the
        // distance.
        var dv = p5.Vector.sub(v2, v1);
        dv.mult(0.75);

        // If we don't have the last position we draw at, just take the last mouse location.
        if (lastDotX === -1) {
            lastDotX = previousMouseX;
            lastDotY = previousMouseY;
        }

        if (dv.mag() > 0) {
            // Calculate the end point of the drawn line, using the 75% distance vector, producing a dashed effect.
            var endPointX = previousMouseX + dv.x;
            var endPointY = previousMouseY + dv.y;

            var d = dist(lastDotX, lastDotY, endPointX, endPointY);

            // Draw the line if the distance between the last drawn pixel is greater than line thickness.
            if (d > options.lineThickness) {
                graphics.line(previousMouseX, previousMouseY, endPointX, endPointY);
                lastDotX = endPointX;
                lastDotY = endPointY;
            }
        }
    }
}