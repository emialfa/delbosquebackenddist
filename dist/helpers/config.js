"use strict";
var _a;
require('dotenv').config();
let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let API_URL = process.env.API_URL;
let MERCADOPAGO_ACCESSTOKEN = process.env.MERCADOPAGO_ACCESSTOKEN;
let _URL_ = process.env.URL;
if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
    PORT = process.env.TEST_PORT;
    API_URL = process.env.TEST_API_URL;
    MERCADOPAGO_ACCESSTOKEN = process.env.TEST_MERCADOPAGO_ACCESSTOKEN;
    _URL_ = process.env.TEST_URL;
}
module.exports = {
    MONGODB_URI,
    PORT,
    API_URL,
    MERCADOPAGO_ACCESSTOKEN,
    _URL_
};
//# sourceMappingURL=config.js.map