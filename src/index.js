'use strict';

const Geometry = require('./geometry/geometry.js');
const _Math = require('./math/math.js');

// using
const CoordinateSystem = Geometry.Body.CoordinateSystem;

// logic
const defaultCsys = CoordinateSystem.create();

const translatedCsys = CoordinateSystem.create(defaultCsys);
translatedCsys.translate(new _Math.Vector2(0, 1));

const rotatedCsys = CoordinateSystem.create(translatedCsys);
rotatedCsys.translate(new _Math.Vector2(1, 0));
rotatedCsys.rotate(45 * Math.PI / 180);

const relatedCsys = CoordinateSystem.create(defaultCsys);
relatedCsys.translate(new _Math.Vector2(-1, 0));
relatedCsys.rotate(30 * Math.PI / 180);

// ------------------------
const p = new _Math.Vector2(1, 0);
console.log('Original Point:', p);

const pParent = rotatedCsys.expressVectorInParent(p.clone());
console.log('Transformed point in parent coordinates:', pParent);
const pGlobal = rotatedCsys.expressVectorInGlobal(p.clone());
console.log('Transformed point in global coordinates:', pGlobal);

const pRelated = rotatedCsys.expressVectorInCsys(relatedCsys, p.clone());
console.log('Transformed point from one csys to another:', pRelated);
const pRelGlobal = relatedCsys.expressVectorInGlobal(pRelated);
console.log('Transformed point in global coordinates:', pRelGlobal);

// test
// const circle1 = new Geometry.Circle2D(csys, new Math.Vector2(0, 0), 1);
// const circle2 = new Geometry.Circle2D(csys, new Math.Vector2(0.5, 0.5), 1);
// console.log(circle1.intersectWithCircle(circle2));
