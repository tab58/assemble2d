'use strict';

/* global describe it */
const _Math = require('../src/math/math.js');
const TestAsserts = require('./testAsserts.js');

const Geometry = require('../src/geometry/geometry.js');

describe('Low Level Operations', () => {
  describe('Coordinate System Functions', () => {
    it('should rotate axis properly', () => {
      const rotatedCsys = Geometry.Body.CoordinateSystem.create();
      const a = 45 * Math.PI / 180;
      rotatedCsys.rotate(a);
      const x = _Math.sqrt(2) / 2;
      const y = _Math.sqrt(2) / 2;
      const vec = new _Math.Vector2(x, y);
      TestAsserts.vectorsAreEqualish(rotatedCsys.axis, vec, 'Vectors are not equal');
    });
    it('should translate position properly', () => {
      const csys = Geometry.Body.CoordinateSystem.create();
      const t = new _Math.Vector2(_Math.sqrt(2) / 2, _Math.sqrt(3) + 1);
      csys.translate(t);
      TestAsserts.vectorsAreEqualish(csys.position, t, 'Vectors are not equal');
    });
  });
});
