function LayerUi(layerManager) {

    var layerButtons = [];

    this.createUi = function(parent) {
        console.log("Layer UI parent", parent);

        var opacityPanel = createDiv();
        opacityPanel.class("opacityP");
        parent.child(opacityPanel);

        var layerPanel = createDiv();
        layerPanel.class("layerP");
        parent.child(layerPanel);

        createLayerRows(layerPanel);

        var addBtn = createImg("../assets/add-svgrepo-com.svg", "New layer");
        addBtn.attribute("title", "New layer");
        addBtn.class("b1");
        parent.child(addBtn);

        var upBtn = createImg("../assets/up-square-svgrepo-com.svg", "Layer up");
        upBtn.attribute("title", "Move layer up");
        upBtn.class("b2");
        parent.child(upBtn);

        var downBtn = createImg("../assets/down-square-svgrepo-com.svg", "Layer down");
        downBtn.attribute("title", "Move layer down");
        downBtn.class("b3");
        parent.child(downBtn);

        var renameBtn = createImg("../assets/rename-svgrepo-com.svg", "Rename layer");
        renameBtn.attribute("title", "Rename layer");
        renameBtn.class("b4");
        parent.child(renameBtn);

        var deleteBtn = createImg("../assets/delete-close-svgrepo-com.svg", "Delete layer");
        deleteBtn.attribute("title", "Delete layer");
        deleteBtn.class("b5");
        parent.child(deleteBtn);

        layerButtons.push(addBtn);
        layerButtons.push(upBtn);
        layerButtons.push(downBtn);
        layerButtons.push(renameBtn);
        layerButtons.push(deleteBtn);

        disableButtons();
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

        var visibilityBtn = createImg("../assets/eye-svgrepo-com-orig.svg", "Layer visibility toggle");
        visibilityBtn.class("visibilityBtn");
        visibilityBtn.attribute('width', '25');
        layerRow.child(visibilityBtn);

        var span = createSpan(layer.name);
        span.class('layerN');
        layerRow.child(span);

        parent.child(layerRow);
    }

    var disableButtons = function() {
        for (var i = 0; i < layerButtons.length; i++) {
            layerButtons[i].class(`b${i+1} disabled-btn`)
        }
    }

    var enableButtons = function() {
        for (var i = 0; i < layerButtons.length; i++) {
            layerButtons[i].class(`b${i+1}`)
        }
    }
}