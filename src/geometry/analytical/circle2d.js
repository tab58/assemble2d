'use strict';

const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const InfiniteLine2D = require('./infiniteLine2d.js');

const GeomUtils = require('./analyticalUtils.js');

const circle2DFunctions = {
  getClosestPointTo: function closestPointTo (Q) {
    const P = this.center;
    const r = this.radius;
    const PQ = Q.clone().sub(P);
    if (GeomUtils.isZero(PQ.length())) {
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
      if (_Math.abs(C) > 1 - GeomUtils.EPSILON) {
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
