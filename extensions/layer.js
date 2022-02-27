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
    }

    var adjustOpacity = function() {

        var count = 0;
        self.graphics.loadPixels();
        let d = self.graphics.pixelDensity();
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                for (let i = 0; i < d; i++) {
                    for (let j = 0; j < d; j++) {
                        // loop over
                        var index = 4 * ((y * d + j) * width * d + (x * d + i));
                        var currentPixelAlpha = self.graphics.pixels[index + 3];
                        if (currentPixelAlpha !== 0) {
                            self.graphics.pixels[index + 3] = alpha;
                        }
                        count++;
                    }
                }
            }
        }

        self.graphics.updatePixels();
        previousAlpha = alpha;
    };

    init();
}