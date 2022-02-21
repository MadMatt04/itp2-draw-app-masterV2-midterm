function Layer(name, layerWidth, layerHeight, backgroundLayer = false) {
    this.name = name;

    this.graphics = createGraphics(layerWidth, layerHeight);

    this.visible = true;

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
        image(this.graphics, 0, 0);
    }

    this.isBackgroundLayer = function() {
        return backgroundLayer;
    }

    this.toggleVisibility = function() {
        this.visible = !this.visible;
    }

    init();
}