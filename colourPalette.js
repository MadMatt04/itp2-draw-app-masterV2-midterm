//Displays and handles the colour palette.
function ColourPalette(graphicsProvider) {
    //a list of web colour strings
    this.colours = ["black", "silver", "gray", "white", "maroon", "red", "purple",
                    "orange", "pink", "fuchsia", "green", "lime", "olive", "yellow", "navy",
                    "blue", "teal", "aqua"
    ];
    //make the start colour be black
    this.selectedColour = "black";

    // The alpha value to control opacity. Set to 1.0 (full opacity) at the start.
    var alpha = 255;

    var self = this;

    /**
     * The getter-setter for the opacity (alpha value).
     * @param alphaValue If specified, sets this opacity value, adjusts fill and stroke to reflect it.
     * @returns {number} The current alpha value (0 to 255).
     */
    this.alpha = function(alphaValue) {
        if (alphaValue === undefined) {
            return alpha;
        }

        alpha = alphaValue;
        setFillAndStroke();
    }

    /**
     * Returns the currently selected colour as a p5.Color object with the proper alpha value.
     * @returns {p5.Color} A p5.Color object.
     */
    this.selectedColourObject = function() {
        var colorObject = color(self.selectedColour);
        colorObject.setAlpha(alpha);

        return colorObject;
    }

    /**
     * Return the p5.Graphics object to set the colour on.
     * @returns {p5.Graphics} A p5.Graphics object.
     */
    var graphics = function() {
        return graphicsProvider.graphics();
    }

    var colourClick = function() {
        //remove the old border
        var current = select("#" + self.selectedColour + "Swatch");
        current.style("border", "0");

        //get the new colour from the id of the clicked element
        var c = this.id().split("Swatch")[0];

        //set the selected colour and fill and stroke
        self.selectedColour = c;
        setFillAndStroke();

        //add a new border to the selected colour
        this.style("border", "2px solid blue");
    }

    /**
     * Sets the fill and stroke properties of the current rendering surface to the currently selected colour.
     */
    var setFillAndStroke = function() {
        var colourObject = color(self.selectedColour);
        colourObject.setAlpha(alpha);
        graphics().fill(colourObject);
        graphics().stroke(colourObject);
    }

    //load in the colours
    this.loadColours = function() {
        //set the fill and stroke properties to be black at the start of the programme
        //running
        graphics().fill(this.colours[0]);
        graphics().stroke(this.colours[0]);

        //for each colour create a new div in the html for the colourSwatches
        for (var i = 0; i < this.colours.length; i++) {
            var colourID = this.colours[i] + "Swatch";

            //using JQuery add the swatch to the palette and set its background colour
            //to be the colour value.
            var colourSwatch = createDiv()
            colourSwatch.class('colourSwatches');
            colourSwatch.id(colourID);

            select(".colourPalette").child(colourSwatch);
            select("#" + colourID).style("background-color", this.colours[i]);
            colourSwatch.mouseClicked(colourClick)
        }

        select(".colourSwatches").style("border", "2px solid blue");
    };
    //call the loadColours function now it is declared
    this.loadColours();
}