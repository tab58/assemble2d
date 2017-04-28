'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const ParallelPrimitive = {};
ParallelPrimitive.create = function (marker1, marker2) {
  let c = PrimitiveConstraint.create(marker1, marker2);
  c.type = 'Parallel';
  return c;
};

module.exports = ParallelPrimitive;
