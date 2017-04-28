'use strict';

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */

function Matrix2 () {
  this.elements = [
    1, 0,
    0, 1
  ];
  if (arguments.length > 0) {
    console.error('THREE.Matrix2: the constructor no longer reads arguments. use .set() instead.');
  }
}

Object.assign(Matrix2.prototype, {
  isMatrix2: true,

  // column-major
  set: function (n11, n12, n21, n22) {
    const te = this.elements;
    te[ 0 ] = n11; te[ 1 ] = n21;
    te[ 2 ] = n12; te[ 3 ] = n22;
    return this;
  },

  identity: function () {
    this.set(
      1, 0,
      0, 1
    );
    return this;
  },

  clone: function () {
    return new this.constructor().fromArray(this.elements);
  },

  copy: function (m) {
    const te = this.elements;
    const me = m.elements;
    te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ];
    te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
    return this;
  },

  multiply: function (m) {
    return this.multiplyMatrices(this, m);
  },

  premultiply: function (m) {
    return this.multiplyMatrices(m, this);
  },

  multiplyMatrices: function (a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[ 0 ];
    const a12 = ae[ 2 ];
    const a21 = ae[ 1 ];
    const a22 = ae[ 3 ];

    const b11 = be[ 0 ];
    const b12 = be[ 2 ];
    const b21 = be[ 1 ];
    const b22 = be[ 3 ];

    te[ 0 ] = a11 * b11 + a12 * b21;
    te[ 1 ] = a21 * b11 + a22 * b21;
    te[ 2 ] = a11 * b12 + a12 * b22;
    te[ 3 ] = a21 * b12 + a22 * b22;

    return this;
  },

  multiplyScalar: function (s) {
    const te = this.elements;
    te[ 0 ] *= s; te[ 2 ] *= s;
    te[ 1 ] *= s; te[ 3 ] *= s;
    return this;
  },

  determinant: function () {
    const te = this.elements;
    const a = te[ 0 ];
    const b = te[ 2 ];
    const c = te[ 1 ];
    const d = te[ 3 ];
    return a * d - b * c;
  },

  getInverse: function (matrix, throwOnDegenerate) {
    const me = matrix.elements;
    const te = this.elements;
    const a = me[ 0 ];
    const b = me[ 2 ];
    const c = me[ 1 ];
    const d = me[ 3 ];

    const det = a * d - b * c;

    if (det === 0) {
      const msg = 'Matrix2.getInverse(): cannot invert matrix, determinant is 0';
      if (throwOnDegenerate === true) {
        throw new Error(msg);
      } else {
        console.warn(msg);
      }
      return this.identity();
    }

    const detInv = 1.0 / det;
    te[ 0 ] = d * detInv;
    te[ 2 ] = -b * detInv;
    te[ 1 ] = -c * detInv;
    te[ 3 ] = a * detInv;

    return this;
  },

  transpose: function () {
    const m = this.elements;

    let tmp = m[ 1 ];
    m[ 1 ] = m[ 2 ];
    m[ 2 ] = tmp;
    return this;
  },

  equals: function (matrix) {
    const te = this.elements;
    const me = matrix.elements;
    for (let i = 0; i < 4; i++) {
      if (te[i] !== me[i]) {
        return false;
      }
    }
    return true;
  },

  fromArray: function (array, offset) {
    if (offset === undefined) {
      offset = 0;
    }
    for (let i = 0; i < 4; i++) {
      this.elements[ i ] = array[i + offset];
    }
    return this;
  },

  toArray: function (array, offset) {
    if (array === undefined) {
      array = [];
    }
    if (offset === undefined) {
      offset = 0;
    }

    const te = this.elements;

    array[ offset ] = te[ 0 ];
    array[ offset + 1 ] = te[ 1 ];
    array[ offset + 2 ] = te[ 2 ];
    array[ offset + 3 ] = te[ 3 ];

    return array;
  }
});

module.exports = Matrix2;
