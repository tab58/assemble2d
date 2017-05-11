'use strict';

/* global describe it */
const _Math = require('../src/math/math.js');
const TestAsserts = require('./testAsserts.js');

const Geometry = require('../src/geometry/geometry.js');
const CoordinateSystem = Geometry.CoordinateSystem;

describe('Low Level Operations', () => {
  describe('Coordinate System Functions', () => {
    it('should rotate axis properly', () => {
      const rotatedCsys = CoordinateSystem.create();
      const a = 45 * Math.PI / 180;
      rotatedCsys.rotate(a);
      const vec = new _Math.Vector2(_Math.sqrt(2) / 2, _Math.sqrt(2) / 2);
      TestAsserts.vectorsAreEqualish(rotatedCsys.axis, vec, 'Vectors are not equal');
    });
    it('should translate position properly', () => {
      const csys = CoordinateSystem.create();
      const t = new _Math.Vector2(_Math.sqrt(2) / 2, _Math.sqrt(3) + 1);
      csys.translate(t);
      TestAsserts.vectorsAreEqualish(csys.position, t, 'Vectors are not equal');
    });
    it('should express vectors in parent properly', () => {
      const defaultCsys = CoordinateSystem.create();
      const translatedCsys = CoordinateSystem.create(defaultCsys);
      translatedCsys.translate(new _Math.Vector2(0, 1));
      const rotatedCsys = CoordinateSystem.create(translatedCsys);
      rotatedCsys.translate(new _Math.Vector2(1, 0));
      rotatedCsys.rotate(45 * Math.PI / 180);

      const p = new _Math.Vector2(1, 0);
      const pParent = rotatedCsys.expressVectorInParent(p.clone());
      const pParentCalc = new _Math.Vector2(_Math.sqrt(2), _Math.sqrt(2));
      TestAsserts.vectorsAreEqualish(pParent, pParentCalc, 'Vector in parent frame not correct.');
    });
    it('should express vectors in global properly', () => {
      const defaultCsys = CoordinateSystem.create();
      const translatedCsys = CoordinateSystem.create(defaultCsys);
      translatedCsys.translate(new _Math.Vector2(0, 1));
      const rotatedCsys = CoordinateSystem.create(translatedCsys);
      rotatedCsys.translate(new _Math.Vector2(1, 0));
      rotatedCsys.rotate(45 * Math.PI / 180);

      const p = new _Math.Vector2(1, 0);
      const pGlobal = rotatedCsys.expressVectorInGlobal(p.clone());
      const pGlobalCalc = new _Math.Vector2(_Math.sqrt(2), _Math.sqrt(2) + 1);
      TestAsserts.vectorsAreEqualish(pGlobal, pGlobalCalc, 'Global vector not correct.');
    });

    it('should express vectors from one csys to another properly', () => {
      const defaultCsys = CoordinateSystem.create();
      const translatedCsys = CoordinateSystem.create(defaultCsys);
      translatedCsys.translate(new _Math.Vector2(0, 1));
      const rotatedCsys = CoordinateSystem.create(translatedCsys);
      rotatedCsys.translate(new _Math.Vector2(1, 0));
      rotatedCsys.rotate(45 * Math.PI / 180);
      const relatedCsys = CoordinateSystem.create(defaultCsys);
      relatedCsys.translate(new _Math.Vector2(-1, 0));
      relatedCsys.rotate(30 * Math.PI / 180);

      const p = new _Math.Vector2(1, 0);
      const pRelated = rotatedCsys.expressVectorInCsys(relatedCsys, p.clone());
      const pRelGlobal = relatedCsys.expressVectorInGlobal(pRelated);
      const pGlobalCalc = new _Math.Vector2(_Math.sqrt(2), _Math.sqrt(2) + 1);
      TestAsserts.vectorsAreEqualish(pRelGlobal, pGlobalCalc, 'Vector not expressed correctly in new csys.');
    });
  });
});
