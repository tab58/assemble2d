'use strict';

const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const Matrix2 = _Math.Matrix2;
const Matrix3 = _Math.Matrix3;
const Utils = require('../../utils.js');

const pi2 = _Math.PI * 2;
const CSYS_EQUAL_TOL = _Math.Utils.DEFAULT_TOLERANCE;

const helperFunctions = {
  getRotationAngle: function getRotationAngle () {
    return helperFunctions.getFullAngle(this.axis);
  },
  buildRotationMatrix: function buildRotationMatrix (angle, mat2) {
    const m = (mat2 && mat2.isMatrix2 ? mat2 : new Matrix2());
    const c = _Math.cos(angle);
    const s = _Math.sin(angle);
    m.set(c, -s, s, c);
    return m;
  },
  // returns the angle in the normal [0, 2PI) interval
  getFullAngle: function getFullAngle (v) {
    return (_Math.atan2(v.y, v.x) + pi2) % pi2;
  }
};

const csysFunctions = {
  // Returns true if it's the same csys object or spatially the same csys.
  isEqualTo: function isEqual (csys) {
    return (this.isSameAs(csys) ||
            (_Math.Utils.vectorsAreEqual(this.position, csys.position, CSYS_EQUAL_TOL) &&
             _Math.Utils.vectorsAreEqual(this.axis, csys.axis, CSYS_EQUAL_TOL)));
  },
  // Returns true if it's exactly the same csys object.
  isSameAs: function isSameAs (csys) {
    return (this.ID === csys.ID);
  },
  hasParentCsys: function hasParentCsys () {
    return (this.parentCsys !== undefined && this.parentCsys);
  },
  // rotates vector in this coordinate system
  rotate: function rotate (angle) {
    let s = _Math.sin(angle);
    let c = _Math.cos(angle);
    let u = this.axis.x;
    let v = this.axis.y;
    let x = this.position.x;
    let y = this.position.y;
    this.axis.set(c * u - s * v, s * u + c * v).normalize();
    this.position.set(c * x - s * y, s * x + c * y);
  },
  // translates vector
  translate: function translate (v) {
    this.position.add(v);
  },
  rotateAboutPoint: function rotateAboutPoint (p, angle) {
    // rotate position, but also axis
    this.position.rotateAround(p, angle);
    this.rotate(angle);
  },
  // get the rotation matrix from the parent to the csys
  getLocalRotation: function getLocalRotation (mat2) {
    const angle = helperFunctions.getRotationAngle.call(this);
    const m = helperFunctions.buildRotationMatrix(angle, mat2);
    return m;
  },
  getGlobalRotation: function getLocalRotation (mat2) {
    const m = csysFunctions.getLocalRotation.call(this, mat2);
    if (this.hasParentCsys()) {
      // TODO: do this premultiply in place
      const tmp = new Matrix2();
      m.premultiply(csysFunctions.getGlobalRotation.call(this.parentCsys, tmp));
    }
    return m;
  },
  // transforms a point from the parent coordinate system into this coordinate system
  // (equivalent to taking a new csys as defined in the parent csys and rotating first, then translating it)
  getLocalTransform: function getLocalTransform (transformMat3) {
    const localMatrix = (transformMat3 && transformMat3.isMatrix3 ? transformMat3 : new Matrix3());
    const angle = helperFunctions.getRotationAngle.call(this);
    const c = _Math.cos(angle);
    const s = _Math.sin(angle);
    const x = this.position.x;
    const y = this.position.y;

    const n11 = c;
    const n21 = s;
    const n31 = 0;
    const n12 = -s;
    const n22 = c;
    const n32 = 0;
    const n13 = x;
    const n23 = y;
    const n33 = 1;
    localMatrix.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);

    return localMatrix;
  },
  getGlobalTransform: function getGlobalTransform (transformMat3) {
    const transform = (transformMat3 && transformMat3.isMatrix3 ? transformMat3 : new Matrix3());
    csysFunctions.getLocalTransform.call(this, transform);
    if (this.hasParentCsys()) {
      // TODO: do this premultiply in place
      const tmp = new Matrix3();
      transform.premultiply(csysFunctions.getGlobalTransform.call(this.parentCsys, tmp));
    }
    return transform;
  },
  getGlobalPosition: function getGlobalPosition () {
    const p = new Vector2(0, 0);
    return csysFunctions.expressVectorInGlobal.call(this, p);
  },
  // vector has common origin at csys; essentially only rotating the vector tip
  expressVectorInParent: function expressVectorInParent (v) {
    const R = csysFunctions.getLocalTransform.call(this);
    v.multiplyMatrix3(R);
    return v;
  },
  expressVectorInGlobal: function expressVectorInGlobal (v) {
    csysFunctions.expressVectorInParent.call(this, v);
    if (this.hasParentCsys()) {
      csysFunctions.expressVectorInParent.call(this.parentCsys, v);
    }
    return v;
  },
  expressVectorInCsys: function expressVectorInCsys (csys, v) {
    csysFunctions.expressVectorInGlobal.call(this, v);
    v.sub(csys.getGlobalPosition());
    const R = csysFunctions.getGlobalRotation.call(csys);
    v.multiplyMatrix2(R.getInverse(R));
    return v;
  }
};

const Csys = {
  create: function create (parentCsys) {
    // the csys's unique ID
    const ID = Utils.getUUID();
    const csys = {
      ID,
      // the parent csys defines the coordinate system
      parentCsys: parentCsys,
      // the orientation in 2D of the csys w.r.t parent coordinate system
      axis: new Vector2(1, 0),
      // the position relative to the parent csys (the coordinate system)
      position: new Vector2(0, 0),
      //
      isCsys: true
    };
    Object.assign(csys, csysFunctions);
    return csys;
  }
};

module.exports = Csys;
