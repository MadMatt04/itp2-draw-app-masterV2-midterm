function SprayCanTool(){
	
	this.name = "sprayCanTool";
	this.icon = "assets/sprayCan.jpg";

	var points = 13;
	var spread = 10;

	// A reference to the current graphics object we're drawing to
	var graphics = null;

	this.draw = function(){
		var r = random(5,10);
		if(mouseIsPressed){
			for(var i = 0; i < points; i++){
				graphics.point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
			}
		}
	};

	this.setGraphics = function(g) {
		graphics = g;
	}
}