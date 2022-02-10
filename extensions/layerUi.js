function LayerUi(layerManager) {

    this.createUi = function(parent) {
        console.log("Layer UI parent", parent);

        var opacityPanel = createDiv();
        opacityPanel.class("opacityP");
        parent.child(opacityPanel);

        var layerPanel = createDiv();
        layerPanel.class("layerP");
        parent.child(layerPanel);

        createLayerRows(layerPanel);
    };

    var createLayerRows = function(parent) {
        layerManager.layers.forEach(layer => {
           createLayerRow(layer, parent);
        });
    }

    var createLayerRow = function(layer, parent) {
        console.log(layer.name);
        var layerRow = createDiv();
        layerRow.class("layerRow");

        var visibilityBtn = createImg("../assets/eye-svgrepo-com-orig.svg", "Visible layer");
        visibilityBtn.class("visibilityBtn");
        layerRow.child(visibilityBtn);

        var span = createSpan(layer.name);
        span.class('layerN');
        layerRow.child(span);

        parent.child(layerRow);
    }
}