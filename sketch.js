//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var layerManager = null;


function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");

	layerManager = new LayerManager(c.width, c.height);
	console.log(`w: ${c.width}, h: ${c.height}`);

	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette(layerManager);

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	background(255);

	// Layers


	toolbox.tools.forEach(tool => {
		if (tool.hasOwnProperty("setColourPalette")) {
			tool.setColourPalette(colourP);
		}

		if (tool.hasOwnProperty("setGraphics")) {
			tool.setGraphics(layerManager.currentLayer().graphics);
		}
	});

}

function draw() {

	// Clear everything to make the layers work properly.
	clear();

	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}

	layerManager.draw();
}