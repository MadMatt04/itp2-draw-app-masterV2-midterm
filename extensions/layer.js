function Layer(name, layerWidth, layerHeight, backgroundLayer = false) {
    this.name = name;

    this.graphics = createGraphics(layerWidth, layerHeight);

    this.visible = true;

    var previousAlpha = 255;
    var alpha = 255;

    var self = this;

    var init = function() {
        if (backgroundLayer) {
            self.graphics.background(255);
        } else {
            self.graphics.clear();
        }
    }

    this.draw = function() {
        if (previousAlpha !== alpha) {
            adjustOpacity();
        }

        image(this.graphics, 0, 0);
    }

    this.isBackgroundLayer = function() {
        return backgroundLayer;
    }

    this.toggleVisibility = function() {
        this.visible = !this.visible;
    }

    this.alpha = function(alphaValue) {
        if (alphaValue === undefined) {
            return alpha;
        }

        previousAlpha = alpha;
        alpha = alphaValue;
        console.log("Layer opacity set to", alpha);
    }

    var adjustOpacity = function() {

        // FIXME Investigate if clearing to 0 makes this not work!! It does, that's the issue, 0 alpha clears the pixels!
        var palpha = false;
        var count = 0;
        self.graphics.loadPixels();
        let d = self.graphics.pixelDensity();
        console.log("d", d);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                for (let i = 0; i < d; i++) {
                    for (let j = 0; j < d; j++) {
                        // loop over
                        var index = 4 * ((y * d + j) * width * d + (x * d + i));
                        if (!palpha) {
                            // TODO remove
                            console.log("PALPHA", self.graphics.pixels[index + 3]);
                            palpha = true;
                        }
                        self.graphics.pixels[index+3] = alpha;
                        count++;
                    }
                }
            }
        }

        self.graphics.updatePixels();
        console.log(`Updated ${count} pixels.`)

        previousAlpha = alpha;
    };

    init();
}