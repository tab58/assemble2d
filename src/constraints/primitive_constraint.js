'use strict';

const Utils = require('../utils.js');

const ConstraintIDList = {};

const PrimitiveConstraint = {};
PrimitiveConstraint.create = function (marker1, marker2) {
  const c = Object.create();

  let id = Utils.getUUID();
  ConstraintIDList[id] = true;
  c.ID = id;
  c.marker1 = marker1;
  c.marker2 = marker2;
  c.type = 'Undefined';

  return c;
};

module.exports = PrimitiveConstraint;
