'use strict';

const _Math = require('../../math/math.js');

const AnalyticalUtils = {
  DEBUG: false,
  NumericalCompare: {
    EPSILON: 1e-10,
    isZero: function isZero (x) {
      return _Math.Utils.isZero(x, AnalyticalUtils.EPSILON);
    },
    isGTZero: function isGTZero (x) {
      return _Math.Utils.isGTZero(x, AnalyticalUtils.EPSILON);
    },
    isLTZero: function isLTZero (x) {
      return _Math.Utils.isLTZero(x, AnalyticalUtils.EPSILON);
    }
  }
};

module.exports = AnalyticalUtils;
