/**
 * Implementation of options for the Freehand tool. The options are line thickness, line type, eraser, jitter and
 * opacity.
 *
 * @constructor Returns a new instance of FreehandOptions.
 */
function FreehandOptions() {

    // These private arrays hold callbacks that are invoked when corresponding options change.
    var lineThicknessCallbacks = [];
    var opacityCallbacks = [];
    var lineTypeCallbacks = [];
    var eraserCallbacks = [];
    var jitterCallbacks = [];


    /**
     * The line thickness.
     * @type {number} between 1 and 100 px.
     */
    this.lineThickness = 1;

    /**
     * The line type.
     * @type {string} One of Solid|Dotted|Dashed|Jitter.
     */
    this.lineType = "Solid";
    /**
     * Whether we're in eraser mode.
     * @type {boolean} True if in eraser mode.
     */
    this.eraserMode = false;
    /**
     * Jitter (displacement), in pixels.
     * @type {number} Between 0 (no jitter) and 20px.
     */
    this.jitterRadius = 0;

    var self = this;

    /**
     * Creates all the UI for controlling all the freehand tool options.
     * @param parent The parent container to attach the options UI to.
     */
    this.createUi = function (parent) {

        // Create slider to control line thickness.
        var lineThicknessSlider = new LabeledSlider(parent, "Line thickness", "line-thickness-slider-ctrl",
            1, 100, 1, 1, "px", function (value) {
                self.lineThickness = value;
                lineThicknessCallbacks.forEach(callback => callback(value));
            });

        // Create slider to control opacity.
        var opacitySlider = new LabeledSlider(parent, "Opacity", "opacity-slider-ctrl", 0, 100, 100,
            1, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                var alphaValue = value / 100.0;
                opacityCallbacks.forEach(callback => callback(alphaValue));
            });

        // Create a select to control line type, or activate jitter.
        var lineTypeSelect = new LabeledSelect(parent, "Line type", "line-type-select-ctrl",
            ["------- Solid", "- - - - Dashed", "........ Dotted", ".*.*.*.* Jitter"],
            ["Solid", "Dashed", "Dotted", "Jitter"],
            function (lineType) {
                self.lineType = lineType;
                lineTypeCallbacks.forEach(callback => callback(lineType));
                console.log("Line type changed to", lineType);
            });

        // Create a checkbox to control whether we're in eraser mode.
        var eraserCheckbox = new EraserCheckbox(parent, function(value) {
            console.log("Eraser mode", value === true ? "on." : "off.", value);
            self.eraserMode = value;
            eraserCallbacks.forEach(callback => callback(value));
        });

        // Create a slider to control jitter radius.
        self.jitterSlider = new LabeledSlider(parent, "Jitter radius", "jitter-radius-slider-ctrl",
            0, 20, 0, 1, "px", function (value) {
                self.jitterRadius = value;
                jitterCallbacks.forEach(callback => callback(value));
            });
        // Hide jitter control by default - it is only shown if the Jitter line type is selected.
        self.jitterSlider.setVisible(false);

    }

    /**
     * Register the specified callback to be called when line thickness changes.
     * @param callback The callback to register.
     */
    this.onLineThicknessChanged = function (callback) {
        lineThicknessCallbacks.push(callback);
    }

    /**
     * Register the specified callback to be called when opacity changes.
     * @param callback The callback to register.
     */
    this.onOpacityChanged = function (callback) {
        opacityCallbacks.push(callback);
    }

    /**
     * Register the specified callback to be called when line type changes.
     * @param callback The callback to register.
     */
    this.onLineTypeChanged = function (callback) {
        lineTypeCallbacks.push(callback);
    }

    /**
     * Register the specified callback to be called when eraser mode changes.
     * @param callback The callback to register.
     */
    this.onEraserModeChanged = function(callback) {
        eraserCallbacks.push(callback);
    }

    /**
     * Register the specified callback to be called when jitter radius changes.
     * @param callback The callback to register.
     */
    this.onJitterRadiusChanged = function(callback) {
        jitterCallbacks.push(callback);
    }
}

/**
 * A control wrapper around p5.Slider that also has a prefix and a postfix label.
 * @param parent The parent DOM element to attach the control to.
 * @param label The prefix label text.
 * @param sliderId The id of the slider control to create. Should be unique on the page.
 * @param min The minimal value that can be set on the slider.
 * @param max The maximal value that can be set on the slider.
 * @param value The initial value to set on the slider.
 * @param step The amount that the value can change in a single step.
 * @param valueSuffix The postfix label text.
 * @param valueChangedListener The listener to call when the value changes.
 * @constructor Creates a new LabeledSlider with the specified settings.
 */
function LabeledSlider(parent, label, sliderId, min, max, value, step, valueSuffix, valueChangedListener) {

    // The container holding the entire slider, that we attach to the parent.
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span><span class="slider"></span>` +
        `<span class="ctrl-label value-label">${value}&nbsp;${valueSuffix}</span>`);
    container.class("slider-ctrl");
    container.id(sliderId);
    container.parent(parent);

    // The p5.slider.
    var sliderCtrl = createSlider(min, max, value, step);
    sliderCtrl.parent(select(`#${sliderId} .slider`));

    // The value (suffix) label.
    var valueLabel = select(`#${sliderId} .value-label`);

    // Updates the value label when the value changes and invokes the valueChangedListener.
    sliderCtrl.mouseMoved(function () {
        if (mouseIsPressed) {
            var currentValue = Math.round(sliderCtrl.value());
            valueLabel.html(`${currentValue}&nbsp;${valueSuffix}`);
            if (valueChangedListener) {
                valueChangedListener(currentValue);
            }
        }
    });

    /**
     * The current value.
     * @returns {number} The current value set on the slider.
     */
    this.value = function () {
        return sliderCtrl.value();
    }

    /**
     * Controls the visibility of the slider control.
     * @param visible If true, the control is made visible, otherwise it is made hidden.
     */
    this.setVisible = function(visible) {
        if (visible) {
            container.show();
        } else {
            container.hide();
        }
    }
}

/**
 * A control wrapper around p5.Select that also has a label.
 * @param parent The parent DOM element to attach the control to.
 * @param label The label text.
 * @param selectId The id of the select control to create. Should be unique on the page.
 * @param optionNames The text of the different options that will be displayed in the control.
 * @param optionValues The corresponding values of the different options. Should have the same number of elements as
 * optionNames.
 * @param valueSelectedListener The listener to invoke when the selected value changes.
 * @constructor Creates a new LabeledSelect with the specified options.
 */
function LabeledSelect(parent, label, selectId, optionNames, optionValues, valueSelectedListener) {

    // The container element that holds the entire component and is attached to parent.
    var container = createDiv(`<span class="ctrl-label ctrl-title">${label}:</label></span>` +
        `<span class="select"></span>`);
    container.class("select-ctrl");
    container.id(selectId);
    container.parent(parent);

    // The p5.Select control, configured with the specified option names (if any) and values.
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

    // Call the specified listener when the selection changes.
    if (valueSelectedListener) {
        selectCtrl.changed(function () {
            valueSelectedListener(selectCtrl.value());
        });
    }
}

/**
 * A checkbox with a label that controls the eraser setting. Unlike the other two controls, this one is not generic.
 * @param parent The parent DOM element to attach the control to.
 * @param valueChangedListener The listener to invoke when the toggled state changes.
 * @constructor Creates a new EraserCheckbox with the specified label.
 */
function EraserCheckbox(parent, valueChangedListener) {
    // Create the p5.Checkbox control, attach to parent element.
    var checkboxCtrl = createCheckbox("Eraser mode", false);
    checkboxCtrl.parent(parent);

    // Invoke the listener when the value changes.
    if (valueChangedListener) {
        checkboxCtrl.changed(function() {
            valueChangedListener(checkboxCtrl.checked());
        })
    }
}