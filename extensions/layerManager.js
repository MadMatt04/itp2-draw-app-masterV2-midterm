/**
 * The constructor function for the LayerManager, which contains all the logic for layer manipulation (creating,
 * deleting, toggling visibility, opacity, renaming the layer etc.).
 * @param layerWidth The width of the layers the manager will create, in pixels.
 * @param layerHeight The height of the layer the manager will create, in pixels.
 * @constructor Creates a new LayerManager with the specified settings.
 */
function LayerManager(layerWidth, layerHeight) {

    /**
     * The list of layers managed by this LayerManager.
     * @type {*[]} An array of Layer objects.
     */
    this.layers = [];

    /**
     * Holds the callbacks that are invoked whenever the active layer changes.
     * @type {*[]} An array of function callbacks.
     */
    var activeLayerChangedCallbacks = [];
    var self = this;

    /**
     * A method that creates a new layer and puts in the list of managed layers.
     * @param name The name of the new layer. If null (the default), a new name of the type 'Layer 3' will be generated.
     * @param backgroundLayer Whether the new layer is a background layer.
     * @returns {Layer} The newly created layer.
     */
    this.createLayer = function(name=null, backgroundLayer=false) {

        var actualName;

        // If name not specified, create it by appending the number of managed layers to 'Layer'
        if (!name) {
            actualName = `Layer ${this.layers.length}`
        } else {
            actualName = name;
        }

        var layer = new Layer(actualName, layerWidth, layerHeight, backgroundLayer);
        this.layers.push(layer);
        return layer;
    };

    // Create the default, background, layer.
    this.createLayer("Background", true);

    /**
     * The active layer is the one we're currently drawing on.
     * @type {Layer} A Layer object.
     */
    var activeLayer = this.layers[0];

    /**
     * Returns or sets the active layer. The active layer is the one we're currently drawing on.
     * @param layer If specified, will set the active layer to the specified layer, but only if the specified layer
     * is managed by this LayerManager.
     * @returns {Layer}
     */
    this.activeLayer = function(layer) {
        if (layer === undefined) {
            return activeLayer;
        }

        // We're already set to this layer, so just return it without triggering the callback.
        if (layer === activeLayer) {
            return layer;
        }

        // Check if we're managing the layer.
        if (this.layers.includes(layer)) {
            activeLayer = layer;
            activeLayerChangedCallbacks.forEach(callback => callback(activeLayer));
        } else {
            console.error("Cannot switch to layer", layer, "because it is not registered with the layer manager.");
        }
    }

    /**
     * Returns the layer being drawn first.
     * @returns {Layer} A Layer object.
     */
    this.topLayer = function() {
        return this.layers[this.layers.length - 1];
    };

    /**
     * Returns the layer being drawn last.
     * @returns {Layer} A Layer object.
     */
    this.bottomLayer = function() {
        return this.layers[0];
    }

    /**
     * Checks if the specified layer is the top layer - being drawn first.
     * @param layer The layer to check.
     * @returns {boolean} True if the layer is the top layer, false otherwise.
     */
    this.isTopLayer = function(layer) {
        return this.topLayer() === layer;
    }

    /**
     * Checks if the specified layer is the bottom layer - being drawn last.
     * @param layer The layer to check.
     * @returns {boolean} True if the layer is the bottom layer, false otherwise.
     */
    this.isBottomLayer = function(layer) {
        return this.bottomLayer() === layer;
    }

    /**
     * Checks if the specified layer is being drawn next to last.
     * @param layer The layer to check.
     * @returns {boolean} True if the layer is drawn next to last, false otherwise.
     */
    this.isNextToBottomLayer = function(layer) {
        return this.layers.length > 1 && this.layers[1] === layer;
    }

    /**
     * Moves layer up in the layer list (so that is drawn earlier).
     * @param layer The layer to move up in the list.
     * @returns {Number} The new position of the layer.
     */
    this.moveLayerUp = function(layer) {
        return moveLayer(layer, 1);
    }

    /**
     * Moves layer down in the layer list (so that is drawn later).
     * @param layer The layer to move down in the list.
     * @returns {Number} The new position of the layer.
     */
    this.moveLayerDown = function(layer) {
        return moveLayer(layer, -1);
    }

    /**
     * The private method that moves the layer up or down in the list, depending on direction.
     * @param layer The layer to move up or down.
     * @param direction The direction of movement: +1 for up and -1 for down.
     * @returns {Number} The new position of the layer.
     */
    var moveLayer = function(layer, direction) {
        // Find the layer in the list of layers.
        var index = self.layers.findIndex(l => l === layer);
        // If found, move it.
        if (index >= 0) {
            self.layers.splice(index, 1);
            self.layers.splice(index + direction, 0,  layer);
        } else {
            return index;
        }

        return index + direction;
    }

    /**
     * Removes the layer from the layer list.
     * @param layer The layer to remove.
     * @returns {number} The position where the layer was removed from.
     */
    this.deleteLayer = function(layer) {
        var layerIndex = this.layers.findIndex(l => l === layer);
        if (layerIndex >= 0) {
            this.layers.splice(layerIndex, 1);
            return layerIndex;
        }

        console.error("Cannot delete layer", layer, "because it is not registered with the layer manager.");
        return -1;
    }

    /**
     * The rendering function that is called on every rendering cycle. Draws each layer onto the canvas, but only if
     * they're visible.
     */
    this.draw = function() {
        this.layers.forEach(layer => {
            if (layer.visible) {
                layer.draw();
            }
        });
    }

    /**
     * Returns the rendering surface.
     * @returns {p5.Graphics} The rendering surface object.
     */
    this.graphics = function() {
        return this.activeLayer().graphics;
    }

    /**
     * Register a callback to be invoked when the active layer changes.
     * @param callback The function to register as the callback.
     */
    this.onActiveLayerChanged = function(callback) {
        activeLayerChangedCallbacks.push(callback);
    }

    /**
     * Clears all the layers - sets them to transparent, or else to white for the background layer. This is implemented
     * so that the Clear button works correctly.
     */
    this.clearAllLayers = function() {
        this.layers.forEach(layer => {
            layer.graphics.clear();
            if (layer.isBackgroundLayer()) {
                layer.graphics.background(255);
            }
        });
    }
}