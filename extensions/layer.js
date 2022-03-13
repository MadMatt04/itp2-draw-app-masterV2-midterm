/**
 * A constructor function representing a layer (a drawing surface).
 * @param name The name of the layer.
 * @param layerWidth The width of the layer (in pixels).
 * @param layerHeight The height of the layer (in pixels).
 * @param backgroundLayer The flag indicating whether this is a background layer. False by default.
 * @constructor A constructor Creates a new Layer with the specified options.
 */
function Layer(name, layerWidth, layerHeight, backgroundLayer = false) {
    /**
     * The layer name.
     */
    this.name = name;

    /**
     * A p5.Graphics object representing the off-screen drawing surface.
     * @type {p5.Graphics} The drawing surface.
     */
    this.graphics = createGraphics(layerWidth, layerHeight);

    /**
     * Whether the layer's contents are visible on the canvas.
     * @type {boolean} True if visible, false otherwise.
     */
    this.visible = true;

    /**
     * The opacity before it was set to the current one.
     * @type {number} Opacity in the 0 to 255 range.
     */
    var previousAlpha = 255;

    /**
     * The current opacity.
     * @type {number} Opacity in the 0 to 255 range.
     */
    var alpha = 255;

    var self = this;

    /**
     * Initializes the layer. Sets the background colour to transparent, or, in the case of the background layer, to
     * white.
     */
    var init = function() {
        if (backgroundLayer) {
            self.graphics.background(255);
        }
        else {
            self.graphics.clear();
        }
    }

    /**
     * The function that is called on every draw cycle. Renders this layer's contents to the canvas, first making sure
     * that the current opacity settings are observed.
     */
    this.draw = function() {
        if (previousAlpha !== alpha) {
            adjustOpacity();
        }

        image(this.graphics, 0, 0);
    }

    /**
     * Whether this is a background layer or not.
     * @returns {boolean} True if background layer, false otherwise.
     */
    this.isBackgroundLayer = function() {
        return backgroundLayer;
    }

    /**
     * Toggles the visibility flag.
     */
    this.toggleVisibility = function() {
        this.visible = !this.visible;
    }

    /**
     * Sets or returns the current opacity (alpha) value.
     * @param alphaValue If specified, sets the current opacity to this value. It also properly sets the previousAlpha
     * variable to the old value of opacity.
     * @returns {number} If alphaValue not specified, returns the current alpha value.
     */
    this.alpha = function(alphaValue) {
        if (alphaValue === undefined) {
            return alpha;
        }

        previousAlpha = alpha;
        alpha = alphaValue;
    }

    /**
     * A function that manipulates this layer's p5.Graphics rendering surface to set each pixel to the correct opacity,
     * as specified by the alpha variable.
     */
    var adjustOpacity = function() {

        // Prepare the pixels of the layer's rendering surface for manipulation.
        self.graphics.loadPixels();
        // Pixel density, to properly support retina displays.
        let d = self.graphics.pixelDensity();
        // Iterate through horizontal coordinates.
        for (var x = 0; x < width; x++) {
            // Iterate through vertical coordinates.
            for (var y = 0; y < height; y++) {
                // Iterate through each sub-pixel
                for (let i = 0; i < d; i++) {
                    for (let j = 0; j < d; j++) {
                        // Calculate the index of manipulated pixel from all the coordinates.
                        var index = 4 * ((y * d + j) * width * d + (x * d + i));
                        // Obtain current opacity value for the pixel.
                        var currentPixelAlpha = self.graphics.pixels[index + 3];
                        // Set the new opacity value, unless we're already transparent.
                        if (currentPixelAlpha !== 0) {
                            self.graphics.pixels[index + 3] = alpha;
                        }
                    }
                }
            }
        }

        // Conclude pixel manipulation.
        self.graphics.updatePixels();
        // Set the previous opacity to current opacity.
        previousAlpha = alpha;
    };

    // Initialize itself.
    init();
}