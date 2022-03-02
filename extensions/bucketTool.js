class BucketTool {
    constructor() {
        this.icon = "assets/paint-bucket-svgrepo-com-adjusted.svg"
        this.name = "bucket";
    }

    set graphics(graphics) {
        this.g = graphics;
    }

    get graphics() {
        return this.g;
    }

    set colourPalette(palette) {
        this.palette = palette;
    }

    draw() {
        console.log("Bucket draw");
    }

    populateOptions() {
        var self = this;
        var parent = select(".options");
        var opacitySlider = new LabeledSlider(parent, "Opacity", "bucket-opacity-slider-ctrl", 0, 100, 100,
            0, "%", function(value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                self.palette.alpha(value / 100.0);
            });
    }

    unselectTool() {
        select(".options").html("");
        this.palette.alpha(255);
    }

    isInside(x, y, targetColour, visited) {
        if (x < 0 || x >= width) {
            return false;
        }

        if (y < 0 || y >= height) {
            return false;
        }

        var colour = this.getColorAt(x, y);
        if (red(colour) === red(targetColour) && blue(colour) === blue(targetColour) &&
            green(colour) === green(targetColour)) {
            return false;
        }

        return !visited.contains(x, y);
    }

    getColorAt(x, y) {
        if (x < 0 || x >= width) {
            return undefined;
        }

        if (y < 0 || y >= height) {
            return undefined;
        }

        this.graphics.loadPixels();
        let d = this.graphics.pixelDensity();

        var i = 4 * d * (y * d * width + x);
        var [r, g, b, a] = [this.graphics.pixels[i], this.graphics.pixels[i + 1], this.graphics.pixels[i + 2],
                            this.graphics.pixels[i + 3]];
        var colour = new p5.Color();
        colour.setRed(r);
        colour.setGreen(g);
        colour.setBlue(b);
        colour.setAlpha(a);

        return colour;
    };

    floodFill(startX, startY, colour) {
        var targetColour = this.getColorAt(startX, startY);
        if (!targetColour) {
            return;
        }

        var visited = new VisitedList();
        var queue = new Queue();
        queue.enqueue({x: startX, y: startY});
        visited.add(startX, startY);

        var delta = [
            {x: 1, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: -1}
        ];

        this.graphics.loadPixels();

        this.graphics.set(startX, startY, colour);

        while (!queue.isEmpty) {
            var currentPoint = queue.head;
            queue.dequeue();
            this.graphics.set(currentPoint.x, currentPoint.y, colour);

            delta.forEach(direction => {
                var neighbourX = currentPoint.x + direction.x;
                var neighbourY = currentPoint.y + direction.y;

                if (this.isInside(neighbourX, neighbourY, targetColour())) {
                    visited.add(neighbourX, neighbourY);
                    queue.enqueue({x: neighbourX, y: neighbourY});
                }
            });
        }

        this.graphics.updatePixels();
    }
}

class Queue {
    constructor() {
        this.backingArray = [];
    }

    get head() {
        return this.backingArray[0];
    }

    get isEmpty() {
        return this.backingArray.length === 0;
    }

    dequeue() {
        if (!this.isEmpty) {
            this.backingArray.splice(0, 1);
        }
    }

    enqueue(element) {
        this.backingArray.push(element);
    }
}

class VisitedList {
    constructor() {
        this.backingArray = [];
    }

    add(x, y) {
        this.backingArray.push({x: x, y: y});
    }

    addIfAbsent(x, y) {
        if (!this.contains(x, y)) {
            this.add(x, y);
        }
    }

    contains(x, y) {
        return this.backingArray.find(pair => pair.x === x && pair.y === y);
    }
}