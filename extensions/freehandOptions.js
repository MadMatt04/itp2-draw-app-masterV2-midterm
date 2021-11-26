function FreehandOptions() {

    var lineThicknessCallbacks = [];
    var opacityCallbacks = [];

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
    }

    this.onLineThicknessChanged = function (callback) {
        lineThicknessCallbacks.push(callback);
    }

    this.onOpacityChanged = function (callback) {
        opacityCallbacks.push(callback);
    }
}

function LabeledSlider(parent, label, sliderId, min, max, value, step, valueSuffix, valueChangedListener) {
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span><span class="slider"></span>` +
        `<span class="ctrl-label value-label">${value}&nbsp;${valueSuffix}</span>`);
    container.class("slider-ctrl");
    container.id(sliderId);
    container.parent(parent);

    var slider = createSlider(min, max, value, step);
    slider.parent(select(`#${sliderId} .slider`));

    var valueLabel = select(`#${sliderId} .value-label`);

    slider.mouseMoved(function () {
        if (mouseIsPressed) {
            var currentValue = slider.value();
            valueLabel.html(`${currentValue}&nbsp;${valueSuffix}`);
            if (valueChangedListener) {
                valueChangedListener(currentValue);
            }
        }
    });

    this.value = function() {
        return slider.value();
    }
}