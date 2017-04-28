'use strict';

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
