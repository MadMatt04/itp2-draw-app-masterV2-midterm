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
            lastDotX = -1;
            lastDotY = -1;
        }
    };

    this.unselectTool = function() {
        options = null;
        select(".options").html("");
        graphics.strokeWeight(1);
        colourPalette.alpha(255);
        graphics.noErase();
        cursor(ARROW);
    };

    this.populateOptions = function() {
        options = new FreehandOptions();
        options.createUi(select(".options"));

        options.onLineThicknessChanged(function(lineThickness) {
            console.log("Line thickness changed to", lineThickness, "px.");
            graphics.strokeWeight(lineThickness);
        });

        options.onOpacityChanged(function(alpha) {
            var mappedAlpha = Math.round(map(alpha, 0.0, 1.0, 0, 255));
            console.log(`Alpha ${alpha} mapped to range 0-255: ${mappedAlpha}.`);
            colourPalette.alpha(mappedAlpha);
        });

        options.onLineTypeChanged(function(lineType) {
            if (lineType === 'Dashed') {
                alert("Not implemented yet.");
            }
        });

        options.onEraserModeChanged(function(eraserMode) {
            if (eraserMode === true) {
                erase();
                graphics.erase();
                //blendMode(REMOVE);

                cursor('assets/eraser.cur');
            }
            else {
                graphics.noErase();
                noErase();
                //blendMode(BLEND);
                cursor(ARROW);
            }
        });


        options.onJitterRadiusChanged(function() {

        });
    };

    this.setColourPalette = function(palette) {
        console.log("Freehand tool received colour palette", palette, ".");
        colourPalette = palette;
    }

    this.setGraphics = function(g) {
        console.log("Graphics set to", g, ".");
        graphics = g;
    }

    var drawLine = function() {
        var jitter = options.jitterRadius;

        if (options.lineType === 'Solid' && jitter === 0) {
            graphics.line(previousMouseX, previousMouseY, mouseX, mouseY);
        }
        else if (jitter > 0) {
            drawJitter(jitter);
        }
        else {
            drawDotted();
        }
    };

    var drawJitter = function(jitter) {
        var v1 = createVector(previousMouseX, previousMouseY);
        var v2 = createVector(mouseX, mouseY);

        var d = p5.Vector.dist(v1, v2);
        if (d > 0) {
            var actualJitter = floor(random(0, jitter)) + 1;
            var vp = getPerpendicularVector(v1, v2, actualJitter);
            if (randomBoolean()) {
                vp.mult(-1.0);
            }

            var steps = ceil(d / options.lineThickness);
            var step = 1.0 / steps;

            for (var s = 0; s < steps; s++) {
                var x = lerp(previousMouseX, mouseX, (s + 1) * step) + vp.x;
                var y = lerp(previousMouseY, mouseY, (s + 1) * step) + vp.y;

                graphics.ellipse(x, y, options.lineThickness);
            }
        }
    }

    var drawDotted = function() {
        var d = dist(previousMouseX, previousMouseY, mouseX, mouseY);

        if (d > 0 && options.lineType === 'Dotted') {
            var steps = ceil(d / options.lineThickness);
            var step = 1.0 / steps;
            var gap = 2 * options.lineThickness;

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
    }
}