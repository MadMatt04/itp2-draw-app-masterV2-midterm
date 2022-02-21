function LayerUi(layerManager) {

    var layerButtons = [];
    var selectedLayer = layerManager.activeLayer();
    var layerPanel;

    this.createUi = function(parent) {
        console.log("Layer UI parent", parent);

        var opacityPanel = createDiv();
        opacityPanel.addClass("opacityP");
        parent.child(opacityPanel);

        layerPanel = createDiv();
        layerPanel.addClass("layerP");
        parent.child(layerPanel);

        createLayerRows();

        var addBtn = createImg("../assets/add-svgrepo-com.svg", "New layer");
        addBtn.attribute("title", "New layer");
        addBtn.addClass("b1");
        parent.child(addBtn);
        addBtn.mousePressed(addLayer);

        var upBtn = createImg("../assets/up-square-svgrepo-com.svg", "Layer up");
        upBtn.attribute("title", "Move layer up");
        upBtn.addClass("b2");
        parent.child(upBtn);

        var downBtn = createImg("../assets/down-square-svgrepo-com.svg", "Layer down");
        downBtn.attribute("title", "Move layer down");
        downBtn.addClass("b3");
        parent.child(downBtn);

        var renameBtn = createImg("../assets/rename-svgrepo-com.svg", "Rename layer");
        renameBtn.attribute("title", "Rename layer");
        renameBtn.addClass("b4");
        parent.child(renameBtn);

        var deleteBtn = createImg("../assets/delete-close-svgrepo-com.svg", "Delete layer");
        deleteBtn.attribute("title", "Delete layer");
        deleteBtn.addClass("b5");
        parent.child(deleteBtn);
        deleteBtn.mousePressed(deleteLayer);

        layerButtons.push(addBtn);
        layerButtons.push(upBtn);
        layerButtons.push(downBtn);
        layerButtons.push(renameBtn);
        layerButtons.push(deleteBtn);

        enableOrDisableButtons();
    };

    var createLayerRows = function() {
        layerManager.layers.slice().reverse().forEach(layer => {
            layerPanel.child(createLayerRow(layer));
        });
    }

    var createLayerRow = function(layer) {
        var layerRow = createDiv();
        layerRow.addClass("layerRow");
        if (layer === selectedLayer) {
            layerRow.addClass("selectedLayer");
        }

        var visibilityBtn = createImg("../assets/eye-svgrepo-com-orig.svg", "Layer visibility toggle");
        visibilityBtn.addClass("visibilityBtn");
        visibilityBtn.attribute('width', '25');
        layerRow.child(visibilityBtn);

        var span = createSpan(layer.name);
        span.addClass('layerN');
        layerRow.child(span);

        layerRow.mousePressed(function() {
            selectLayer(layer, layerRow);
        });

        return layerRow;
    };

    var enableOrDisableButtons = function() {
        for (var i = 0; i < layerButtons.length; i++) {
            var enable = i === 0 || !selectedLayer.isBackgroundLayer();
            if (enable && layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].removeClass("disabled-btn");
            }
            else if (!enable && !layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].addClass("disabled-btn");
            }
        }
    }

    var addLayer = function() {
        var layer = layerManager.createLayer();
        var layerRow = createLayerRow(layer);
        layerPanel.elt.prepend(layerRow.elt);
        selectLayer(layer, layerRow);
    };

    var deleteLayer = function() {
        if (window.confirm(`Really remove layer '${selectedLayer.name}'?`)) {
            var deletedLayerIndex = layerManager.deleteLayer(selectedLayer);
            if (deletedLayerIndex >= 0) {
                var layerToSelect = layerManager.topLayer();
                var layerRows = Array.from(layerPanel.child()).map(layerRow => new p5.Element(layerRow)).reverse();
                layerRows[deletedLayerIndex].elt.remove();
                layerRows.splice(deletedLayerIndex, 1);
                selectLayer(layerToSelect, layerRows[layerRows.length - 1]);
                enableOrDisableButtons();
            }
        }
    }

    var deselectLayer = function() {
        if (layerPanel) {
            layerPanel.child().forEach(layerRow => {
                new p5.Element(layerRow).removeClass("selectedLayer");
            });
        }
    };

    var selectLayer = function(layer, layerRow) {
        if (selectedLayer !== layer) {
            deselectLayer();
            selectedLayer = layer;
            console.log("Selected layer", layer.name);
            layerManager.activeLayer(selectedLayer);
            layerRow.addClass("selectedLayer");
            enableOrDisableButtons();
        }
    }
}