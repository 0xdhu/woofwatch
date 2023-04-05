"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var OrderSubscriber = /*#__PURE__*/(0, _createClass2["default"])(function OrderSubscriber(_ref) {
  var _this = this;
  var orderService = _ref.orderService,
    eventBusService = _ref.eventBusService;
  (0, _classCallCheck2["default"])(this, OrderSubscriber);
  (0, _defineProperty2["default"])(this, "handleAutomaticCapture", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
      var order;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _this.orderService_.retrieve(data.id);
          case 2:
            order = _context.sent;
            _context.next = 5;
            return _this.orderService_.capturePayment(order.id);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  this.orderService_ = orderService;
  eventBusService.subscribe('order.placed', this.handleAutomaticCapture);
});
var _default = OrderSubscriber;
exports["default"] = _default;