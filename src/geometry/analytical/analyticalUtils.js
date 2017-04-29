'use strict';

const _Math = require('../../math/math.js');

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
