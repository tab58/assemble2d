'use strict';

const assert = require('chai').assert;
const _Math = require('../src/math/math.js');
const TestAsserts = require('./testAsserts.js');

const Geometry = require('../src/geometry/geometry.js');

describe('Analytical Operations', () => {
  describe('Lines', () => {
    it('#distanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      const dist = L.distanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, halfSqrt2, 'Distance is ' + dist);
    });
    it('#signedDistanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      const dist = L.signedDistanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, -halfSqrt2, 'Signed distance is ' + dist);
    });
    it('#getPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      const p = L.getPointOnLine();
      TestAsserts.numbersAreEqualish(L.distanceTo(p), 0, 'Point is not on line.');
    });
    it('#isPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      assert(L.isPointOnLine(new _Math.Vector2(halfSqrt2, halfSqrt2)), 'Point is not on line.');
    });
    it('#getClosestPointTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      const p = L.getClosestPointTo(Q);
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not closest to line.');
    });
    it('#intersectWithInfiniteLine()', () => {     
      const halfSqrt2 = _Math.sqrt(2) / 2;
      
      const P0 = new _Math.Vector2(0, 0);
      const d0 = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L0 = Geometry.Analytical.InfiniteLine2D.create(P0, d0.normalize());

      const P1 = new _Math.Vector2(1, 0);
      const d1 = new _Math.Vector2(-halfSqrt2, halfSqrt2);
      const L1 = Geometry.Analytical.InfiniteLine2D.create(P1, d1.normalize());

      const p = L0.intersectWithInfiniteLine(L1);
      assert(L0.isPointOnLine(p), 'Intersections not on line 1.');
      assert(L1.isPointOnLine(p), 'Intersections not on line 2.');
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not at intersection.');
    });
    it('#intersectWithCircle()', () => {     
      const halfSqrt2 = _Math.sqrt(2) / 2;
      
      const P = new _Math.Vector2(0, 0);
      const d = new _Math.Vector2(1, 1);
      const L = Geometry.Analytical.InfiniteLine2D.create(P, d.normalize());

      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Geometry.Analytical.Circle2D.createFromCenter(c, r);

      const I = L.intersectWithCircle(C);
      assert(I.length === 2, 'Circle should have 2 intersections.');
      assert(I.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');
    });
  });
});
