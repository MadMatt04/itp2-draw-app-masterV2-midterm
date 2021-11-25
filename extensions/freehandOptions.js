function FreehandOptions() {
    // Line thickness setting in pixels, default of 1.
    this.lineThickness = 1;

    var lineThicknessCallbacks = [];

    var self = this;

    // Creates the UI for setting the option
    this.createUi = function (parent) {

        var lineThicknessSlider = new LabeledSlider(parent, "Line thickness", "line-thickness-slider-ctrl",
            1, 100, 1, 1, "px", function (value) {
                self.lineThickness = value;
                lineThicknessCallbacks.forEach(callback => callback(self.lineThickness));
            });
    }


    this.onLineThicknessChanged = function (callback) {
        lineThicknessCallbacks.push(callback);
    }
}

function LabeledSlider(parent, label, sliderId, min, max, value, step, valueSuffix, valueChangedListener) {
    var container = createDiv(`<span class="ctrl-label">${label}:</label></span><span class="slider"></span>` +
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
}