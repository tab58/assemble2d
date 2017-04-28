'use strict';

// const _Math = require('../../math/math.js');
// const Vector2 = _Math.Vector2;
const Circle2D = require('../analytical/circle2d.js');
const Geometry2D = require('./geometry2d.js');

const helperFunctions = {
  areInSameCsys: function (geomArray) {
    if (geomArray === undefined ||
        Array.isArray(geomArray)) {
      return false;
    }
    const id = geomArray[0].csys.ID;
    return geomArray.map((geom) => geom.csys.ID === id)
      .reduce((acc, val) => acc && val, true);
  }
};

const arc2DFunctions = {
  fixAndReassignCsys: function fixAndReassignCsys (toCsys) {
    const circleCenter = this.geometry.center;
    this.csys.expressVectorInCsys(toCsys, circleCenter);

    this.reassignCsys(toCsys);
  }
};

const arcConstructor = function (csys, circle2d, P0, P1) {
  const circle = Geometry2D.create(csys);
  Object.assign(circle, {
    geometry: circle2d,
    P0,
    P1
  });
  Object.assign(circle, arc2DFunctions);
  return circle;
};

const Arc2D = {
  // csys is Csys
  // P0, P1, P2 are Point2D objects
  createFrom3Points: function (csys, p0, p1, p2) {
    let P0;
    let P1;
    let P2;
    if (!helperFunctions.areInSameCsys([p0, p1, p2])) {
      // convert all to same csys and define circle
      let P0 = p0.point.clone();
      let P1 = p1.point.clone();
      let P2 = p2.point.clone();
      p0.csys.expressVectorInCsys(this.csys, P0);
      p1.csys.expressVectorInCsys(this.csys, P1);
      p2.csys.expressVectorInCsys(this.csys, P2);
    } else {
      P0 = p0.point;
      P1 = p1.point;
      P2 = p2.point;
    }
    const circle2d = Circle2D.createFrom3Points(P0, P1, P2);
    return arcConstructor(csys, circle2d, p0, p2);
  }
};

module.exports = Arc2D;
