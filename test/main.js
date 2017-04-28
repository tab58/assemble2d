'use strict';

const assert = require('chai').assert;

const Geometry = require('../src/geometry/geometry.js');
const _Math = require('../src/math/math.js');

const EPSILON = 1e-10;
const assertNumeric = {
  isZero: (x, msg) => assert(_Math.abs(x) < EPSILON, msg),
  isGTZero: (x, msg) => assert(x > EPSILON, msg),
  isLTZero: (x, msg) => assert(x < -EPSILON, msg),
  numbersAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x - y), msg),
  vectorsAreEqualish: (x, y, msg) => assertNumeric.isZero(_Math.abs(x.length() - y.length()), msg)
};

describe('Low Level Operations', () => {
  describe('Coordinate System Functions', () => {
    it('should rotate axis properly', () => {
      const rotatedCsys = Geometry.CoordinateSystem.create();
      const a = 45 * Math.PI / 180;
      rotatedCsys.rotate(a);
      const x = _Math.sqrt(2) / 2;
      const y = _Math.sqrt(2) / 2;
      const vec = new _Math.Vector2(x, y);
      assertNumeric.vectorsAreEqualish(rotatedCsys.axis, vec, 'Vectors are not equal');
    });
    it('should translate position properly', () => {
      const csys = Geometry.CoordinateSystem.create();
      const t = new _Math.Vector2(_Math.sqrt(2) / 2, _Math.sqrt(3) + 1);
      csys.translate(t);
      assertNumeric.vectorsAreEqualish(csys.position, t, 'Vectors are not equal');
    });
  });
});
