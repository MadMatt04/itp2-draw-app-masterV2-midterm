/**
 * An implementation of the Bucket (flood fill tool). Unlike the other extensions, this implementation uses ES6
 * classes rather than constructor functions.
 */
class BucketTool {
    /**
     * The constructor. All tools need an icon and a name, so that is what we set inside the constructor.
     */
    constructor() {
        this.icon = "assets/paint-bucket-svgrepo-com-adjusted.svg"
        this.name = "bucket";
    }

    /**
     * Set the current drawing surface, as received from the layer infrastructure.
     * @param graphics a p5.Graphics drawing surface.
     */
    set graphics(graphics) {
        this.g = graphics;
    }

    /**
     * Retrieve the current drawing surface.
     * @returns The current p5.Graphics drawing surface.
     */
    get graphics() {
        return this.g;
    }

    /**
     * Remember the reference to the colour palette component.
     * @param palette The ColourPalette instance.
     */
    set colourPalette(palette) {
        this.palette = palette;
    }

    /**
     * The rendering function, called on every p5 draw cycle. Will trigger the flood fill algorithm if the mouse
     * was pressed.
     */
    draw() {
        if (mouseIsPressed && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
            var c = this.palette.selectedColourObject();
            this.floodFill(mouseX, mouseY, new Colour(red(c), green(c), blue(c), alpha(c)));
        }
    }

    /**
     * Initialize the bucket fill options. This creates the opacity slider.
     */
    populateOptions() {
        // Setting the cursor here is perhaps not the most appropriate, but there are no other callbacks when the tool
        // is selected.
        cursor('assets/bucket.cur');
        var self = this;

        // Create the slider, constructor function defined in freehandOptions.js
        var parent = select(".options");
        var opacitySlider = new LabeledSlider(parent, "Opacity", "bucket-opacity-slider-ctrl", 0, 100, 100,
            0, "%", function(value) {
                // Map the percentage value 0-100 to an alpha value in the 0-255 range.
                var mappedAlpha = Math.round(map(value, 0, 100, 0, 255));
                self.palette.alpha(mappedAlpha);
            });
    }

    /**
     * Reset to the default state if the tool is deselected. Remove options, restore opacity and restore the cursor.
     */
    unselectTool() {
        select(".options").html("");
        this.palette.alpha(255);
        cursor(ARROW);
    }

    /**
     * Returns the colour at location denoted by (x, y).
     * @param x The x coordinate of the location of interest.
     * @param y The y coordinate of the location of interest.
     * @returns {undefined|Colour} If the coordinates are out of range, returns undefined, otherwise a Colour object
     * representing the location colour.
     */
    getColourAt(x, y) {
        if (x < 0 || x >= width) {
            return undefined;
        }

        if (y < 0 || y >= height) {
            return undefined;
        }

        let d = this.graphics.pixelDensity();

        // Calculate the position of the red value for location (x, y), considering pixel density.
        var i = 4 * d * (y * d * width + x);
        return new Colour(this.graphics.pixels[i], this.graphics.pixels[i + 1], this.graphics.pixels[i + 2],
            this.graphics.pixels[i + 3]);
    };

    /**
     * Puts the north, south, east and west neighbours of point in the specified queue for consideration of the bucket
     * fill algorithm, assuming they are within the bounds of the screen.
     *
     * @param queue The Queue holding p5 Vectors representing points to examine in the bucket fill algorithm.
     * @param point The point whose neighbours to considered.
     */
    enqueueNeighbouringPoints(queue, point) {

        var x = point.x
        var y = point.y

        if (x - 1 > 0) {
            queue.enqueue(createVector(x - 1, y))
        }

        if (x + 1 < width) {
            queue.enqueue(createVector(x + 1, y))
        }

        if (y - 1 > 0) {
            queue.enqueue(createVector(x, y - 1))
        }

        if (y + 1 < height) {
            queue.enqueue(createVector(x, y + 1))
        }
    }

    /**
     * The implementation of the flood fill algorithm, using a helper queue that stores the points (pixels) we need
     * to consider.
     * @param startX The x location at which to start filling the area.
     * @param startY The y location at which to start filling the area.
     * @param fillColour The colour to flood the area with.
     */
    floodFill(startX, startY, fillColour) {
        // Prepare the pixel array of the current drawing surface (layer) for manipulation;
        this.graphics.loadPixels();

        // Calculate the index of the pixel array for the starting position.
        var d = this.graphics.pixelDensity();
        var index = 4 * d * (startY * d * width + startX);

        // Get the colour at the starting location. This is the colour that we will be replacing.
        var targetColour = this.getColourAt(startX, startY);

        // Create the queue holding the points we need to examine, enqueue the starting location in it.
        var queue = new Queue();
        queue.enqueue(createVector(startX, startY));

        // Loop through enqueued location that we need to examine for colour change.
        while (!queue.isEmpty) {
            // Retrieve the head of the queue.
            var point = queue.head;
            queue.dequeue();

            // Retrieve the colour of the point under consideration. Then, check if it is the same as the target colour
            // and if not, just go to the next point. Otherwise, replace the colour with our chosen colour.
            var colour = this.getColourAt(point.x, point.y);
            if (!colour.equals(targetColour)) {
                continue;
            }

            // Set the pixels of our (x,y) location, taking pixel density in account.
            for (var i = 0; i < d; i++) {
                for (var j = 0; j < d; j++) {
                    // Calculate the pixel array index of the points we need to manipulate, taking pixel density into
                    // account.
                    var updateIndex = 4 * ((point.y * d + j) * width * d + (point.x * d + i));
                    this.graphics.pixels[updateIndex] = fillColour.red;
                    this.graphics.pixels[updateIndex + 1] = fillColour.green;
                    this.graphics.pixels[updateIndex + 2] = fillColour.blue;
                    this.graphics.pixels[updateIndex + 3] = fillColour.alpha;
                }
            }

            // Put the neighbouring locations into the queue.
            this.enqueueNeighbouringPoints(queue, point);
        }

        // Finally, commit the pixels, signaling that the array manipulation has been completed.
        this.graphics.updatePixels()
    }
}

/**
 * A class that implements the queue data structure (by wrapping a javascript array).
 */
class Queue {

    /**
     * Initialize the queue.
     */
    constructor() {
        this.backingArray = [];
    }

    /**
     * Returns the head (first element) of the queue.
     * @returns {*} The (head) first element of the queue.
     */
    get head() {
        return this.backingArray[0];
    }

    /**
     * Checks whether the queue is empty.
     * @returns {boolean} True if the queue is empty, false otherwise.
     */
    get isEmpty() {
        return this.backingArray.length === 0;
    }

    /**
     * Removes the head of the queue, unless the queue is empty, in which case it does nothing.
     */
    dequeue() {
        if (!this.isEmpty) {
            this.backingArray.shift();
        }
    }

    /**
     * Stores the specified element at the end of the queue.
     * @param element The element to store.
     */
    enqueue(element) {
        this.backingArray.push(element);
    }
}

/**
 * A simple structure representing an RGB/A colour.
 *  Because p5.Color is just too slow, as red(), green() etc. extraction operations are very slow.
 */
class Colour {

    /**
     * Initializes the colour with the specified values.
     * @param r The red value in the 0-255 range.
     * @param g The green value in the 0-255 range.
     * @param b The blue value in the 0-255 range.
     * @param a The alpha value in the 0-255 range.
     */
    constructor(r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }

    /**
     * Implements the equality comparison for Colour objects. Two Colours are considered equal if all their
     * components (the red, green, blue and alpha values) are equal.
     * @param colour
     * @returns {boolean} True if the colours are equal, false otherwise.
     */
    equals(colour) {
        return this.red === colour.red && this.green === colour.green && this.blue === colour.blue &&
            this.alpha === colour.alpha;
    }
}