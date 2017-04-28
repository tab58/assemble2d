'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const DisplacementPrimitive = {};
DisplacementPrimitive.create = function (marker1, marker2) {
  let c = PrimitiveConstraint.create(marker1, marker2);
  c.type = 'Displacement';
  return c;
};

module.exports = DisplacementPrimitive;
