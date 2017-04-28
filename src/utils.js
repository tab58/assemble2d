'use strict';

const Utils = {};

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const idList = {};
Utils.getUUID = function () {
  let id;
  do {
    id = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  } while (idList[id]);
  idList[id] = true;
  return id;
};

module.exports = Utils;
