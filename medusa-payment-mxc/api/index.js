"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = require("express");
var _medusaCoreUtils = require("medusa-core-utils");
var _cors = _interopRequireDefault(require("cors"));
var _default = function _default(rootDirectory) {
  var router = (0, _express.Router)();
  var _getConfigFile = (0, _medusaCoreUtils.getConfigFile)(rootDirectory, "medusa-config"),
    configModule = _getConfigFile.configModule;
  var projectConfig = configModule.projectConfig;
  var corsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true
  };
  router.get("/erc20-token/price", (0, _cors["default"])(corsOptions), /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var mxcErc20ProviderService, price;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            mxcErc20ProviderService = req.scope.resolve("mxcErc20ProviderService");
            _context.next = 3;
            return mxcErc20ProviderService.getPrice();
          case 3:
            price = _context.sent;
            res.json({
              price: price
            });
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  router.get("/erc20-payment_intent/status", (0, _cors["default"])(corsOptions), /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
      var address, mxcErc20ProviderService, status;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            address = req.query.address;
            mxcErc20ProviderService = req.scope.resolve("mxcErc20ProviderService");
            _context2.next = 4;
            return mxcErc20ProviderService.getIntentStatus(address);
          case 4:
            status = _context2.sent;
            res.json({
              status: status
            });
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  return router;
};
exports["default"] = _default;