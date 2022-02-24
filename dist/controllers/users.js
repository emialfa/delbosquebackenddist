"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.deleteUser = exports.deleteTestUser = exports.emailresetpassword = exports.confirm = exports.emailconfirm = exports.refreshToken = exports.register = exports.loginGoogleAuth = exports.login = exports.changepassword = exports.update = exports.getUserFromEmail = exports.getUserFromId = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerMail = require("../templates/registerMail");
const resetPasswordMail = require("../templates/resetPassword");
const passport = require("passport");
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.GOOGLE_EMAIL_CLIENT_ID);
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userList = yield user_1.default.find().select("email name isAdmin");
    const emailList = userList.filter((u) => { var _a; return u.email !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email); });
    if (!userList)
        return res.status(400).json({ success: false });
    return res.send(emailList);
});
exports.getAllUsers = getAllUsers;
const getUserFromId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.id).select("-passwordHash");
    if (!user)
        return res.status(400).send({ success: false });
    return res.status(200).send(user);
});
exports.getUserFromId = getUserFromId;
const getUserFromEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_1.default.find({ email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email }).select("-passwordHash");
    if (!user)
        return res.status(400).json({ success: false });
    return res.status(200).send(user);
});
exports.getUserFromEmail = getUserFromEmail;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userExist = yield user_1.default.findOne({ email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email });
    if (!userExist)
        return res.status(400).json({ success: false });
    let newPassword;
    if (req.body.newPassword && bcrypt.compareSync(req.body.password, userExist.passwordHash)) {
        newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    }
    else if (!req.body.newPassword) {
        newPassword = userExist.passwordHash;
    }
    else {
        return res.status(400).send("contraseña incorrecta");
    }
    const user = yield user_1.default.findByIdAndUpdate(userExist._id, Object.assign({}, req.body), { new: true });
    if (!user)
        return res.status(400).send({ success: false });
    return res.status(200).send(user);
});
exports.update = update;
const changepassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userExist = yield user_1.default.findOne({ email: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email });
    if (!userExist)
        return res.status(400).json({ success: false });
    if (!req.body.password || req.body.password.length == 0) {
        return res.status(400).send("No has especificado ningun password");
    }
    const newPassword = bcrypt.hashSync(req.body.password, 10);
    const user = yield user_1.default.findByIdAndUpdate(userExist._id, {
        passwordHash: newPassword,
    }, { new: true });
    if (!user)
        return res.status(400).send("the user cannot be created!");
    return res.status(200).send(user);
});
exports.changepassword = changepassword;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    const user = yield user_1.default.findById((_d = req.user) === null || _d === void 0 ? void 0 : _d._id);
    if (!user)
        return res.status(400).send({ success: false });
    const token = getToken({ _id: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id });
    const refreshToken = getRefreshToken({ _id: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id });
    (_g = user.refreshToken) === null || _g === void 0 ? void 0 : _g.push({ refreshToken });
    yield user.save();
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(200)
        .send({
        success: true,
        user: user.email,
        token: token,
        favorites: user.favorites,
        cart: user.cart,
        isAdmin: user.isAdmin,
    });
});
exports.login = login;
const loginGoogleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    const verify = yield client.verifyIdToken({ idToken: req.body.tokenId, audience: process.env.GOOGLE_EMAIL_CLIENT_ID });
    const { email_verified, email, name } = verify.payload;
    if (!email_verified)
        return res.status(400).json({ success: false, message: "Email verification failed." });
    const user = yield user_1.default.findOne({ email: email });
    if (user) {
        const token = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        (_h = user.refreshToken) === null || _h === void 0 ? void 0 : _h.push({ refreshToken });
        yield user.save();
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        return res.status(200).send({
            success: true,
            user: user.email,
            token: token,
            favorites: user.favorites,
            cart: user.cart,
            isAdmin: user.isAdmin,
        });
    }
    else {
        let newUser = new user_1.default({
            success: true,
            email,
            name,
            favorites: req.body.favorites,
            cart: req.body.cart,
            refreshToken: [],
            passwordHash: bcrypt.hashSync(process.env.GOOGLE_PASSWORD, 10),
            isAdmin: false,
            activation: true,
        });
        const token = getToken({ _id: newUser._id });
        const refreshToken = getRefreshToken({ _id: newUser._id });
        (_j = newUser.refreshToken) === null || _j === void 0 ? void 0 : _j.push({ refreshToken });
        yield newUser.save();
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        return res.status(200).send({
            success: true,
            token: token,
            favorites: newUser.favorites,
            cart: newUser.cart,
            isAdmin: newUser.isAdmin,
        });
    }
});
exports.loginGoogleAuth = loginGoogleAuth;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_1.default.findOne({ email: req.body.email });
    if (userExist)
        return res.status(400).send({ success: false });
    const secret = process.env.secret;
    const user = new user_1.default(Object.assign(Object.assign({}, req.body), { passwordHash: bcrypt.hashSync(req.body.password, 10), activation: false }));
    const registerUserRes = yield user.save();
    const token = jwt.sign({
        userEmail: req.body.email,
    }, secret);
    if (!registerUserRes)
        return res.status(400).send({ success: false, message: "the user cannot be created!" });
    const registerMailRes = yield registerMail(req.body.name, req.body.email, token);
    if (!registerMailRes)
        return res.status(400).send({ success: false, message: registerMailRes, token });
    res.json({ success: true, message: 'The email has been sent.', token });
});
exports.register = register;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken)
        return res.status(401).send({ success: false, message: "Unauthorized" });
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload._id;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        return res.status(401).send({ success: false, message: "Unauthorized" });
    // Find the refresh token against the user record in database
    const tokenIndex = (_k = user.refreshToken) === null || _k === void 0 ? void 0 : _k.findIndex((item) => item.refreshToken === refreshToken);
    if (tokenIndex === -1)
        res.status(401).send({ success: false, message: "Unauthorized" });
    const token = getToken({ _id: userId });
    // If the refresh token exists, then create new one and replace it.
    const newRefreshToken = getRefreshToken({ _id: userId });
    user.refreshToken[Number(tokenIndex)] = { refreshToken: newRefreshToken };
    user.save();
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token, isAdmin: user.isAdmin });
});
exports.refreshToken = refreshToken;
const emailconfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o;
    const userExist = yield user_1.default.findOne({ email: (_l = req.user) === null || _l === void 0 ? void 0 : _l.email });
    if (!userExist)
        return res.status(400).send("User dont exist.");
    if (userExist.activation)
        return res.status(200).json({ activation: true });
    const secret = process.env.secret;
    const token = jwt.sign({
        userEmail: (_m = req.user) === null || _m === void 0 ? void 0 : _m.email,
    }, secret);
    const registerMailResponse = yield registerMail(userExist.name, (_o = req.user) === null || _o === void 0 ? void 0 : _o.email, token);
    if (!registerMailResponse)
        return res.status(400).json({ success: false, message: registerMailResponse });
    return res.status(200).json({ success: true, message: registerMailResponse });
});
exports.emailconfirm = emailconfirm;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q;
    const userExist = yield user_1.default.findOne({ email: (_p = req.user) === null || _p === void 0 ? void 0 : _p.email });
    if (!userExist)
        res.status(400).send({ success: false });
    const user = yield user_1.default.findByIdAndUpdate(userExist === null || userExist === void 0 ? void 0 : userExist._id, {
        activation: true,
    }, { new: true });
    return res.status(200).send((_q = req.user) === null || _q === void 0 ? void 0 : _q.email);
});
exports.confirm = confirm;
const emailresetpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_1.default.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!userExist)
        return res.status(400).send({ success: false });
    const token = jwt.sign({
        userEmail: req.body.email,
    }, secret);
    const mailResponse = yield resetPasswordMail(userExist.name, req.body.email, token);
    if (!mailResponse)
        return res.status(400).send({ success: false, message: mailResponse });
    return res.status(200).send({ success: false, mailResponse });
});
exports.emailresetpassword = emailresetpassword;
const deleteTestUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userTest = yield user_1.default.findOne({ email: "test@test.com" });
    if (!userTest)
        return res.status(400).json({ success: false });
    const userDeleteRes = yield user_1.default.findByIdAndRemove(userTest._id);
    if (!userDeleteRes)
        return res.status(400).json({ success: false, message: "The user cannot be deleted." });
    return res.status(200).json({ success: true, message: "The user is deleted!" });
});
exports.deleteTestUser = deleteTestUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDeleteRes = yield user_1.default.findByIdAndRemove(req.params.id);
    if (!userDeleteRes)
        return res.status(400).json({ success: false, message: "The user cannot be deleted!" });
    return res.status(200).json({ success: true, message: "The user is deleted!" });
});
exports.deleteUser = deleteUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    const user = yield user_1.default.findById((_r = req.user) === null || _r === void 0 ? void 0 : _r._id);
    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);
    if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
    }
    user.save();
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.send({ success: true });
});
exports.logout = logout;
//# sourceMappingURL=users.js.map