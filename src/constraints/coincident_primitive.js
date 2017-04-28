'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const CoincidentPrimitive = {};
CoincidentPrimitive.create = function (marker1, marker2) {
  let c = PrimitiveConstraint.create(marker1, marker2);
  c.type = 'Coincident';
  return c;
};

module.exports = CoincidentPrimitive;
