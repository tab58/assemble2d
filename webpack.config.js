'use strict';

const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'app'),
    filename: 'assemble2d.js'
  }
};
