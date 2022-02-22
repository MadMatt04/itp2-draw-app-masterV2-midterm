function LayerManager(layerWidth, layerHeight) {

    this.layers = [];
    var activeLayerChangedCallbacks = [];
    var self = this;

    this.createLayer = function(name=null, backgroundLayer=false) {

        var actualName;
        if (!name) {
            actualName = `Layer ${this.layers.length}`
        } else {
            actualName = name;
        }

        var layer = new Layer(actualName, layerWidth, layerHeight, backgroundLayer);
        this.layers.push(layer);
        return layer;
    };


    this.layers = [this.createLayer("Background", true)];
    var activeLayer = this.layers[0];

    this.activeLayer = function(layer) {
        if (layer === undefined) {
            return activeLayer;
        }

        if (layer === activeLayer) {
            return;
        }

        if (this.layers.includes(layer)) {
            activeLayer = layer;
            activeLayerChangedCallbacks.forEach(callback => callback(activeLayer));
        } else {
            console.error("Cannot switch to layer", layer, "because it is not registered with the layer manager.");
        }
    }

    this.topLayer = function() {
        return this.layers[this.layers.length - 1];
    };

    this.bottomLayer = function() {
        return this.layers[0];
    }

    this.isTopLayer = function(layer) {
        return this.topLayer() === layer;
    }

    this.isBottomLayer = function(layer) {
        return this.bottomLayer() === layer;
    }

    this.isNextToBottomLayer = function(layer) {
        return this.layers.length > 1 && this.layers[1] === layer;
    }

    this.moveLayerUp = function(layer) {
        return moveLayer(layer, 1);
    }

    this.moveLayerDown = function(layer) {
        return moveLayer(layer, -1);
    }

    var moveLayer = function(layer, direction) {
        var index = self.layers.findIndex(l => l === layer);
        if (index >= 0) {
            self.layers.splice(index, 1);
            self.layers.splice(index + direction, 0,  layer);
        }

        return index + direction;
    }

    this.deleteLayer = function(layer) {
        var layerIndex = this.layers.findIndex(l => l === layer);
        if (layerIndex >= 0) {
            this.layers.splice(layerIndex, 1);
            return layerIndex;
        }

        console.error("Cannot delete layer", layer, "because it is not registered with the layer manager.");
        return -1;
    }

    this.draw = function() {
        this.layers.forEach(layer => {
            if (layer.visible) {
                layer.draw();
            }
        });
    }

    this.graphics = function() {
        return this.activeLayer().graphics;
    }

    this.onActiveLayerChanged = function(callback) {
        activeLayerChangedCallbacks.push(callback);
    }

    console.log("pixels", pixels);
    console.log("pixelDensity", pixelDensity());
}