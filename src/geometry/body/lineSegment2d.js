'use strict';

const Geometry2D = require('./geometry2d.js');
const InfiniteLine2D = require('../analytical/infiniteLine2d.js');
// const _Math = require('../../math/math.js');
// const GeomUtils = require('../geomUtils.js');

// const helperFunctions = {
//   recalculateTriple: function recalculateTriple (vec3) {
//     const u = this.direction.x;
//     const v = this.direction.y;
//     const x = this.point.x;
//     const y = this.point.y;
//     const V = (vec3 && vec3.isVector3 ? vec3 : new Vector3());
//     V.set(-v, u, v * x - u * y);
//   }
// };

const lineSegmentFunctions = {
  fixAndReassignCsys: function fixAndReassignCsys (toCsys) {
    const point0 = this.P0;
    const point1 = this.P1;

    // convert the points
    const P0 = point0.point;
    if (!point0.csys.isEqualTo(toCsys)) {
      point0.csys.expressVectorInCsys(toCsys, P0);
    }
    const P1 = point1.point;
    if (!point1.csys.isEqualTo(toCsys)) {
      point1.csys.expressVectorInCsys(toCsys, P1);
    }

    // update the geometry
    const linePt = P0;
    const lineDir = P1.clone().sub(P0);
    // We have to create a new object because the line triple doesn't update
    // and we don't need the code for an implicit triple all over the place;
    // TODO: don't create a new object
    this.geometry = InfiniteLine2D.create(linePt, lineDir);

    this.reassignCsys(toCsys);
  }
};

const LineSegment = {
  create: function create (csys, point0, point1) {
    const lineSeg = Geometry2D.create(csys);

    Object.assign(lineSeg, {
      geometry: null,
      P0: point0,
      P1: point1
    });
    lineSegmentFunctions.fixAndReassignCsys.call(lineSeg, csys);
    Object.assign(lineSeg, lineSegmentFunctions);
    return lineSeg;
  }
};

module.exports = LineSegment;
