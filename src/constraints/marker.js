'use strict';

const Utils = require('../../utils.js');
const _Math = require('../../math/math.js');
const Matrix3 = _Math.Matrix3;
const Csys = require('../../geometry/csys.js');

const markerFunctions = {
  getLocalPosition: function getLocalPosition () {
    return this.coordinateSystem.position.clone();
  },
  getLocalXAxis: function getLocalXAxis () {
    return this.coordinateSystem.axis.clone();
  },
  getLocalCoordinateFrame: function getLocalCoordinateFrame (mat3) {
    const m = (mat3 !== undefined && mat3.isMatrix3) ? mat3 : new Matrix3();
    return this.coordinateSystem.getGlobalTransform(m);
  },
  getGlobalPosition: function getGlobalPosition (mat3) {
    const lcf = markerFunctions.localCoordinateFrame.call(this, mat3);
    return this.coordinateSystem.position.clone().multiplyMatrix3(lcf);
  },
  getGlobalXAxis: function getGlobalXAxis (mat3) {
    const lcf = markerFunctions.localCoordinateFrame.call(this, mat3);
    return this.coordinateSystem.axis.clone().multiplyMatrix3(lcf);
  },
  setLocalPosition: function setLocalPosition (x, y) {
    this.position.x = x;
    this.position.y = y;
  },
  setLocalXAxis: function setLocalXAxis (x, y) {
    this.axis.x = x;
    this.axis.y = y;
    this.axis.normalize();
  },
  setGlobalPosition: function setGlobalPosition (x, y, tempMat3) {
    const lcf = markerFunctions.localCoordinateFrame.call(this, tempMat3);
    return this.coordinateSystem.position.set(x, y).multiplyMatrix3(lcf.invert());
  },
  setGlobalXAxis: function setGlobalXAxis (x, y, tempMat3) {
    const lcf = markerFunctions.localCoordinateFrame.call(this, tempMat3);
    return this.coordinateSystem.axis.set(x, y).multiplyMatrix3(lcf.invert()).normalize();
  }
};

// Functionally, a marker is a lot like a Csys, but without so many exposed functions
// Marker is backed by a csys
const Marker = {
  create: function create (localFrameCsys) {
    // the csys unique ID
    const ID = Utils.getUUID();
    const marker = {
      ID,
      coordinateSystem: (localFrameCsys === undefined ? Csys.create() : localFrameCsys),
      isMarker: true,
      invariants: {
        position: false,
        x: false
      }
    };
    Object.assign(marker, markerFunctions);
    return marker;
  }
};

Object.assign(markerFunctions, {
  lmp: markerFunctions.getLocalPosition,
  lmx: markerFunctions.getLocalXAxis,
  gmp: markerFunctions.getGlobalPosition,
  gmx: markerFunctions.getGlobalXAxis,
  lcf: markerFunctions.getLocalCoordinateFrame,
  setLmp: markerFunctions.setLocalPosition,
  setLmx: markerFunctions.setLocalXAxis,
  setGmp: markerFunctions.setGlobalPosition,
  setGmx: markerFunctions.setGlobalXAxis,
  clone: function clone () {
    const clon = Marker.create(this.coordinateSystem.clone());
    clon.invariants.position = this.invariants.position;
    clon.invariants.x = this.invariants.x;
    return clon;
  }
});

module.exports = Marker;
