class BucketTool {
    constructor() {
        this.icon = "assets/paint-bucket-svgrepo-com-adjusted.svg"
        this.name = "bucket";
    }

    set graphics(graphics) {
        this.g = graphics;
    }

    get graphics() {
        return this.g;
    }

    set colourPalette(palette) {
        this.palette = palette;
    }

    draw() {
        console.log("Bucket draw");
    }

    populateOptions() {
        var self = this;
        var parent = select(".options");
        var opacitySlider = new LabeledSlider(parent, "Opacity", "bucket-opacity-slider-ctrl", 0, 100, 100,
            0, "%", function (value) {
                // Transform from percentage to a 0.0 to 1.0 range.
                self.palette.alpha(value / 100.0);
            });
    }

    unselectTool() {
        select(".options").html("");
        this.palette.alpha(255);
    }
}