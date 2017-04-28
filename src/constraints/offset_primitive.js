'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const OffsetPrimitive = {};
OffsetPrimitive.create = function (marker1, marker2, alpha) {
  let c = PrimitiveConstraint.create(marker1, marker2);
  c.type = 'Offset';
  c.parameter = alpha;
  return c;
};

module.exports = OffsetPrimitive;
