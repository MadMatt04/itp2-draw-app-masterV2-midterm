function getPerpendicularVectorP(x1, y1, x2, y2, magnitude=1.0) {
    var v1 = createVector(x1, y1);
    var v2 = createVector(x2, y2);

    return getPerpendicularVector(v1, v2, magnitude);

}

function getPerpendicularVector(v1, v2, magnitude=1.0) {
    var v = p5.Vector.sub(v2, v1);

    var vp = createVector(v.y, -v.x);
    vp.setMag(magnitude);

    return vp;
}

function randomBoolean() {
    var r = round(random(0, 1));
    return r >= 0.5;
}

function testPerpVector() {
    var vp = getPerpendicularVectorP(1, 1, 2, 3, 5);
    var v1 = createVector(1, 1);
    var v2 = createVector(2, 3);
    var v = p5.Vector.sub(v2, v1);

    console.assert(p5.Vector.dot(v, vp) === 0);

    console.log("v", v, "vp", vp, "dot", p5.Vector.dot(v, vp));
}