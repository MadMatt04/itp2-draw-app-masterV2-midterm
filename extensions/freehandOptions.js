function FreehandOptions() {

    var lineThicknessCallbacks = [];
    var opacityCallbacks = [];
    var lineTypeCallbacks = [];
    var eraserCallbacks = [];
    var jitterCallbacks = [];


    this.lineThickness = 1;
    this.lineType = "Solid";
    this.eraserMode = false;
    this.jitterRadius = 0;

    var self = this;

    // Creates the UI for setting the option
    this.createUi = function (parent) {

        var lineThicknessSlider = new LabeledSlider(parent, "Line thickness", "line-thickness-slider-ctrl",
            1, 100, 1, 1, "px", function (value) {
                self.lineThickness = value;
                lineThicknessCallbacks.forEach(callback => callback(value));
            });

        var opacitySlider = new LabeledSlider(parent, "Opacity", "opacity-slider-ctrl", 0, 100, 100,
            1, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                var alphaValue = value / 100.0;
                opacityCallbacks.forEach(callback => callback(alphaValue));
            });

        var lineTypeSelect = new LabeledSelect(parent, "Line type", "line-type-select-ctrl",
            ["------- Solid", "- - - - Dashed", "........ Dotted", ".*.*.*.* Jitter"],
            ["Solid", "Dashed", "Dotted", "Jitter"],
            function (lineType) {
                self.lineType = lineType;
                lineTypeCallbacks.forEach(callback => callback(lineType));
                console.log("Line type changed to", lineType);
            });

        var eraserCheckbox = new EraserCheckbox(parent, function(value) {
            console.log("Eraser mode", value === true ? "on." : "off.", value);
            self.eraserMode = value;
            eraserCallbacks.forEach(callback => callback(value));
        });

        self.jitterSlider = new LabeledSlider(parent, "Jitter radius", "jitter-radius-slider-ctrl",
            0, 20, 0, 1, "px", function (value) {
                self.jitterRadius = value;
                jitterCallbacks.forEach(callback => callback(value));
            });
        self.jitterSlider.setVisible(false);

    }

    this.onLineThicknessChanged = function (callback) {
        lineThicknessCallbacks.push(callback);
    }

    this.onOpacityChanged = function (callback) {
        opacityCallbacks.push(callback);
    }

    this.onLineTypeChanged = function (callback) {
        lineTypeCallbacks.push(callback);
    }

    this.onEraserModeChanged = function(callback) {
        eraserCallbacks.push(callback);
    }

    this.onJitterRadiusChanged = function(callback) {
        jitterCallbacks.push(callback);
    }
}

function LabeledSlider(parent, label, sliderId, min, max, value, step, valueSuffix, valueChangedListener) {
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span><span class="slider"></span>` +
        `<span class="ctrl-label value-label">${value}&nbsp;${valueSuffix}</span>`);
    container.class("slider-ctrl");
    container.id(sliderId);
    container.parent(parent);

    var sliderCtrl = createSlider(min, max, value, step);
    sliderCtrl.parent(select(`#${sliderId} .slider`));

    var valueLabel = select(`#${sliderId} .value-label`);

    sliderCtrl.mouseMoved(function () {
        if (mouseIsPressed) {
            var currentValue = sliderCtrl.value();
            valueLabel.html(`${currentValue}&nbsp;${valueSuffix}`);
            if (valueChangedListener) {
                valueChangedListener(currentValue);
            }
        }
    });

    this.value = function () {
        return sliderCtrl.value();
    }

    this.setVisible = function(visible) {
        if (visible) {
            container.show();
        } else {
            container.hide();
        }
    }
}

function LabeledSelect(parent, label, selectId, optionNames, optionValues, valueSelectedListener) {
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span>` +
        `<span class="select"></span>`);
    container.class("select-ctrl");
    container.id(selectId);
    container.parent(parent);

    var selectCtrl = createSelect();
    if (!optionValues) {
        optionNames.forEach(opt => selectCtrl.option(opt));
    }
    else {
        for (var i = 0; i < optionNames.length; i++) {
            selectCtrl.option(optionNames[i], optionValues[i]);
        }
    }
    selectCtrl.parent(select(`#${selectId} .select`));

    if (valueSelectedListener) {
        selectCtrl.changed(function () {
            valueSelectedListener(selectCtrl.value());
        });
    }
}

function EraserCheckbox(parent, valueChangedListener) {
    var checkboxCtrl = createCheckbox("Eraser mode", false);
    checkboxCtrl.parent(parent);

    if (valueChangedListener) {
        checkboxCtrl.changed(function() {
            valueChangedListener(checkboxCtrl.checked());
        })
    }
}