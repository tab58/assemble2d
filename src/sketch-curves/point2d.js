'use strict';

const Geometry2D = require('./geometry2d.js');
const _Math = require('../../math/math.js');

const POINT_TOLERANCE = _Math.Utils.DEFAULT_TOLERANCE;
const point2DFunctions = {
  // fixes the point in space and recalculates the point as
  // seen from the new coordinate system, then reassigns the
  // coordinate system.
  fixAndReassignCsys: function fixAndReassignCsys (toCsys) {
    const p = this.point;
    this.csys.expressVectorInCsys(toCsys, p);
    this.reassignCsys(toCsys);
  },
  isNumericallyEqualTo: function isNumericallyEqualTo (point2d) {
    let P = point2d.point.clone();
    if (!this.csys.isEqualTo(point2d.csys)) {
      this.csys.expressVectorInCsys(P);
    }
    return _Math.Utils.isZero(this.point.distanceTo(P), POINT_TOLERANCE);
  }
};

const Point2D = {
  create: function (csys, point) {
    const p = Geometry2D.create(csys);
    Object.assign(p, {
      point: point.clone()
    });
    Object.assign(p, point2DFunctions);
    return p;
  }
};

module.exports = Point2D;
