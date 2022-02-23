function LayerUi(layerManager) {

    var layerButtons = [];
    var selectedLayer = layerManager.activeLayer();
    var layerPanel;

    this.createUi = function(parent) {
        console.log("Layer UI parent", parent);

        var opacityPanel = createDiv();
        opacityPanel.addClass("opacityP");
        parent.child(opacityPanel);

        var opacitySlider = new LabeledSlider(opacityPanel, "Opacity", "layer-opacity-slider-ctrl", 0, 100, 100,
            1, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                var alphaValue = value / 100.0;
                var mappedAlpha = Math.round(map(alphaValue, 0.0, 1.0, 0, 255));
                selectedLayer.alpha(mappedAlpha);
            });

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
        upBtn.mousePressed(moveLayerUp);

        var downBtn = createImg("../assets/down-square-svgrepo-com.svg", "Layer down");
        downBtn.attribute("title", "Move layer down");
        downBtn.addClass("b3");
        parent.child(downBtn);
        downBtn.mousePressed(moveLayerDown);

        var renameBtn = createImg("../assets/rename-svgrepo-com.svg", "Rename layer");
        renameBtn.attribute("title", "Rename layer");
        renameBtn.addClass("b4");
        parent.child(renameBtn);
        renameBtn.mousePressed(renameLayer);

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

        var eventConsumed = false;

        visibilityBtn.mousePressed(function() {
            layer.toggleVisibility();
            if (layer.visible) {
                visibilityBtn.elt.src = "../assets/eye-svgrepo-com-orig.svg";
            }
            else {
                visibilityBtn.elt.src = "../assets/eye-crossed.svg";
            }
            eventConsumed = true;
        });

        layerRow.mousePressed(function() {
            if (!eventConsumed) {
                selectLayer(layer, layerRow);
            }
            else {
                eventConsumed = false;
            }
        });

        return layerRow;
    };

    var enableOrDisableButtons = function() {
        for (var i = 0; i < layerButtons.length; i++) {
            var enable = i === 0 || i === 3 || !selectedLayer.isBackgroundLayer();
            if (enable && layerManager.layers.length > 1) {
                if (i === 1) {
                    enable = !layerManager.isTopLayer(selectedLayer);
                }
                else if (i === 2) {
                    enable = !layerManager.isNextToBottomLayer(selectedLayer);
                }
            }

            if (enable && layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].removeClass("disabled-btn");
            }
            else if (!enable && !layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].addClass("disabled-btn");
            }
        }
    };

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
    };

    var deselectLayer = function() {
        if (layerPanel) {
            layerPanel.child().forEach(layerRow => {
                new p5.Element(layerRow).removeClass("selectedLayer");
            });
        }
    };

    var selectLayer = function(layer, layerRow) {
        deselectLayer();
        selectedLayer = layer;
        console.log("Selected layer", layer.name);
        layerManager.activeLayer(selectedLayer);
        layerRow.addClass("selectedLayer");
        enableOrDisableButtons();
    };

    var moveLayerUp = function() {
        moveLayer(layerManager.moveLayerUp, -1, 0);
    };

    var moveLayerDown = function() {
        moveLayer(layerManager.moveLayerDown, 1, -1);
    };

    var moveLayer = function(moveLayerMethod, offset, insertBeforeOffset) {
        var layerIndex = moveLayerMethod.call(layerManager, selectedLayer);
        var layerRows = Array.from(layerPanel.child()).map(layerRow => new p5.Element(layerRow)).reverse();
        var movedRow = layerRows[layerIndex + offset];
        var insertBeforeRow = layerRows[layerIndex + insertBeforeOffset];
        movedRow.elt.remove();
        layerRows.splice(layerIndex - offset, 1);
        layerPanel.elt.insertBefore(movedRow.elt, insertBeforeRow.elt);
        selectLayer(selectedLayer, movedRow);
    };

    var renameLayer = function() {
        var newName = prompt("Rename layer to", selectedLayer.name);
        selectedLayer.name = newName;
        var layerRow = findSelectedLayerRow();
        var span = layerRow.elt.getElementsByTagName("span")[0];
        span.innerHTML = newName;
        console.log("SPAN", span);
    };

    var findSelectedLayerRow = function() {
        return Array.from(layerPanel.child()).map(layerRow => new p5.Element(layerRow)).find(
            layerRow => layerRow.hasClass("selectedLayer"));
    };
}