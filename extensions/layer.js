function Layer(name, layerWidth, layerHeight) {
    this.name = name;

    // The pixel data of this array.
    // this.pixels = new Uint8ClampedArray(pixels.length);
    // console.log("this.pixels", this.pixels);

    this.graphics = createGraphics(layerWidth, layerHeight);
}