//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the 
//pixel array.
function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	// A reference to the current graphics object we're drawing to
	var graphics = null;

	//draws the line to the screen 
	this.draw = function(){

		graphics.reset();
		//only draw when mouse is clicked
		if(mouseIsPressed){
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				//save the current pixel Array
				graphics.loadPixels();
			}

			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				graphics.updatePixels();
				//draw the line
				graphics.line(startMouseX, startMouseY, mouseX, mouseY);
			}
		}

		else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};

	/**
	 * Set the current rendering surface (of the active layer).
	 * @param g {p5.Graphics} The active layer's rendering surface.
	 */
	this.setGraphics = function(g) {
		graphics = g;
	}

}
