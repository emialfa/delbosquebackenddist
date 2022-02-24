"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";
const passport_1 = __importDefault(require("passport"));
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: !dev,
    signed: true,
    maxAge: eval(`${process.env.REFRESH_TOKEN_EXPIRY}`) * 1000,
    sameSite: false,
};
exports.getToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(`${process.env.SESSION_EXPIRY}`),
    });
};
exports.getRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(`${process.env.REFRESH_TOKEN_EXPIRY}`),
    });
    return refreshToken;
};
exports.verifyUser = passport_1.default.authenticate("jwt", { session: false });
//# sourceMappingURL=authenticate.js.map