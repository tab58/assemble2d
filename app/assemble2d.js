/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const AssembleMath = {
  Matrix2: __webpack_require__(10),
  Matrix3: __webpack_require__(11),
  Vector2: __webpack_require__(12),
  Vector3: __webpack_require__(5),
  Utils: __webpack_require__(4)
};
Object.assign(AssembleMath, __webpack_require__(1));

module.exports = AssembleMath;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// make native implementation the default
const _Math = {};
const mathProps = Object.getOwnPropertyNames(Math);
mathProps.forEach((prop) => { _Math[prop] = Math[prop]; });

// and allow for better implementations, like @stdlib-js
// Object.assign(_Math, { /* something with better math functions */});

Object.assign(_Math, {
  DEG2RAD: _Math.PI / 180,
  RAD2DEG: 180 / _Math.PI,

  clamp: function (value, min, max) {
    return _Math.max(min, _Math.min(max, value));
  },

  // compute euclidian modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation

  euclideanModulo: function (n, m) {
    return ((n % m) + m) % m;
  },

  // Linear mapping from range <a1, a2> to range <b1, b2>
  mapLinear: function (x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  },

  // https://en.wikipedia.org/wiki/Linear_interpolation
  lerp: function (x, y, t) {
    return (1.0 - t) * x + t * y;
  },

  // http://en.wikipedia.org/wiki/Smoothstep
  smoothstep: function (x, min, max) {
    if (x <= min) {
      return 0;
    }
    if (x >= max) {
      return 1;
    }
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  },

  smootherstep: function (x, min, max) {
    if (x <= min) {
      return 0;
    }
    if (x >= max) {
      return 1;
    }
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
  },

  // Random integer from <low, high> interval
  randInt: function (low, high) {
    return low + _Math.floor(_Math.random() * (high - low + 1));
  },

  // Random float from <low, high> interval

  randFloat: function (low, high) {
    return low + _Math.random() * (high - low);
  },

  // Random float from <-range/2, range/2> interval
  randFloatSpread: function (range) {
    return range * (0.5 - _Math.random());
  },

  degToRad: function (degrees) {
    return degrees * _Math.DEG2RAD;
  },

  radToDeg: function (radians) {
    return radians * _Math.RAD2DEG;
  },

  isPowerOfTwo: function (value) {
    return (value & (value - 1)) === 0 && value !== 0;
  },

  nearestPowerOfTwo: function (value) {
    return _Math.pow(2, _Math.round(_Math.log(value) / _Math.LN2));
  },

  nextPowerOfTwo: function (value) {
    value--;
    value |= value >> 1;
    value |= value >> 2;
    value |= value >> 4;
    value |= value >> 8;
    value |= value >> 16;
    value++;
    return value;
  }
});

module.exports = _Math;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(0);

const EPSILON = 1e-10;

const AnalyticalUtils = {
  DEBUG: false,
  NumericalCompare: {
    EPSILON: EPSILON,
    isZero: function isZero (x) {
      return _Math.Utils.isZero(x, EPSILON);
    },
    isGTZero: function isGTZero (x) {
      return _Math.Utils.isGTZero(x, EPSILON);
    },
    isLTZero: function isLTZero (x) {
      return _Math.Utils.isLTZero(x, EPSILON);
    },
    numbersAreEqual: function isEqual (x, y) {
      return AnalyticalUtils.NumericalCompare.isZero(x - y);
    }
  }
};

module.exports = AnalyticalUtils;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(0);
const Vector2 = _Math.Vector2;
const Vector3 = _Math.Vector3;
const GeomUtils = __webpack_require__(2);

const helperFunctions = {
  calculateTriple: function calculateTriple () {
    const point = this.point;
    const d = this.direction;
    const u = d.x;
    const v = d.y;
    const x = point.x;
    const y = point.y;

    this.triple.set(-v, u, v * x - u * y);
    return this.triple;
  }
};

const infiniteLine2DFunctions = {
  distanceTo: function distanceTo (Q) {
    return _Math.abs(infiniteLine2DFunctions.signedDistanceTo.call(this, Q));
  },
  signedDistanceTo: function signedDistanceTo (Q) {
    const x = Q.x;
    const y = Q.y;
    const a = this.triple.x;
    const b = this.triple.y;
    const c = this.triple.z;

    return ((a * x + b * y + c) / _Math.sqrt(a * a + b * b));
  },
  isPointOnLine: function isPointOnLine (Q) {
    const x = Q.x;
    const y = Q.y;
    const a = this.triple.x;
    const b = this.triple.y;
    const c = this.triple.z;
    return GeomUtils.NumericalCompare.isZero(a * x + b * y + c);
  },
  getPointOnLine: function getPointOnLine () {
    return this.point.clone();
  },
  getClosestPointTo: function getClosestPointTo (Q) {
    const P = this.point;
    const a = this.direction;
    const QP = Q.clone().sub(P);
    const t = a.dot(QP);
    return a.clone().multiplyScalar(t).add(P);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine (infLine) {
    const L1 = helperFunctions.calculateTriple.call(this);
    const L2 = helperFunctions.calculateTriple.call(infLine);
    const P = L1.clone().cross(L2);
    const z = P.z;
    if (GeomUtils.NumericalCompare.isZero(z)) {
      if (GeomUtils.DEBUG) { console.warn('ImplicitLine: no intersection found.'); }
      return undefined;
    } else {
      return new Vector2(P.x / z, P.y / z);
    }
  },
  intersectWithCircle: function intersectWithCircle (circle) {
    const results = [];
    const center = circle.center;
    const a = center.x;
    const b = center.y;
    const r = circle.radius;
    const x0 = this.point.x;
    const y0 = this.point.y;
    const c = this.direction.x;
    const d = this.direction.y;

    const A = c * c + d * d;
    const B = 2 * (c * (x0 - a) + d * (y0 - b));
    const C = (x0 - a) * (x0 - a) + (y0 - b) * (y0 - b) - r * r;
    const disc = B * B - 4 * A * C;
    if (GeomUtils.DEBUG) {
      console.log('Discriminant:', disc);
      console.log('IsZero:', GeomUtils.NumericalCompare.isZero(disc));
      console.log('IsGTZero:', GeomUtils.NumericalCompare.isGTZero(disc));
    }
    if (GeomUtils.NumericalCompare.isZero(disc)) {
      const t = -B / (2 * A);
      const x1 = x0 + c * t;
      const y1 = y0 + d * t;
      results.push(new Vector2(x1, y1));
    } else if (GeomUtils.NumericalCompare.isGTZero(disc)) {
      const t1 = (-B + _Math.sqrt(disc)) / (2 * A);
      const t2 = (-B - _Math.sqrt(disc)) / (2 * A);
      if (GeomUtils.DEBUG) {
        console.log('t1:', t1);
        console.log('t2:', t2);
      }
      const x1 = x0 + c * t1;
      const y1 = y0 + d * t1;
      results.push(new Vector2(x1, y1));
      const x2 = x0 + c * t2;
      const y2 = y0 + d * t2;
      results.push(new Vector2(x2, y2));
    }
    return results;
  }
};

const InfiniteLine2D = {
  create: function (point, direction) {
    const d = direction.clone().normalize();
    const u = d.x;
    const v = d.y;
    const x = point.x;
    const y = point.y;

    const line = {};
    Object.assign(line, {
      point: point.clone(),
      direction: d,
      triple: new Vector3(-v, u, v * x - u * y)
    });
    Object.assign(line, infiniteLine2DFunctions);
    return line;
  }
};

module.exports = InfiniteLine2D;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

const Utils = {
  DEFAULT_TOLERANCE: 1e-12,
  isZero: function isZero (x, eps) {
    return (Math.abs(x) < eps);
  },
  isGTZero: function isGTZero (x, eps) {
    return (x >= eps);
  },
  isLTZero: function isGTZero (x, eps) {
    return (x <= -eps);
  },
  vectorsAreEqual: function (x, y, eps) {
    return Utils.isZero(x.length() - y.length(), eps);
  }
};

module.exports = Utils;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(1);
const Utils = __webpack_require__(4);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  Circle2D: __webpack_require__(7),
  InfiniteLine2D: __webpack_require__(3),
  CoordinateSystem: __webpack_require__(8)
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(0);
const Vector2 = _Math.Vector2;
const InfiniteLine2D = __webpack_require__(3);

const GeomUtils = __webpack_require__(2);
const EPSILON = GeomUtils.NumericalCompare.EPSILON;

const circle2DFunctions = {
  // TODO: Determine if the center point should be returned ever.
  getClosestPointTo: function closestPointTo (Q) {
    const P = this.center;
    const r = this.radius;
    const PQ = Q.clone().sub(P);
    if (GeomUtils.NumericalCompare.isZero(PQ.length())) {
      return undefined;
    } else {
      return PQ.normalize().multiplyScalar(r).add(P);
    }
  },
  isPointOnCircle: function pointIsOnCircle (Q) {
    return GeomUtils.NumericalCompare.numbersAreEqual(Q.distanceTo(this.center), this.radius);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine (infLine) {
    return infLine.intersectWithCircle(this);
  },
  intersectWithCircle: function intersectWithCircle (circle) {
    // method based on this link:
    // https://math.stackexchange.com/questions/213545/solving-trigonometric-equations-of-the-form-a-sin-x-b-cos-x-c
    const results = [];
    const x0 = this.center.x;
    const y0 = this.center.y;
    const r0 = this.radius;
    const x1 = circle.center.x;
    const y1 = circle.center.y;
    const r1 = circle.radius;

    const dx = x1 - x0;
    const dy = y1 - y0;
    const a = 2 * r1 * dx;
    const b = 2 * r1 * dy;
    const c = -(dx * dx + dy * dy) - (r1 * r1 - r0 * r0);

    const den = _Math.sqrt(a * a + b * b);
    const A = a / den;
    const B = b / den;
    const C = c / den;
    const beta = _Math.atan2(A, B);
    if (_Math.abs(C) <= 1) {
      if (_Math.abs(C) > 1 - EPSILON) {
        // one intersection
        const t = _Math.sign(C) * _Math.PI / 2 - beta;
        results.push(new Vector2(x1 + r1 * _Math.cos(t), y1 + r1 * _Math.sin(t)));
      } else {
        // two intersections
        const alpha0 = _Math.asin(C);
        const t0 = alpha0 - beta;
        results.push(new Vector2(x1 + r1 * _Math.cos(t0), y1 + r1 * _Math.sin(t0)));
        const alpha1 = _Math.PI - alpha0;
        const t1 = alpha1 - beta;
        results.push(new Vector2(x1 + r1 * _Math.cos(t1), y1 + r1 * _Math.sin(t1)));
      }
    }
    return results;
  }
};

const circleConstructor = function (center, radius) {
  const circle = {};
  Object.assign(circle, {
    center: center.clone(),
    radius
  });
  Object.assign(circle, circle2DFunctions);
  return circle;
};

const Circle2D = {
  // csys is Csys
  // center is Point2D
  // radius is Number
  createFromCenter: function (center, radius) {
    return circleConstructor(center, radius);
  },
  createFrom3Points: function (p0, p1, p2) {
    const P01 = p1.clone().sub(p0);
    const P01mid = P01.clone().multiplyScalar(0.5).add(p0);
    const P01dir = P01.rotate(_Math.PI / 2);
    const L1 = InfiniteLine2D.create(P01mid, P01dir);

    const P12 = p2.clone().sub(p1);
    const P12mid = P12.clone().multiplyScalar(0.5).add(p1);
    const P12dir = P12.rotate(_Math.PI / 2);
    const L2 = InfiniteLine2D.create(P12mid, P12dir);

    const center = L1.intersectWithInfiniteLine(L2);
    if (center === undefined) {
      console.warn('Circle points are collinear. Not creating circle.');
      return undefined;
    }
    const radius = center.distanceTo(p0);
    return circleConstructor(center, radius);
  }
};

module.exports = Circle2D;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(0);
const Vector2 = _Math.Vector2;
const Matrix2 = _Math.Matrix2;
const Matrix3 = _Math.Matrix3;
const Utils = __webpack_require__(13);

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
      m.premultiply(csysFunctions.getGlobalRotation.call(this.parentCsys, new Matrix2()));
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
    const csys = {
      // the csys's unique ID
      ID: Utils.getUUID(),
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

Object.assign(csysFunctions, {
  clone: function clone () {
    const clon = Csys.create(this.parentCsys);
    clon.axis = this.axis.clone();
    clon.position = this.position.clone();
    return clon;
  }
});

module.exports = Csys;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Geometry = __webpack_require__(6);
const _Math = __webpack_require__(0);

// using
const CoordinateSystem = Geometry.CoordinateSystem;

// logic
const defaultCsys = CoordinateSystem.create();

const translatedCsys = CoordinateSystem.create(defaultCsys);
translatedCsys.translate(new _Math.Vector2(0, 1));

const rotatedCsys = CoordinateSystem.create(translatedCsys);
rotatedCsys.translate(new _Math.Vector2(1, 0));
rotatedCsys.rotate(45 * Math.PI / 180);

const relatedCsys = CoordinateSystem.create(defaultCsys);
relatedCsys.translate(new _Math.Vector2(-1, 0));
relatedCsys.rotate(30 * Math.PI / 180);

// ------------------------
const p = new _Math.Vector2(1, 0);
console.log('Original Point:', p);

const pParent = rotatedCsys.expressVectorInParent(p.clone());
console.log('Transformed point in parent coordinates:', pParent);
const pGlobal = rotatedCsys.expressVectorInGlobal(p.clone());
console.log('Transformed point in global coordinates:', pGlobal);

const pRelated = rotatedCsys.expressVectorInCsys(relatedCsys, p.clone());
console.log('Transformed point from one csys to another:', pRelated);
const pRelGlobal = relatedCsys.expressVectorInGlobal(pRelated);
console.log('Transformed point in global coordinates:', pRelGlobal);

// test
// const circle1 = new Geometry.Circle2D(csys, new Math.Vector2(0, 0), 1);
// const circle2 = new Geometry.Circle2D(csys, new Math.Vector2(0.5, 0.5), 1);
// console.log(circle1.intersectWithCircle(circle2));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */

function Matrix2 () {
  this.elements = [
    1, 0,
    0, 1
  ];
  if (arguments.length > 0) {
    console.error('THREE.Matrix2: the constructor no longer reads arguments. use .set() instead.');
  }
}

Object.assign(Matrix2.prototype, {
  isMatrix2: true,

  // column-major
  set: function (n11, n12, n21, n22) {
    const te = this.elements;
    te[ 0 ] = n11; te[ 1 ] = n21;
    te[ 2 ] = n12; te[ 3 ] = n22;
    return this;
  },

  identity: function () {
    this.set(
      1, 0,
      0, 1
    );
    return this;
  },

  clone: function () {
    return new this.constructor().fromArray(this.elements);
  },

  copy: function (m) {
    const te = this.elements;
    const me = m.elements;
    te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ];
    te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
    return this;
  },

  multiply: function (m) {
    return this.multiplyMatrices(this, m);
  },

  premultiply: function (m) {
    return this.multiplyMatrices(m, this);
  },

  multiplyMatrices: function (a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[ 0 ];
    const a12 = ae[ 2 ];
    const a21 = ae[ 1 ];
    const a22 = ae[ 3 ];

    const b11 = be[ 0 ];
    const b12 = be[ 2 ];
    const b21 = be[ 1 ];
    const b22 = be[ 3 ];

    te[ 0 ] = a11 * b11 + a12 * b21;
    te[ 1 ] = a21 * b11 + a22 * b21;
    te[ 2 ] = a11 * b12 + a12 * b22;
    te[ 3 ] = a21 * b12 + a22 * b22;

    return this;
  },

  multiplyScalar: function (s) {
    const te = this.elements;
    te[ 0 ] *= s; te[ 2 ] *= s;
    te[ 1 ] *= s; te[ 3 ] *= s;
    return this;
  },

  determinant: function () {
    const te = this.elements;
    const a = te[ 0 ];
    const b = te[ 2 ];
    const c = te[ 1 ];
    const d = te[ 3 ];
    return a * d - b * c;
  },

  getInverse: function (matrix, throwOnDegenerate) {
    const me = matrix.elements;
    const te = this.elements;
    const a = me[ 0 ];
    const b = me[ 2 ];
    const c = me[ 1 ];
    const d = me[ 3 ];

    const det = a * d - b * c;

    if (det === 0) {
      const msg = 'Matrix2.getInverse(): cannot invert matrix, determinant is 0';
      if (throwOnDegenerate === true) {
        throw new Error(msg);
      } else {
        console.warn(msg);
      }
      return this.identity();
    }

    const detInv = 1.0 / det;
    te[ 0 ] = d * detInv;
    te[ 2 ] = -b * detInv;
    te[ 1 ] = -c * detInv;
    te[ 3 ] = a * detInv;

    return this;
  },

  transpose: function () {
    const m = this.elements;

    let tmp = m[ 1 ];
    m[ 1 ] = m[ 2 ];
    m[ 2 ] = tmp;
    return this;
  },

  equals: function (matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 4; i++) {
      if (te[i] !== me[i]) {
        return false;
      }
    }
    return true;
  },

  fromArray: function (array, offset) {
    if (offset === undefined) {
      offset = 0;
    }
    for (let i = 0; i < 4; i++) {
      this.elements[ i ] = array[i + offset];
    }
    return this;
  },

  toArray: function (array, offset) {
    if (array === undefined) {
      array = [];
    }
    if (offset === undefined) {
      offset = 0;
    }

    const te = this.elements;

    array[ offset ] = te[ 0 ];
    array[ offset + 1 ] = te[ 1 ];
    array[ offset + 2 ] = te[ 2 ];
    array[ offset + 3 ] = te[ 3 ];

    return array;
  }
});

module.exports = Matrix2;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Vector3 = __webpack_require__(5);

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */

function Matrix3 () {
  this.elements = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
  if (arguments.length > 0) {
    console.error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');
  }
}

Object.assign(Matrix3.prototype, {
  isMatrix3: true,

  set: function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    const te = this.elements;
    te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
    te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
    te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;
    return this;
  },

  identity: function () {
    this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
    return this;
  },

  clone: function () {
    return new this.constructor().fromArray(this.elements);
  },

  copy: function (m) {
    const te = this.elements;
    const me = m.elements;
    te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
    te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
    te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];
    return this;
  },

  applyToBufferAttribute: (function () {
    const v1 = new Vector3();
    return function applyToBufferAttribute (attribute) {
      for (let i = 0, l = attribute.count; i < l; i++) {
        v1.x = attribute.getX(i);
        v1.y = attribute.getY(i);
        v1.z = attribute.getZ(i);
        v1.applyMatrix3(this);
        attribute.setXYZ(i, v1.x, v1.y, v1.z);
      }
      return attribute;
    };
  }()),

  multiply: function (m) {
    return this.multiplyMatrices(this, m);
  },

  premultiply: function (m) {
    return this.multiplyMatrices(m, this);
  },

  multiplyMatrices: function (a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[ 0 ];
    const a12 = ae[ 3 ];
    const a13 = ae[ 6 ];
    const a21 = ae[ 1 ];
    const a22 = ae[ 4 ];
    const a23 = ae[ 7 ];
    const a31 = ae[ 2 ];
    const a32 = ae[ 5 ];
    const a33 = ae[ 8 ];

    const b11 = be[ 0 ];
    const b12 = be[ 3 ];
    const b13 = be[ 6 ];
    const b21 = be[ 1 ];
    const b22 = be[ 4 ];
    const b23 = be[ 7 ];
    const b31 = be[ 2 ];
    const b32 = be[ 5 ];
    const b33 = be[ 8 ];

    te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
    te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
    te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

    te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
    te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
    te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

    te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
    te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
    te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  },

  multiplyScalar: function (s) {
    const te = this.elements;
    te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
    te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
    te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;
    return this;
  },

  determinant: function () {
    const te = this.elements;
    const a = te[ 0 ];
    const b = te[ 1 ];
    const c = te[ 2 ];
    const d = te[ 3 ];
    const e = te[ 4 ];
    const f = te[ 5 ];
    const g = te[ 6 ];
    const h = te[ 7 ];
    const i = te[ 8 ];
    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  },

  invert: function (throwOnDegenerate) {
    return this.getInverse(this);
  },

  getInverse: function (matrix, throwOnDegenerate) {
    const me = matrix.elements;
    const te = this.elements;
    const n11 = me[ 0 ];
    const n21 = me[ 1 ];
    const n31 = me[ 2 ];
    const n12 = me[ 3 ];
    const n22 = me[ 4 ];
    const n32 = me[ 5 ];
    const n13 = me[ 6 ];
    const n23 = me[ 7 ];
    const n33 = me[ 8 ];

    const t11 = n33 * n22 - n32 * n23;
    const t12 = n32 * n13 - n33 * n12;
    const t13 = n23 * n12 - n22 * n13;

    const det = n11 * t11 + n21 * t12 + n31 * t13;

    if (det === 0) {
      const msg = 'Matrix3.getInverse(): cannot invert matrix, determinant is 0';

      if (throwOnDegenerate === true) {
        throw new Error(msg);
      } else {
        console.warn(msg);
      }
      return this.identity();
    }

    const detInv = 1.0 / det;
    te[ 0 ] = t11 * detInv;
    te[ 1 ] = (n31 * n23 - n33 * n21) * detInv;
    te[ 2 ] = (n32 * n21 - n31 * n22) * detInv;

    te[ 3 ] = t12 * detInv;
    te[ 4 ] = (n33 * n11 - n31 * n13) * detInv;
    te[ 5 ] = (n31 * n12 - n32 * n11) * detInv;

    te[ 6 ] = t13 * detInv;
    te[ 7 ] = (n21 * n13 - n23 * n11) * detInv;
    te[ 8 ] = (n22 * n11 - n21 * n12) * detInv;

    return this;
  },

  transpose: function () {
    let tmp;
    const m = this.elements;

    tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
    tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
    tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;
    return this;
  },

  // getNormalMatrix: function (matrix4) {
  //   return this.setFromMatrix4(matrix4).getInverse(this).transpose();
  // },

  transposeIntoArray: function (r) {
    const m = this.elements;
    r[ 0 ] = m[ 0 ];
    r[ 1 ] = m[ 3 ];
    r[ 2 ] = m[ 6 ];
    r[ 3 ] = m[ 1 ];
    r[ 4 ] = m[ 4 ];
    r[ 5 ] = m[ 7 ];
    r[ 6 ] = m[ 2 ];
    r[ 7 ] = m[ 5 ];
    r[ 8 ] = m[ 8 ];
    return this;
  },

  equals: function (matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 9; i++) {
      if (te[i] !== me[i]) {
        return false;
      }
    }
    return true;
  },

  fromArray: function (array, offset) {
    if (offset === undefined) {
      offset = 0;
    }
    for (let i = 0; i < 9; i++) {
      this.elements[ i ] = array[i + offset];
    }
    return this;
  },

  toArray: function (array, offset) {
    if (array === undefined) {
      array = [];
    }
    if (offset === undefined) {
      offset = 0;
    }

    const te = this.elements;

    array[ offset ] = te[ 0 ];
    array[ offset + 1 ] = te[ 1 ];
    array[ offset + 2 ] = te[ 2 ];

    array[ offset + 3 ] = te[ 3 ];
    array[ offset + 4 ] = te[ 4 ];
    array[ offset + 5 ] = te[ 5 ];

    array[ offset + 6 ] = te[ 6 ];
    array[ offset + 7 ] = te[ 7 ];
    array[ offset + 8 ] = te[ 8 ];

    return array;
  }
});

module.exports = Matrix3;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const _Math = __webpack_require__(1);

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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Utils = {};

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const idList = {};
Utils.getUUID = function () {
  let id;
  do {
    id = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  } while (idList[id]);
  idList[id] = true;
  return id;
};

module.exports = Utils;


/***/ })
/******/ ]);