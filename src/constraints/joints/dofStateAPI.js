'use strict';

const fields = {
  dofs: {
    t: -1,
    r: -1
  },
  featureData: {
    point: null,
    line: null
  },
  error: false,
  errorCallback: function defaultErrorCallback () {
    throw new Error('Uninitialized error callback.');
  }
};

module.exports = function createDOFState (options) {
  // assign standard fields
  const state = Object.assign({}, fields);

  // assign user fields
  Object.assign(state, options);

  return state;
};
