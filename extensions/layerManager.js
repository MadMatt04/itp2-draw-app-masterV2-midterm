function LayerManager(layerWidth, layerHeight) {

    this.createLayer = function(name, backgroundLayer=false) {
        return new Layer(name, layerWidth, layerHeight, backgroundLayer);
    };

    var currentLayerIndex = 0;
    this.layers = [this.createLayer("Background", true)];

    this.currentLayer = function(layerIndex) {
        if (layerIndex === undefined) {
            return this.layers[currentLayerIndex];
        }

        currentLayerIndex = min(layerIndex, this.layers.length - 1);
    }

    this.draw = function() {
        this.layers.forEach(layer => {
            if (layer.visible) {
                layer.draw();
            }
        });
    }

    this.graphics = function() {
        return this.currentLayer().graphics;
    }

    console.log("pixels", pixels);
    console.log("pixelDensity", pixelDensity());
}