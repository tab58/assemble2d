'use strict';

const Utils = require('./utils.js');
// const Marker = require('./marker.js');

function hasMarker (geom, marker) {
  return hasMarkerID(geom, marker.ID);
}

function hasMarkerID (geom, id) {
  let valid = false;
  geom.attachedMarkers.forEach(function (marker) {
    valid = valid || (marker.ID === id);
  });
  return false;
}

function isInvariant (geom) {
  let attachedMarkers = geom.attachedMarkers;
  let invariant = true;
  attachedMarkers.forEach(function (marker) {
    invariant = invariant && marker.invariant;
  });
  return invariant;
}

/**
 *  A geometry is a collection of elements that rotate together, similar to a rigid body.
 *  Geometries are useful to collect markers together to rotate together.
 */
const Geometry = {};
Geometry.create = function (originMarker) {
  const geom = {};

  // geom.csys = Marker.create(originMarker);
  // geom.rotate = function (angle) {
  // };
  geom.attachedMarkers = [];
  geom.getAttachedMarkers = function () {
    // TODO: get copy of markers to keep original immutable
    //       and wrap original in a closure
    return geom.attachedMarkers;
  };
  geom.hasMarkerID = function (id) {
    return hasMarkerID(geom, id);
  };
  geom.hasMarker = function (marker) {
    return hasMarker(geom, marker);
  };
  geom.ID = Utils.getUUID();
  geom.isInvariant = function () {
    return isInvariant(geom);
  };

  return geom;
};
