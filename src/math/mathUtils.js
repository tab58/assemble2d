'use strict';

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
