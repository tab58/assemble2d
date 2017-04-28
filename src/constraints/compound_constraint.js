'use strict';

const PrimitiveConstraint = require('./primitive_constraint.js');

const requirementMap = {
  'Offset': ['Coincident']
};

const CompoundConstraint = {};

CompoundConstraint.isValid = function (compound, type) {
  let constraints = compound.primitiveConstraints;
  let constraintTypes = {};
  let valid = true;
  if (requirementMap[type]) {
    // requires a check if there is a constraint that has dependencies
    let reqTypes = requirementMap[type];
    reqTypes.forEach(function (reqType) {
      constraintTypes[reqType] = false;
    });
    let primitiveIDs = Object.keys(constraints);
    primitiveIDs.forEach(function (id) {
      let constraint = constraints[id];
      let cType = constraint.type;
      constraintTypes[cType] = true;
    });
    Object.keys(constraintTypes).forEach(function (key) {
      valid = valid && constraintTypes[key];
    });
  }
  return valid;
};

CompoundConstraint.create = function (marker1, marker2) {
  const c = PrimitiveConstraint.create();

  c.primitiveConstraints = {};
  c.addPrimitiveConstraint = function (primitive) {
    c.primitiveConstraints[primitive.ID] = primitive;
  };
  c.isValid = function () {
    return CompoundConstraint.isValid(c, c.type);
  };

  return c;
};

module.exports = CompoundConstraint;
