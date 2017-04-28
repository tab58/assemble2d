'use strict';

module.exports = {
  Analytical: {
    Circle2D: require('./analytical/circle2d.js'),
    InfiniteLine2D: require('./analytical/infiniteLine2d.js')
  },
  Body: {
    LineSegment2D: require('./body/lineSegment2d.js'),
    Point2D: require('./body/point2d.js'),
    CoordinateSystem: require('./body/csys.js')
  }
};
