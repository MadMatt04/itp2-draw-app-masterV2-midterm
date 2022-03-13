/**
 * Returns a vector that is perpendicular to a vector described by (x1, y1) and (x2, y2) coordinates.
 * @param x1 The X coordinate of the first point.
 * @param y1 The Y coordinate of the first point.
 * @param x2 The X coordinate of the second point.
 * @param y2 The Y coordinate of the second point.
 * @param magnitude The magnitude of the returned vector. 1.0 (unit vector) by default.
 * @returns {p5.Vector} perpendicular to the original vector.
 */
function getPerpendicularVectorP(x1, y1, x2, y2, magnitude=1.0) {
    var v1 = createVector(x1, y1);
    var v2 = createVector(x2, y2);

    return getPerpendicularVector(v1, v2, magnitude);

}

/**
 * Returns a vector that is perpendicular to a vector described by the difference of vectors v2 - v1.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @param magnitude The magnitude of the returned vector. 1.0 (unit vector) by default.
 * @returns {p5.Vector} perpendicular to the original vector.
 */
function getPerpendicularVector(v1, v2, magnitude=1.0) {
    var v = p5.Vector.sub(v2, v1);

    var vp = createVector(v.y, -v.x);
    vp.setMag(magnitude);

    return vp;
}

/**
 * Returns a random boolean value.
 * @returns {boolean} True or false, randomly.
 */
function randomBoolean() {
    var r = round(random(0, 1));
    return r >= 0.5;
}