"use strict";
var _a;
require('dotenv').config();
const PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI;
}
module.exports = {
    MONGODB_URI,
    PORT
};
//# sourceMappingURL=config.js.map