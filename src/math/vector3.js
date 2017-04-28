'use strict';

const _Math = require('./mathFunctions.js');
const Utils = require('./mathUtils.js');
// const Matrix3 = require('./matrix3.js');
// const Quaternion = require('./quaternion.js');

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

function Vector3 (x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Object.assign(Vector3.prototype, {
  isVector3: true,

  set: function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  },

  setScalar: function (scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;
    return this;
  },

  setX: function (x) {
    this.x = x;
    return this;
  },

  setY: function (y) {
    this.y = y;
    return this;
  },

  setZ: function (z) {
    this.z = z;
    return this;
  },

  setComponent: function (index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  },

  getComponent: function (index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error('index is out of range: ' + index);
    }
  },

  clone: function () {
    return new this.constructor(this.x, this.y, this.z);
  },

  copy: function (v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  },

  add: function (v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
      return this.addVectors(v, w);
    }
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  },

  addScalar: function (s) {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  },

  addVectors: function (a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  },

  addScaledVector: function (v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  },

  sub: function (v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
      return this.subVectors(v, w);
    }
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  },

  subScalar: function (s) {
    this.x -= s;
    this.y -= s;
    this.z -= s;
    return this;
  },

  subVectors: function (a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  },

  multiply: function (v, w) {
    if (w !== undefined) {
      console.warn('Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
      return this.multiplyVectors(v, w);
    }
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  },

  multiplyMatrix3: function (a) {
    if (!a || !a.isMatrix3) {
      console.warn('Vector3: Matrix is not a Matrix3 in .multiplyMatrix3().');
    }
    var ae = a.elements;
    const x = this.x;
    const y = this.y;
    const z = this.z;

    let a1 = ae[ 0 ];
    let a2 = ae[ 3 ];
    let a3 = ae[ 6 ];
    this.x = a1 * x + a2 * y + a3 * z;

    a1 = ae[ 1 ];
    a2 = ae[ 4 ];
    a3 = ae[ 7 ];
    this.y = a1 * x + a2 * y + a3 * z;

    a1 = ae[ 2 ];
    a2 = ae[ 5 ];
    a3 = ae[ 8 ];
    this.z = a1 * x + a2 * y + a3 * z;
    return this;
  },

  multiplyScalar: function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  },

  multiplyVectors: function (a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    return this;
  },

  // applyEuler: (function () {
  //   const quaternion = new Quaternion();
  //   return function applyEuler (euler) {
  //     if ((euler && euler.isEuler) === false) {
  //       console.error('THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');
  //     }
  //     return this.applyQuaternion(quaternion.setFromEuler(euler));
  //   };
  // }()),

  // applyAxisAngle: (function () {
  //   const quaternion = new Quaternion();
  //   return function applyAxisAngle (axis, angle) {
  //     return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
  //   };
  // }()),

  applyMatrix3: function (m) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;
    this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
    this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
    this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;
    return this;
  },

  applyMatrix4: function (m) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;
    this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ];
    this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ];
    this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];
    const w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ];
    return this.divideScalar(w);
  },

  applyQuaternion: function (q) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;

    // calculate quat * vector
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  },

  // project: (function () {
  //   const matrix = new Matrix4();
  //   return function project (camera) {
  //     matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
  //     return this.applyMatrix4(matrix);
  //   };
  // }()),

  // unproject: (function () {
  //   const matrix = new Matrix4();
  //   return function unproject (camera) {
  //     matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
  //     return this.applyMatrix4(matrix);
  //   };
  // }()),

  transformDirection: function (m) {
    // input: THREE.Matrix4 affine matrix
    // vector interpreted as a direction
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;
    this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
    this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
    this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;
    return this.normalize();
  },

  divide: function (v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  },

  divideScalar: function (scalar) {
    return this.multiplyScalar(1.0 / scalar);
  },

  min: function (v) {
    this.x = _Math.min(this.x, v.x);
    this.y = _Math.min(this.y, v.y);
    this.z = _Math.min(this.z, v.z);
    return this;
  },

  max: function (v) {
    this.x = _Math.max(this.x, v.x);
    this.y = _Math.max(this.y, v.y);
    this.z = _Math.max(this.z, v.z);
    return this;
  },

  clamp: function (min, max) {
    // This function assumes min < max, if this assumption isn't true it will not operate correctly
    this.x = _Math.max(min.x, _Math.min(max.x, this.x));
    this.y = _Math.max(min.y, _Math.min(max.y, this.y));
    this.z = _Math.max(min.z, _Math.min(max.z, this.z));
    return this;
  },

  clampScalar: (function () {
    const min = new Vector3();
    const max = new Vector3();
    return function clampScalar (minVal, maxVal) {
      min.set(minVal, minVal, minVal);
      max.set(maxVal, maxVal, maxVal);
      return this.clamp(min, max);
    };
  }()),

  clampLength: function (min, max) {
    const length = this.length();
    return this.multiplyScalar(_Math.max(min, _Math.min(max, length)) / length);
  },

  floor: function () {
    this.x = _Math.floor(this.x);
    this.y = _Math.floor(this.y);
    this.z = _Math.floor(this.z);
    return this;
  },

  ceil: function () {
    this.x = _Math.ceil(this.x);
    this.y = _Math.ceil(this.y);
    this.z = _Math.ceil(this.z);
    return this;
  },

  round: function () {
    this.x = _Math.round(this.x);
    this.y = _Math.round(this.y);
    this.z = _Math.round(this.z);
    return this;
  },

  roundToZero: function () {
    this.x = (this.x < 0) ? _Math.ceil(this.x) : _Math.floor(this.x);
    this.y = (this.y < 0) ? _Math.ceil(this.y) : _Math.floor(this.y);
    this.z = (this.z < 0) ? _Math.ceil(this.z) : _Math.floor(this.z);
    return this;
  },

  negate: function () {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  },

  dot: function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },

  lengthSq: function () {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  },

  length: function () {
    return _Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },

  lengthManhattan: function () {
    return _Math.abs(this.x) + _Math.abs(this.y) + _Math.abs(this.z);
  },

  normalize: function () {
    return this.divideScalar(this.length());
  },

  setLength: function (length) {
    return this.multiplyScalar(length / this.length());
  },

  lerp: function (v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    return this;
  },

  lerpVectors: function (v1, v2, alpha) {
    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  },

  cross: function (v) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
    return this;
  },

  crossVectors: function (a, b) {
    const ax = a.x;
    const ay = a.y;
    const az = a.z;
    const bx = b.x;
    const by = b.y;
    const bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  },

  projectOnVector: function (vector) {
    const scalar = vector.dot(this) / vector.lengthSq();
    return this.copy(vector).multiplyScalar(scalar);
  },

  projectOnPlane: (function () {
    const v1 = new Vector3();
    return function projectOnPlane (planeNormal) {
      v1.copy(this).projectOnVector(planeNormal);
      return this.sub(v1);
    };
  }()),

  reflect: (function () {
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length
    const v1 = new Vector3();
    return function reflect (normal) {
      return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
    };
  }()),

  angleTo: function (v) {
    const theta = this.dot(v) / (_Math.sqrt(this.lengthSq() * v.lengthSq()));
    // clamp, to handle numerical problems
    return _Math.acos(Utils.clamp(theta, -1, 1));
  },

  distanceTo: function (v) {
    return _Math.sqrt(this.distanceToSquared(v));
  },

  distanceToSquared: function (v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  },

  distanceToManhattan: function (v) {
    return _Math.abs(this.x - v.x) + _Math.abs(this.y - v.y) + _Math.abs(this.z - v.z);
  },

  setFromSpherical: function (s) {
    const sinPhiRadius = _Math.sin(s.phi) * s.radius;
    this.x = sinPhiRadius * _Math.sin(s.theta);
    this.y = _Math.cos(s.phi) * s.radius;
    this.z = sinPhiRadius * _Math.cos(s.theta);
    return this;
  },

  setFromCylindrical: function (c) {
    this.x = c.radius * _Math.sin(c.theta);
    this.y = c.y;
    this.z = c.radius * _Math.cos(c.theta);
    return this;
  },

  setFromMatrixPosition: function (m) {
    return this.setFromMatrixColumn(m, 3);
  },

  setFromMatrixScale: function (m) {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();
    this.x = sx;
    this.y = sy;
    this.z = sz;
    return this;
  },

  setFromMatrixColumn: function (m, index) {
    return this.fromArray(m.elements, index * 4);
  },

  equals: function (v) {
    return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
  },

  fromArray: function (array, offset) {
    if (offset === undefined) {
      offset = 0;
    }
    this.x = array[ offset ];
    this.y = array[ offset + 1 ];
    this.z = array[ offset + 2 ];
    return this;
  },

  toArray: function (array, offset) {
    if (array === undefined) {
      array = [];
    }
    if (offset === undefined) {
      offset = 0;
    }
    array[ offset ] = this.x;
    array[ offset + 1 ] = this.y;
    array[ offset + 2 ] = this.z;
    return array;
  },

  fromBufferAttribute: function (attribute, index, offset) {
    if (offset !== undefined) {
      console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
    }
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    return this;
  }
});

module.exports = Vector3;
