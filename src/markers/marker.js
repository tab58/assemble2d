'use strict';

/*
 *  @author Tim Bright, 2017.
 */

const _Math = require('../math/math.js');
const Utils = require('../utils.js');
const Vector2 = require('../math/vector2.js');
const Matrix3 = require('../math/matrix3.js');

/**
 *  Markers form the basis of the constraint system. Markers are attached to/associated with
 *  geometries and constraints determine how markers must be aligned.
 *
 *  Markers have 3 DOFs: 2 translational DOFs (TDOFs) and 1 rotational DOF (RDOF).
 */

function Marker (parentMarker) {
  // the marker's unique ID
  this.ID = Utils.getUUID();

  // the parent marker defines the coordinate system
  this.parentMarker = parentMarker;

  // the orientation in 2D of the marker w.r.t parent coordinate system
  this.axis = new Vector2(1, 0);

  // the position relative to the parent marker (the coordinate system)
  this.position = new Vector2(0, 0);
}

// define the properties of the prototype
Object.assign(Marker.prototype, {
  isMarker: true,
  rotate: function rotate (angle) {
    let s = _Math.sin(angle);
    let c = _Math.cos(angle);
    let u = this.axis.x;
    let v = this.axis.y;
    this.axis.set(c * u - s * v, s * u + c * v).normalize();
  },
  translate: Vector2.prototype.add,
  rotateAboutPoint: function rotateAboutPoint (p, angle) {
    // rotate position, but also axis
    this.position.rotateAround(p, angle);
    this.rotate(angle);
  },
  // transforms a point from the parent coordinate system into this coordinate system
  // (equivalent to taking a new marker as defined in the parent csys and rotating first, then translating it)
  getLocalTransform: function getLocalTransform () {
    const pi2 = _Math.PI * 2;
    const rawAngle = _Math.atan2(this.axis.y, this.axis.x);
    const angle = (rawAngle + pi2) % pi2;
    const c = _Math.cos(angle);
    const s = _Math.sin(angle);
    const x = this.position.x;
    const y = this.position.y;

    const localMatrix = new Matrix3();
    localMatrix.set(c, -s, x, s, c, y, 0, 0, 1);
    return localMatrix;
  },
  // the global transform is the matrix that transforms a point
  // from the global coordinate system to this coordinate system
  getGlobalTransform: function getGlobalTransform () {
    const isMarker = this.parentMarker !== undefined && this.parentMarker.isMarker;
    const parentGlobalTransform = (isMarker ? this.parentMarker.getGlobalTransform() : new Matrix3());
    return this.getLocalTransform().multiply(parentGlobalTransform);
  },
  getInverseGlobalTransform: function getInverseGlobalTransform () {
    const globalTransform = this.getGlobalTransform();
    return globalTransform.getInverse(globalTransform);
  }
});

module.exports = Marker;
