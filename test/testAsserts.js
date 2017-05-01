'use strict';

const assert = require('chai').assert;
const _Math = require('../src/math/math.js');

const EPSILON = 1e-10;
const assertNumeric = {
  TEST_EPSILON: EPSILON,
  isZero: (x, msg) => assert(_Math.abs(x) < EPSILON, msg),
  isGTZero: (x, msg) => assert(x > EPSILON, msg),
  isLTZero: (x, msg) => assert(x < -EPSILON, msg),
  numbersAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x - y), msg),
  vectorsAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x.length() - y.length()), msg)
};

module.exports = assertNumeric;
