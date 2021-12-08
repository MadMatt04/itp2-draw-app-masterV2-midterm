function Layer(name, layerWidth, layerHeight) {
    this.name = name;

    this.graphics = createGraphics(layerWidth, layerHeight);

    this.visible = true;

    this.opacity = 1.0;

    var self = this;

    var init = function() {
        self.graphics.clear();
    }

    this.draw = function() {
        image(this.graphics, 0, 0);
    }

    init();
}