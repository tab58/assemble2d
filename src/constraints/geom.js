'use strict';

const Utils = require('./utils.js');

const geomFunctions = {
  hasMarkerID: function (id) {
    return this.attachedMarkers.reduce((acc, marker) => acc || marker.ID === id, false);
  },
  hasMarker: function hasMarker (marker) {
    return geomFunctions.hasMarkerID.call(this, marker.ID);
  },
  isInvariant: function isInvariant () {
    return this.attachedMarkers.reduce((acc, marker) => acc && marker.invariant, true);
  },
  rotateAboutPoint: function rotateAboutPoint (angle, point) {
    this.attachedMarkers.forEach(marker => {
      marker.coordinateSystem.rotateAboutPoint(point, angle);
    });
  },
  translate: function translate (vec) {
    this.attachedMarkers.forEach(marker => {
      marker.coordinateSystem.translate(vec);
    });
  }
};

/**
 *  A geometry is a collection of elements that rotate together, similar to a rigid body.
 */
const Geom = {
  create: function () {
    const geom = {
      ID: Utils.getUUID(),
      attachedMarkers: []
    };
    Object.assign(geom, geomFunctions);
    return geom;
  }
};

module.exports = Geom;
