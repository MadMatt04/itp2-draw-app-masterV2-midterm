function Layer(name, layerWidth, layerHeight) {
    this.name = name;

    this.graphics = createGraphics(layerWidth, layerHeight);

    this.visible = true;

    var alpha = 255;

    var self = this;

    var init = function() {
        self.graphics.clear();
    }

    this.draw = function() {
        image(this.graphics, 0, 0);
    }

    init();
}