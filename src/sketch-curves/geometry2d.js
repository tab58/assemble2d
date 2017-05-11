'use strict';

const _Math = require('../../math/math.js');

const geometry2DFunctions = {
  // reassigns the coordinate system, meaning that the point is
  // basically transformed to be relative to the new csys
  // (i.e. point(1,1) is now relative to toCsys)
  reassignCsys: function reassignCsys (toCsys) {
    if (this.csys.isSameAs(toCsys)) {
      return;
    }
    this.csys = toCsys;
  },
  // virtual function; placeholder for fixing the geometry in global space and
  // doing proper recalculation to view it from toCsys.
  fixAndReassignToCsys: function (toCsys) {
    throw new Error('Geometry2D: unimplemented function.');
  }
};

const Geometry2D = {
  create: function (csys) {
    const geom = {
      csys,
      ID: _Math.Utils.getUUID()
    };
    Object.assign(geom, geometry2DFunctions);
    return geom;
  }
};

module.exports = Geometry2D;
