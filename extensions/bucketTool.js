class BucketTool {
    constructor() {
        this.icon = "assets/paint-bucket-svgrepo-com.svg"
        this.name = "bucket";
    }

    draw() {
        console.log("Bucket draw");
    }

    set graphics(graphics) {
        console.log("Graphics", graphics);
        this.g = graphics;
    }

    get graphics() {
        return this.g;
    }
}