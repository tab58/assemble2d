'use strict';

const AssembleMath = {
  Matrix2: require('./matrix2.js'),
  Matrix3: require('./matrix3.js'),
  Vector2: require('./vector2.js'),
  Vector3: require('./vector3.js'),
  Utils: require('./mathUtils.js')
};
Object.assign(AssembleMath, require('./mathFunctions.js'));

module.exports = AssembleMath;
