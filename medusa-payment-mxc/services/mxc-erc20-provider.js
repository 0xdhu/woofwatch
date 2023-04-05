"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _medusa = require("@medusajs/medusa");
var _axios = _interopRequireDefault(require("axios"));
var _uuid = require("uuid");
var _crypto = _interopRequireDefault(require("crypto"));
var dotenv = _interopRequireWildcard(require("dotenv"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
dotenv.config();

/**
 * Options
 * clientId: string;
 * secretKey: string;
 * capture: boolean;
 * apiEndpoint: string;
 * webhookSecret: string
 */
var MxcErc20ProviderService = /*#__PURE__*/function (_AbstractPaymentServi) {
  (0, _inherits2["default"])(MxcErc20ProviderService, _AbstractPaymentServi);
  var _super = _createSuper(MxcErc20ProviderService);
  /// "token to pass for API to create payment intent"
  /// Need to use cached token to prevent request token a lot

  function MxcErc20ProviderService(_, options) {
    var _this;
    (0, _classCallCheck2["default"])(this, MxcErc20ProviderService);
    _this = _super.call(this, _, options);
    /**
     * Required mxc-erc20 options:
     *  {
     *    clientId: "mxc-erc20 client id", REQUIRED
     *    secretKey: "mxc-erc20 secret key", REQUIRED
     *    // Use this flag to capture payment immediately (default is false)
     *    capture: true
     *    apiEndpoint
     *  }
     */
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "bearer_token", "");
    _this.options_ = options;
    return _this;
  }
  (0, _createClass2["default"])(MxcErc20ProviderService, [{
    key: "getToken",
    value: function () {
      var _getToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this2 = this;
        var loginURL, loginHeader, loginRes, token;
        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(this.bearer_token && this.bearer_token !== "")) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return", this.bearer_token);
            case 2:
              _context2.prev = 2;
              loginURL = "".concat(this.options_.apiEndpoint, "/auth/apitoken/login");
              loginHeader = {
                "x-client-id": this.options_.clientId,
                "x-secret-key": this.options_.secretKey,
                "Content-Type": "application/json"
              };
              _context2.next = 7;
              return _axios["default"].post(loginURL, {}, {
                headers: loginHeader
              });
            case 7:
              loginRes = _context2.sent;
              token = loginRes.data.token;
              this.bearer_token = token;
              // Cache token for a while
              setTimeout(function () {
                return _this2.bearer_token = "";
              }, 20 * 60 * 1000);
              return _context2.abrupt("return", token);
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](2);
              console.log("Get Token");
              return _context2.abrupt("return", "");
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee, this, [[2, 14]]);
      }));
      function getToken() {
        return _getToken.apply(this, arguments);
      }
      return getToken;
    }()
  }, {
    key: "getPrice",
    value: function () {
      var _getPrice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var oracleURL, loginRes, _loginRes$data, code, latestPrice;
        return _regenerator["default"].wrap(function _callee2$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              oracleURL = "".concat(this.options_.apiEndpoint, "/oracle/get_price");
              _context3.next = 4;
              return _axios["default"].post(oracleURL, {});
            case 4:
              loginRes = _context3.sent;
              _loginRes$data = loginRes.data, code = _loginRes$data.code, latestPrice = _loginRes$data.data;
              if (!(code === 200)) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", latestPrice);
            case 8:
              return _context3.abrupt("return", 0);
            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              console.log("Get Token");
              return _context3.abrupt("return", "");
            case 15:
            case "end":
              return _context3.stop();
          }
        }, _callee2, this, [[0, 11]]);
      }));
      function getPrice() {
        return _getPrice.apply(this, arguments);
      }
      return getPrice;
    }()
  }, {
    key: "getIntentStatus",
    value: function () {
      var _getIntentStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(address) {
        var token, intentInfoURL, loginRes, intentInfo;
        return _regenerator["default"].wrap(function _callee3$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return this.getToken();
            case 3:
              token = _context4.sent;
              intentInfoURL = "".concat(this.options_.apiEndpoint, "/api/payment_intents/status");
              _context4.next = 7;
              return _axios["default"].post(intentInfoURL, {
                address: address
              }, {
                headers: {
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 7:
              loginRes = _context4.sent;
              intentInfo = loginRes.data.data;
              return _context4.abrupt("return", intentInfo.status);
            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", "Internal Server Error");
            case 15:
            case "end":
              return _context4.stop();
          }
        }, _callee3, this, [[0, 12]]);
      }));
      function getIntentStatus(_x) {
        return _getIntentStatus.apply(this, arguments);
      }
      return getIntentStatus;
    }()
  }, {
    key: "retrieveIntentData",
    value: function () {
      var _retrieveIntentData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
        var address, retrieveIntentUrl, postData, token, res, intentData;
        return _regenerator["default"].wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              address = data.address;
              retrieveIntentUrl = "".concat(this.options_.apiEndpoint, "/api/payment_intents/getInfo");
              postData = {
                address: address
              };
              _context5.prev = 3;
              _context5.next = 6;
              return this.getToken();
            case 6:
              token = _context5.sent;
              _context5.next = 9;
              return _axios["default"].post(retrieveIntentUrl, postData, {
                headers: {
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 9:
              res = _context5.sent;
              intentData = res.data.data;
              console.log("Retrive data", JSON.stringify(intentData));
              return _context5.abrupt("return", intentData);
            case 15:
              _context5.prev = 15;
              _context5.t0 = _context5["catch"](3);
              throw _context5.t0;
            case 18:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this, [[3, 15]]);
      }));
      function retrieveIntentData(_x2) {
        return _retrieveIntentData.apply(this, arguments);
      }
      return retrieveIntentData;
    }()
  }, {
    key: "getPaymentData",
    value: function () {
      var _getPaymentData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(paymentSession) {
        var data;
        return _regenerator["default"].wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              data = paymentSession.data;
              _context6.prev = 1;
              _context6.next = 4;
              return this.retrieveIntentData(data);
            case 4:
              return _context6.abrupt("return", _context6.sent);
            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](1);
              throw _context6.t0;
            case 10:
            case "end":
              return _context6.stop();
          }
        }, _callee5, this, [[1, 7]]);
      }));
      function getPaymentData(_x3) {
        return _getPaymentData.apply(this, arguments);
      }
      return getPaymentData;
    }()
  }, {
    key: "updatePaymentData",
    value: function () {
      var _updatePaymentData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(paymentSessionData, _data) {
        return _regenerator["default"].wrap(function _callee6$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", paymentSessionData);
            case 1:
            case "end":
              return _context7.stop();
          }
        }, _callee6);
      }));
      function updatePaymentData(_x4, _x5) {
        return _updatePaymentData.apply(this, arguments);
      }
      return updatePaymentData;
    }()
  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(context) {
        var _cart_context$payment, _customer$metadata, cart_id, email, items, cart_context, currency_code, amount, resource_id, customer, product_items, data, createIntentUrl, token, res, session_data;
        return _regenerator["default"].wrap(function _callee7$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              cart_id = context.id, email = context.email, items = context.items, cart_context = context.context, currency_code = context.currency_code, amount = context.amount, resource_id = context.resource_id, customer = context.customer;
              product_items = items.map(function (item) {
                var title = item.title,
                  thumbnail = item.thumbnail,
                  description = item.description,
                  unit_price = item.unit_price,
                  quantity = item.quantity,
                  total = item.total;
                return {
                  title: title,
                  thumbnail: thumbnail,
                  description: description,
                  unit_price: unit_price,
                  quantity: quantity,
                  total: total
                };
              });
              data = {
                description: (_cart_context$payment = cart_context.payment_description) !== null && _cart_context$payment !== void 0 ? _cart_context$payment : "",
                amount: Math.round(amount) / 100,
                email: email,
                currency: currency_code.toLocaleUpperCase(),
                request_id: (0, _uuid.v4)(),
                merchant_order_id: (0, _uuid.v4)(),
                metadata: {
                  cart_id: cart_id,
                  resource_id: resource_id
                },
                product_items: product_items,
                capture_method: this.options_.capture ? "automatic" : "manual"
              };
              createIntentUrl = "".concat(this.options_.apiEndpoint, "/api/payment_intents/create");
              _context8.next = 7;
              return this.getToken();
            case 7:
              token = _context8.sent;
              _context8.next = 10;
              return _axios["default"].post(createIntentUrl, JSON.stringify({
                intent_info: data
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 10:
              res = _context8.sent;
              session_data = res.data.data;
              return _context8.abrupt("return", {
                session_data: session_data,
                update_requests: customer !== null && customer !== void 0 && (_customer$metadata = customer.metadata) !== null && _customer$metadata !== void 0 && _customer$metadata.mxc_erc20_id ? undefined : {
                  customer_metadata: {
                    mxc_erc20_id: data.customer_id
                  }
                }
              });
            case 15:
              _context8.prev = 15;
              _context8.t0 = _context8["catch"](0);
              console.log(_context8.t0);
              throw new Error("CreatePayment has issue.");
            case 19:
            case "end":
              return _context8.stop();
          }
        }, _callee7, this, [[0, 15]]);
      }));
      function createPayment(_x6) {
        return _createPayment.apply(this, arguments);
      }
      return createPayment;
    }()
  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(paymentData) {
        return _regenerator["default"].wrap(function _callee8$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              console.log("retrievePayment ==>");
              _context9.prev = 1;
              _context9.next = 4;
              return this.retrieveIntentData(paymentData);
            case 4:
              return _context9.abrupt("return", _context9.sent);
            case 7:
              _context9.prev = 7;
              _context9.t0 = _context9["catch"](1);
              throw _context9.t0;
            case 10:
            case "end":
              return _context9.stop();
          }
        }, _callee8, this, [[1, 7]]);
      }));
      function retrievePayment(_x7) {
        return _retrievePayment.apply(this, arguments);
      }
      return retrievePayment;
    }()
  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(paymentSessionData, _cart) {
        return _regenerator["default"].wrap(function _callee9$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", paymentSessionData);
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee9);
      }));
      function updatePayment(_x8, _x9) {
        return _updatePayment.apply(this, arguments);
      }
      return updatePayment;
    }()
  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(paymentSession, _context) {
        var stat;
        return _regenerator["default"].wrap(function _callee10$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.getStatus(paymentSession.data);
            case 2:
              stat = _context11.sent;
              return _context11.abrupt("return", {
                data: paymentSession.data,
                status: stat
              });
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee10, this);
      }));
      function authorizePayment(_x10, _x11) {
        return _authorizePayment.apply(this, arguments);
      }
      return authorizePayment;
    }()
  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(payment) {
        return _regenerator["default"].wrap(function _callee11$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.updateOrderInCryptoPaymentGateway(payment);
            case 2:
              return _context12.abrupt("return", payment.data);
            case 3:
            case "end":
              return _context12.stop();
          }
        }, _callee11, this);
      }));
      function capturePayment(_x12) {
        return _capturePayment.apply(this, arguments);
      }
      return capturePayment;
    }() // To show order detail page from crypto management panel,
    // need to update order id. This would be used to verify transaction later.
  }, {
    key: "updateOrderInCryptoPaymentGateway",
    value: function () {
      var _updateOrderInCryptoPaymentGateway = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(payment) {
        var order_id, pay_id, data, address, updateOrderUrl, token;
        return _regenerator["default"].wrap(function _callee12$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              order_id = payment.order_id, pay_id = payment.id, data = payment.data;
              address = data.address;
              updateOrderUrl = "".concat(this.options_.apiEndpoint, "/api/order_history/update");
              _context13.next = 6;
              return this.getToken();
            case 6:
              token = _context13.sent;
              if (!(!token || token === "")) {
                _context13.next = 9;
                break;
              }
              throw new Error("GetToken issue.");
            case 9:
              _context13.next = 11;
              return _axios["default"].post(updateOrderUrl, JSON.stringify({
                address: address,
                order_id: order_id,
                pay_id: pay_id
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 11:
              _context13.next = 16;
              break;
            case 13:
              _context13.prev = 13;
              _context13.t0 = _context13["catch"](0);
              console.log("UpdateOrderInCryptoPaymentGateway", _context13.t0);
            case 16:
            case "end":
              return _context13.stop();
          }
        }, _callee12, this, [[0, 13]]);
      }));
      function updateOrderInCryptoPaymentGateway(_x13) {
        return _updateOrderInCryptoPaymentGateway.apply(this, arguments);
      }
      return updateOrderInCryptoPaymentGateway;
    }()
  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(payment, refundAmount) {
        return _regenerator["default"].wrap(function _callee13$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              _context14.prev = 0;
              return _context14.abrupt("return", payment.data);
            case 4:
              _context14.prev = 4;
              _context14.t0 = _context14["catch"](0);
              throw _context14.t0;
            case 7:
            case "end":
              return _context14.stop();
          }
        }, _callee13, null, [[0, 4]]);
      }));
      function refundPayment(_x14, _x15) {
        return _refundPayment.apply(this, arguments);
      }
      return refundPayment;
    }()
  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(payment) {
        var address, cancelOrderUrl, token;
        return _regenerator["default"].wrap(function _callee14$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              address = payment.data.address;
              _context15.prev = 1;
              cancelOrderUrl = "".concat(this.options_.apiEndpoint, "/api/payment_intents/cancel");
              _context15.next = 5;
              return this.getToken();
            case 5:
              token = _context15.sent;
              if (!(!token || token === "")) {
                _context15.next = 8;
                break;
              }
              throw new Error("GetToken issue.");
            case 8:
              _context15.next = 10;
              return _axios["default"].post(cancelOrderUrl, JSON.stringify({
                address: address,
                "cancellation_reason": "Order cancelled",
                request_id: (0, _uuid.v4)()
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 10:
              return _context15.abrupt("return", _context15.sent);
            case 13:
              _context15.prev = 13;
              _context15.t0 = _context15["catch"](1);
              console.log(_context15.t0);
              if (!(_context15.t0.payment_intent.status === "CANCELLED")) {
                _context15.next = 18;
                break;
              }
              return _context15.abrupt("return", _context15.t0.payment_intent);
            case 18:
              throw _context15.t0;
            case 19:
            case "end":
              return _context15.stop();
          }
        }, _callee14, this, [[1, 13]]);
      }));
      function cancelPayment(_x16) {
        return _cancelPayment.apply(this, arguments);
      }
      return cancelPayment;
    }()
  }, {
    key: "deletePayment",
    value: function () {
      var _deletePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(paymentSession) {
        var address, cancelOrderUrl, token;
        return _regenerator["default"].wrap(function _callee15$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              address = paymentSession.data.address;
              _context16.prev = 1;
              cancelOrderUrl = "".concat(this.options_.apiEndpoint, "/api/payment_intents/cancel");
              _context16.next = 5;
              return this.getToken();
            case 5:
              token = _context16.sent;
              if (!(!token || token === "")) {
                _context16.next = 8;
                break;
              }
              throw new Error("GetToken issue.");
            case 8:
              _context16.next = 10;
              return _axios["default"].post(cancelOrderUrl, JSON.stringify({
                address: address,
                "cancellation_reason": "Order cancelled",
                request_id: (0, _uuid.v4)()
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer ".concat(token)
                }
              });
            case 10:
              _context16.next = 16;
              break;
            case 12:
              _context16.prev = 12;
              _context16.t0 = _context16["catch"](1);
              console.log(_context16.t0);
              throw new Error("DeletePayment issue.");
            case 16:
            case "end":
              return _context16.stop();
          }
        }, _callee15, this, [[1, 12]]);
      }));
      function deletePayment(_x17) {
        return _deletePayment.apply(this, arguments);
      }
      return deletePayment;
    }()
  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(data) {
        var address, intentStatus;
        return _regenerator["default"].wrap(function _callee16$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              _context17.prev = 0;
              address = data.address; // STEP #1: Before retrieve a intent, should get authorized token first.
              _context17.next = 4;
              return this.getIntentStatus(address);
            case 4:
              intentStatus = _context17.sent;
              _context17.t0 = intentStatus;
              _context17.next = _context17.t0 === "payment.waiting" ? 8 : _context17.t0 === "payment.fundminus" ? 9 : _context17.t0 === "empty" ? 10 : _context17.t0 === "payment.expired" ? 10 : _context17.t0 === "payment.cancel" ? 10 : _context17.t0 === "payment.withdrawed" ? 11 : _context17.t0 === "payment.funded" ? 11 : 12;
              break;
            case 8:
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.PENDING);
            case 9:
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.REQUIRES_MORE);
            case 10:
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.CANCELED);
            case 11:
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.AUTHORIZED);
            case 12:
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.PENDING);
            case 13:
              _context17.next = 18;
              break;
            case 15:
              _context17.prev = 15;
              _context17.t1 = _context17["catch"](0);
              return _context17.abrupt("return", _medusa.PaymentSessionStatus.PENDING);
            case 18:
            case "end":
              return _context17.stop();
          }
        }, _callee16, this, [[0, 15]]);
      }));
      function getStatus(_x18) {
        return _getStatus.apply(this, arguments);
      }
      return getStatus;
    }()
    /**
     * Constructs Stripe Webhook event
     * @param {object} data - the data of the webhook request: req.body
     * @param {object} signature - the Stripe signature on the event, that
     *    ensures integrity of the webhook event
     * @return {object} Stripe Webhook event
     */
  }, {
    key: "constructWebhookEvent",
    value: function constructWebhookEvent(data, signature, policy) {
      var secret = this.options_.webhookSecret;
      var signatureHex = _crypto["default"].createHmac('sha256', secret).update(policy).digest('hex');
      if (signatureHex === signature) {
        return data;
      } else {
        throw new Error("failed to verify webhook signature.");
      }
    }
  }]);
  return MxcErc20ProviderService;
}(_medusa.AbstractPaymentService);
(0, _defineProperty2["default"])(MxcErc20ProviderService, "identifier", "mxc-erc20");
var _default = MxcErc20ProviderService;
exports["default"] = _default;