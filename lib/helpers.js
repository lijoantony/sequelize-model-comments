'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ = require('lodash');

exports.default = {
  test: function test() {
    return true;
  },
  toUnderscored: function toUnderscored(obj) {
    _.forEach(obj, function (k, v) {
      obj[k] = v.replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
        return "_" + y.toLowerCase();
      }).replace(/^_/, "");
    });
    return obj;
  }
};
module.exports = exports['default'];
