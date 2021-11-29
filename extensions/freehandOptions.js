function FreehandOptions() {

    var lineThicknessCallbacks = [];
    var opacityCallbacks = [];
    var lineTypeCallbacks = [];

    this.lineType = "Solid";

    var self = this;

    // Creates the UI for setting the option
    this.createUi = function (parent) {

        var lineThicknessSlider = new LabeledSlider(parent, "Line thickness", "line-thickness-slider-ctrl",
            1, 100, 1, 1, "px", function (value) {
                lineThicknessCallbacks.forEach(callback => callback(value));
            });

        var opacitySlider = new LabeledSlider(parent, "Opacity", "opacity-slider-ctrl", 0, 100, 100,
            1, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                var alphaValue = value / 100.0;
                opacityCallbacks.forEach(callback => callback(alphaValue));
            });

        var lineType = new LabeledSelect(parent, "Line type", "line-type-select-ctrl",
            ["------- Solid", "- - - - Dashed", "........ Dotted"], ["Solid", "Dashed", "Dotted"],
            function(lineType) {
                self.lineType = lineType;
                console.log("Line type changed to", lineType);
            });
    }

    this.onLineThicknessChanged = function (callback) {
        lineThicknessCallbacks.push(callback);
    }

    this.onOpacityChanged = function (callback) {
        opacityCallbacks.push(callback);
    }

    this.onLineTypeChanged = function(callback) {
        lineTypeCallbacks.push(callback);
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

    this.value = function() {
        return sliderCtrl.value();
    }
}

function LabeledSelect(parent, label, selectId, optionNames, optionValues, valueSelectedListener) {
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span>` +
        `<span class="select"></span>`);
    container.class("slider-ctrl");
    container.id(selectId);
    container.parent(parent);

    var selectCtrl = createSelect();
    if (!optionValues)
    {
        optionNames.forEach(opt => selectCtrl.option(opt));
    } else {
        for (var i = 0; i < optionNames.length; i++)
        {
            selectCtrl.option(optionNames[i], optionValues[i]);
        }
    }
    selectCtrl.parent(select(`#${selectId} .select`));

    if (valueSelectedListener) {
        selectCtrl.changed(function() {
            valueSelectedListener(selectCtrl.value());
        });
    }
}