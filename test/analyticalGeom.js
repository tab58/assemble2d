'use strict';

/* global describe it */
const assert = require('chai').assert;
const _Math = require('../src/math/math.js');
const TestAsserts = require('./testAsserts.js');

const Geometry = require('../src/geometry/geometry.js');
const InfiniteLine2D = Geometry.InfiniteLine2D;
const Circle2D = Geometry.Circle2D;

describe('Analytical Operations', () => {
  describe('InfiniteLine2D', () => {
    it('#distanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.distanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, halfSqrt2, 'Distance is ' + dist);
    });
    it('#signedDistanceTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const dist = L.signedDistanceTo(Q);
      TestAsserts.numbersAreEqualish(dist, -halfSqrt2, 'Signed distance is ' + dist);
    });
    it('#getPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getPointOnLine();
      TestAsserts.numbersAreEqualish(L.distanceTo(p), 0, 'Point is not on line.');
    });
    it('#isPointOnLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P = new _Math.Vector2(1, 1);
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      assert(L.isPointOnLine(new _Math.Vector2(halfSqrt2, halfSqrt2)), 'Point is not on line.');
    });
    it('#getClosestPointTo()', () => {
      const Q = new _Math.Vector2(1, 0);
      const P = new _Math.Vector2(0, 0);
      const halfSqrt2 = _Math.sqrt(2) / 2;
      const d = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L = InfiniteLine2D.create(P, d.normalize());

      const p = L.getClosestPointTo(Q);
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not closest to line.');
    });
    it('#intersectWithInfiniteLine()', () => {
      const halfSqrt2 = _Math.sqrt(2) / 2;

      const P0 = new _Math.Vector2(0, 0);
      const d0 = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const L0 = InfiniteLine2D.create(P0, d0.normalize());

      const P1 = new _Math.Vector2(1, 0);
      const d1 = new _Math.Vector2(-halfSqrt2, halfSqrt2);
      const L1 = InfiniteLine2D.create(P1, d1.normalize());

      const p = L0.intersectWithInfiniteLine(L1);
      assert(L0.isPointOnLine(p), 'Intersections not on line 1.');
      assert(L1.isPointOnLine(p), 'Intersections not on line 2.');
      TestAsserts.vectorsAreEqualish(p, new _Math.Vector2(0.5, 0.5), 'Point is not at intersection.');
    });
    it('#intersectWithCircle()', () => {
      const P = new _Math.Vector2(0, 0);
      const d = new _Math.Vector2(1, 1);
      const L = InfiniteLine2D.create(P, d.normalize());

      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(c, r);

      const I = L.intersectWithCircle(C);
      assert(I.length === 2, 'Circle should have 2 intersections.');
      assert(I.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // do 1 intersection and 0 intersections
    });
  });
  describe('Circle2D', () => {
    it('#getClosestPointTo()', () => {
      const P = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(P, r);

      const halfSqrt2 = _Math.sqrt(2) / 2;
      const P1c = new _Math.Vector2(halfSqrt2, halfSqrt2);
      const Q = P1c.clone().multiplyScalar(1 / 5);
      const P1 = C.getClosestPointTo(Q);

      TestAsserts.vectorsAreEqualish(P1, P1c, 'Closest point is not correct.');
    });
    it('#isPointOnCircle()', () => {
      const P = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(P, r);

      const halfSqrt2 = _Math.sqrt(2) / 2;
      const Q = new _Math.Vector2(halfSqrt2, halfSqrt2);

      assert(C.isPointOnCircle(Q), 'Point is not on circle.');
    });
    it('#intersectWithInfiniteLine()', () => {
      const P = new _Math.Vector2(0, 0);
      const d = new _Math.Vector2(1, 1);
      const L = InfiniteLine2D.create(P, d.normalize());

      const c = new _Math.Vector2(0, 0);
      const r = 1;
      const C = Circle2D.createFromCenter(c, r);

      const I = C.intersectWithInfiniteLine(L);
      assert(I.length === 2, 'Circle should have 2 intersections.');
      assert(I.map(i => C.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle.');
      assert(I.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');
    });
    it('#intersectWithCircle()', () => {
      // 2 intersection case
      const c0 = new _Math.Vector2(0, 0);
      const r0 = 1;
      const C0 = Circle2D.createFromCenter(c0, r0);
      const c1 = new _Math.Vector2(1, 0);
      const r1 = 1;
      const C1 = Circle2D.createFromCenter(c1, r1);
      const I2 = C0.intersectWithCircle(C1);
      assert(I2.length === 2, 'Circle should have 2 intersections.');
      assert(I2.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I2.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 1.');

      const Pl = new _Math.Vector2(0.5, 0);
      const dl = new _Math.Vector2(0, 1);
      const L = InfiniteLine2D.create(Pl, dl);
      const LC0 = L.intersectWithCircle(C0);
      assert(LC0.map(i => L.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 1 intersection (tangent) case
      const c2 = new _Math.Vector2(2, 0);
      const r2 = 1;
      const C2 = Circle2D.createFromCenter(c2, r2);
      const I1 = C0.intersectWithCircle(C2);
      assert(I1.length === 1, 'Circles should have 1 intersection.');
      assert(I1.map(i => C0.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 0.');
      assert(I1.map(i => C2.isPointOnCircle(i)).reduce((acc, b) => b && acc, true), 'Intersections not on circle 2.');
      const Pl1 = new _Math.Vector2(1, 0);
      const dl1 = new _Math.Vector2(0, 1);
      const L1 = InfiniteLine2D.create(Pl1, dl1);
      const LC1 = L1.intersectWithCircle(C0);
      assert(LC1.map(i => L1.isPointOnLine(i)).reduce((acc, b) => b && acc, true), 'Intersections not on line.');

      // 0 intersection case
      const c3 = new _Math.Vector2(2 + TestAsserts.TEST_EPSILON, 0);
      const r3 = 1;
      const C3 = Circle2D.createFromCenter(c3, r3);
      const I3 = C0.intersectWithCircle(C3);
      assert(I3.length === 0, 'Circles should have no intersections.');
    });
  });
});
