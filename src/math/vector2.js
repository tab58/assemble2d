'use strict';

const _Math = require('./mathFunctions.js');

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

function Vector2 (x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Object.defineProperties(Vector2.prototype, {
  'width': {
    get: function () {
      return this.x;
    },

    set: function (value) {
      this.x = value;
    }
  },

  'height': {
    get: function () {
      return this.y;
    },
    set: function (value) {
      this.y = value;
    }
  }
});

Object.assign(Vector2.prototype, {
  isVector2: true,
  set: function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  },

  setScalar: function (scalar) {
    this.x = scalar;
    this.y = scalar;
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

  setComponent: function (index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  },

  getComponent: function (index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      default: throw new Error('index is out of range: ' + index);
    }
  },

  clone: function () {
    return new this.constructor(this.x, this.y);
  },

  copy: function (v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  },

  add: function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  },

  addScalar: function (s) {
    this.x += s;
    this.y += s;
    return this;
  },

  addVectors: function (a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  },

  addScaledVector: function (v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  },

  sub: function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  },

  subScalar: function (s) {
    this.x -= s;
    this.y -= s;
    return this;
  },

  subVectors: function (a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  },

  multiply: function (v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  },

  multiplyMatrix2: function (a) {
    const ae = a.elements;
    const a11 = ae[ 0 ];
    const a12 = ae[ 2 ];
    const a21 = ae[ 1 ];
    const a22 = ae[ 3 ];
    const x = this.x;
    const y = this.y;
    this.x = a11 * x + a12 * y;
    this.y = a21 * x + a22 * y;
    return this;
  },

  multiplyMatrix3: function (a) {
    const ae = a.elements;
    const a11 = ae[ 0 ];
    const a12 = ae[ 3 ];
    const a13 = ae[ 6 ];
    const a21 = ae[ 1 ];
    const a22 = ae[ 4 ];
    const a23 = ae[ 7 ];
    // const a31 = ae[ 2 ];
    // const a32 = ae[ 5 ];
    // const a33 = ae[ 8 ];
    const x = this.x;
    const y = this.y;
    this.x = a11 * x + a12 * y + a13;
    this.y = a21 * x + a22 * y + a23;
    return this;
  },

  multiplyScalar: function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  },

  divide: function (v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  },

  divideScalar: function (scalar) {
    return this.multiplyScalar(1.0 / scalar);
  },

  min: function (v) {
    this.x = _Math.min(this.x, v.x);
    this.y = _Math.min(this.y, v.y);
    return this;
  },

  max: function (v) {
    this.x = _Math.max(this.x, v.x);
    this.y = _Math.max(this.y, v.y);
    return this;
  },

  clamp: function (min, max) {
    // This function assumes min < max, if this assumption isn't true it will not operate correctly
    this.x = _Math.max(min.x, _Math.min(max.x, this.x));
    this.y = _Math.max(min.y, _Math.min(max.y, this.y));
    return this;
  },

  clampScalar: (function () {
    const min = new Vector2();
    const max = new Vector2();
    return function clampScalar (minVal, maxVal) {
      min.set(minVal, minVal);
      max.set(maxVal, maxVal);
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
    return this;
  },

  ceil: function () {
    this.x = _Math.ceil(this.x);
    this.y = _Math.ceil(this.y);
    return this;
  },

  round: function () {
    this.x = _Math.round(this.x);
    this.y = _Math.round(this.y);
    return this;
  },

  roundToZero: function () {
    this.x = (this.x < 0) ? _Math.ceil(this.x) : _Math.floor(this.x);
    this.y = (this.y < 0) ? _Math.ceil(this.y) : _Math.floor(this.y);
    return this;
  },

  negate: function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },

  dot: function (v) {
    return this.x * v.x + this.y * v.y;
  },

  lengthSq: function () {
    return this.x * this.x + this.y * this.y;
  },

  length: function () {
    return _Math.sqrt(this.x * this.x + this.y * this.y);
  },

  lengthManhattan: function () {
    return _Math.abs(this.x) + _Math.abs(this.y);
  },

  normalize: function () {
    return this.divideScalar(this.length());
  },

  angle: function () {
    // computes the angle in radians with respect to the positive x-axis
    let angle = _Math.atan2(this.y, this.x);
    if (angle < 0) {
      angle += 2 * _Math.PI;
    }
    return angle;
  },

  distanceTo: function (v) {
    return _Math.sqrt(this.distanceToSquared(v));
  },

  distanceToSquared: function (v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  },

  distanceToManhattan: function (v) {
    return _Math.abs(this.x - v.x) + _Math.abs(this.y - v.y);
  },

  setLength: function (length) {
    return this.multiplyScalar(length / this.length());
  },

  lerp: function (v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    return this;
  },

  lerpVectors: function (v1, v2, alpha) {
    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  },

  equals: function (v) {
    return ((v.x === this.x) && (v.y === this.y));
  },

  fromArray: function (array, offset) {
    if (offset === undefined) {
      offset = 0;
    }
    this.x = array[offset];
    this.y = array[offset + 1];
    return this;
  },

  toArray: function (array, offset) {
    if (array === undefined) {
      array = [];
    }
    if (offset === undefined) {
      offset = 0;
    }
    array[offset] = this.x;
    array[offset + 1] = this.y;
    return array;
  },

  fromBufferAttribute: function (attribute, index, offset) {
    if (offset !== undefined) {
      console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');
    }
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    return this;
  },

  rotateAround: function (center, angle) {
    const c = _Math.cos(angle);
    const s = _Math.sin(angle);
    const x = this.x - center.x;
    const y = this.y - center.y;
    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;
    return this;
  }
});

module.exports = Vector2;
