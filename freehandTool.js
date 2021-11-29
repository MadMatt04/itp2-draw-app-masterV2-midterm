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

    this.draw = function () {
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
        }
    };

    this.unselectTool = function () {
        options = null;
        select(".options").html("");
        strokeWeight(1);
        colourPalette.alpha(255);
    };

    this.populateOptions = function () {
        options = new FreehandOptions();
        options.createUi(select(".options"));

        options.onLineThicknessChanged(function (lineThickness) {
            console.log("Line thickness changed to", lineThickness, "px.");
            strokeWeight(lineThickness);
        })

        options.onOpacityChanged(function (alpha) {
            var mappedAlpha = Math.round(map(alpha, 0.0, 1.0, 0, 255));
            console.log(`Alpha ${alpha} mapped to range 0-255: ${mappedAlpha}.`);
            colourPalette.alpha(mappedAlpha);
        })
    };

    this.setColourPalette = function (palette) {
        console.log("Freehand tool received colour palette ", palette, ".");
        colourPalette = palette;
    }

    var drawLine = function () {
        if (options.lineType === 'Solid') {
            line(previousMouseX, previousMouseY, mouseX, mouseY);
        }
        else {
            var d = dist(previousMouseX, previousMouseY, mouseX, mouseY);
            console.log(`pmx, pmy, mouseX, mouseY, distance: ${previousMouseX}, ${previousMouseY}, ${mouseX}, ${mouseY}, ${d}`);

            if (d > 0 && options.lineType === 'Dotted') {
                var xDiff = abs(mouseX - previousMouseX);
                var yDiff = abs(mouseY - previousMouseY);
                for (var p = 0; p <= d; p++) {
                    var x = lerp(previousMouseX, mouseX, p);
                    var y = lerp(previousMouseY, mouseY, p);
                    console.log(`(${x}, ${y}) at ${p}`);
                    // if (p % 2 === 0) {
                    //     point(x,y);
                    // }
                    point(x, y);
                }
            }
        }
    };
}