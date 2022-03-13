/**
 * This constructor function contains builds and manages the UI to support the layer functionality.
 * @param layerManager The LayerManager this LayerUi operates on.
 * @constructor Returns a new LayerUi object with the specified settings.
 */
function LayerUi(layerManager) {

    /**
     * The buttons appearing at the bottom of the panel.
     */
    var layerButtons = [];

    /**
     * The currently selected layer.
     */
    var selectedLayer = layerManager.activeLayer();

    /**
     * The layer panel DOM element
     */
    var layerPanel;

    /**
     * Creates the layer panel UI.
     * @param parent The parent DOM element to attach the layer panel to.
     */
    this.createUi = function(parent) {

        // Create the sub-panel for the opacity control.
        var opacityPanel = createDiv();
        opacityPanel.addClass("opacityP");
        parent.child(opacityPanel);

        // Clamp the lower limit of opacity to 1%, because setting this to 0 also removes the color pixel information
        // from the underlying pixel array. Besides, if you want to fully remove the layer from rendering, you can
        // always click the eye (visibility) icon in the layers panel to make a layer invisible.
        var opacitySlider = new LabeledSlider(opacityPanel, "Opacity", "layer-opacity-slider-ctrl", 1, 100, 100,
            1, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                var alphaValue = value / 100.0;
                var mappedAlpha = Math.round(map(alphaValue, 0.0, 1.0, 0, 255));
                selectedLayer.alpha(mappedAlpha);
            });

        // The top-level layer panel.
        layerPanel = createDiv();
        layerPanel.addClass("layerP");
        parent.child(layerPanel);

        createLayerRows();

        // The next section creates all the buttons for managing the layers.

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

        // Add the buttons to the list.
        layerButtons.push(addBtn);
        layerButtons.push(upBtn);
        layerButtons.push(downBtn);
        layerButtons.push(renameBtn);
        layerButtons.push(deleteBtn);

        // Set the initial enabled status of the buttons.
        enableOrDisableButtons();
    };

    /**
     * Create a row in the layer panel for each layer.
     */
    var createLayerRows = function() {
        layerManager.layers.slice().reverse().forEach(layer => {
            layerPanel.child(createLayerRow(layer));
        });
    }

    /**
     * Create an element with the name and visibility toggle for the specified layer.
     * @param layer The layer to create the element for.
     * @returns A p5.Element representing a layer row.
     */
    var createLayerRow = function(layer) {
        // The top-level div.
        var layerRow = createDiv();
        layerRow.addClass("layerRow");

        // Add the selectedLayer class if the layer is selected.
        if (layer === selectedLayer) {
            layerRow.addClass("selectedLayer");
        }

        // Add the eye (visibility toggle) icon.
        var visibilityBtn = createImg("../assets/eye-svgrepo-com-orig.svg", "Layer visibility toggle");
        visibilityBtn.addClass("visibilityBtn");
        visibilityBtn.attribute('width', '25');
        layerRow.child(visibilityBtn);

        // A span containing the name of the layer.
        var span = createSpan(layer.name);
        span.addClass('layerN');
        layerRow.child(span);

        // This flag ensures that the event is consumed if we click on the eye (visibility) icon, so the selection
        // change is not triggered.
        var eventConsumed = false;

        // Logic to handle the click on the visibility icon. Change from icon to crossed out icon (or vice-versa).
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

        // Handle click on the layer row that is outside the eye (visibility icon) - this selects the layer.
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

    /**
     * Enables or disables buttons, based on the currently selected layer.
     */
    var enableOrDisableButtons = function() {
        for (var i = 0; i < layerButtons.length; i++) {
            // Enable Add and Rename button always. Enable other buttons too if not background layer.
            var enable = i === 0 || i === 3 || !selectedLayer.isBackgroundLayer();
            // Only enable move up and down if it makes sense given the layer's position.
            if (enable && layerManager.layers.length > 1) {
                if (i === 1) {
                    enable = !layerManager.isTopLayer(selectedLayer);
                }
                else if (i === 2) {
                    enable = !layerManager.isNextToBottomLayer(selectedLayer);
                }
            }

            // Add the appropriate classes for enabling and disabling.
            if (enable && layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].removeClass("disabled-btn");
            }
            else if (!enable && !layerButtons[i].hasClass("disabled-btn")) {
                layerButtons[i].addClass("disabled-btn");
            }
        }
    };

    /**
     * Add a new layer row.
     */
    var addLayer = function() {
        var layer = layerManager.createLayer();
        var layerRow = createLayerRow(layer);
        layerPanel.elt.prepend(layerRow.elt);
        selectLayer(layer, layerRow);
    };

    /**
     * Deletes a layer. First prompts for confirmation.
     */
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

    /**
     * Deselects all layers.
     */
    var deselectLayer = function() {
        if (layerPanel) {
            layerPanel.child().forEach(layerRow => {
                new p5.Element(layerRow).removeClass("selectedLayer");
            });
        }
    };

    /**
     * Selects the layer represented by the layer parameter and the specified layerRow.
     * @param layer The Layer object to select.
     * @param layerRow The layer row that represents the specified layer.
     */
    var selectLayer = function(layer, layerRow) {
        deselectLayer();
        selectedLayer = layer;
        layerManager.activeLayer(selectedLayer);
        layerRow.addClass("selectedLayer");
        enableOrDisableButtons();
    };

    /**
     * Moves the layer up the panel.
     */
    var moveLayerUp = function() {
        moveLayer(layerManager.moveLayerUp, -1, 0);
    };

    /**
     * Moves the layer down the panel.
     */
    var moveLayerDown = function() {
        moveLayer(layerManager.moveLayerDown, 1, -1);
    };

    /**
     * Move the layer up or down the panel and handle all the UI properly.
     * @param moveLayerMethod The LayerManager method that handles the logic of moving the layer up or down.
     * @param offset The direction of movement, which is -1 for up and 1 for down the panel. Note that this is exactly
     * reverse of how the layers are ordered in LayerManager.
     * @param insertBeforeOffset The offset used in the calculation of where to insert the moved row.
     */
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

    /**
     * Handles the UI logic for renaming the layer by prompting the user for a new name and then executing the
     * proper logic.
     */
    var renameLayer = function() {
        var newName = prompt("Rename layer to", selectedLayer.name);
        selectedLayer.name = newName;
        var layerRow = findSelectedLayerRow();
        var span = layerRow.elt.getElementsByTagName("span")[0];
        span.innerHTML = newName;
    };

    /**
     * Finds and returns the p5.Element DOM element representing the selected layer.
     * @returns {p5.Element}
     */
    var findSelectedLayerRow = function() {
        return Array.from(layerPanel.child()).map(layerRow => new p5.Element(layerRow)).find(
            layerRow => layerRow.hasClass("selectedLayer"));
    };
}