'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const InlinePrimitive = {};
InlinePrimitive.create = function (marker1, marker2) {
  let c = PrimitiveConstraint.create(marker1, marker2);
  c.type = 'Inline';
  return c;
};

module.exports = InlinePrimitive;
