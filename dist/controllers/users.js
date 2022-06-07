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
exports.getUsersWeek = exports.countUsers = exports.deleteTestUser = exports.logout = exports.deleteUser = exports.emailresetpassword = exports.confirm = exports.emailconfirm = exports.refreshToken = exports.register = exports.loginFacebookAuth = exports.loginGoogleAuth = exports.login = exports.changepassword = exports.update = exports.getUserFromEmail = exports.getUserFromId = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
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
    const user = yield user_1.default.findByIdAndUpdate(userExist._id, Object.assign(Object.assign({}, req.body), { passwordHash: newPassword }), { new: true });
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
const loginFacebookAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l;
    const { accessToken, userID } = req.body;
    const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
    const data = yield (0, cross_fetch_1.default)(URL).then((res) => res.json()).then((res) => { return res; });
    const { email, name } = data;
    const user = yield user_1.default.findOne({ email: email });
    if (user) {
        const token = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        (_k = user.refreshToken) === null || _k === void 0 ? void 0 : _k.push({ refreshToken });
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
        (_l = newUser.refreshToken) === null || _l === void 0 ? void 0 : _l.push({ refreshToken });
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
exports.loginFacebookAuth = loginFacebookAuth;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_1.default.findOne({ email: req.body.email });
    if (userExist)
        return res.status(400).send({ success: false });
    const secret = process.env.secret;
    const user = new user_1.default(Object.assign(Object.assign({}, req.body), { passwordHash: bcrypt.hashSync(req.body.password, 10), activation: false }));
    const registerUserRes = yield user.save();
    const token = getToken({ _id: registerUserRes === null || registerUserRes === void 0 ? void 0 : registerUserRes._id });
    if (!registerUserRes)
        return res.status(400).send({ success: false, message: "the user cannot be created!" });
    const registerMailRes = yield registerMail(req.body.name, req.body.email, token);
    if (!registerMailRes)
        return res.status(400).send({ success: false, message: registerMailRes, token });
    res.json({ success: true, message: 'The email has been sent.', token });
});
exports.register = register;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
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
    const tokenIndex = (_m = user.refreshToken) === null || _m === void 0 ? void 0 : _m.findIndex((item) => item.refreshToken === refreshToken);
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
    var _o, _p;
    const userExist = yield user_1.default.findOne({ email: (_o = req.user) === null || _o === void 0 ? void 0 : _o.email });
    if (!userExist)
        return res.status(400).send("User dont exist.");
    if (userExist.activation)
        return res.status(200).json({ activation: true });
    const token = getToken({ _id: userExist._id });
    const registerMailResponse = yield registerMail(userExist.name, (_p = req.user) === null || _p === void 0 ? void 0 : _p.email, token);
    if (!registerMailResponse)
        return res.status(400).json({ success: false, message: registerMailResponse });
    return res.status(200).json({ success: true, message: registerMailResponse });
});
exports.emailconfirm = emailconfirm;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r;
    const userExist = yield user_1.default.findOne({ email: (_q = req.user) === null || _q === void 0 ? void 0 : _q.email });
    if (!userExist)
        res.status(400).send({ success: false });
    const user = yield user_1.default.findByIdAndUpdate(userExist === null || userExist === void 0 ? void 0 : userExist._id, {
        activation: true,
    }, { new: true });
    return res.status(200).send((_r = req.user) === null || _r === void 0 ? void 0 : _r.email);
});
exports.confirm = confirm;
const emailresetpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_1.default.findOne({ email: req.body.email });
    if (!userExist)
        return res.status(400).send({ success: false });
    const token = getToken({ _id: userExist === null || userExist === void 0 ? void 0 : userExist._id });
    const mailResponse = yield resetPasswordMail(userExist.name, req.body.email, token);
    if (!mailResponse)
        return res.status(400).send({ success: false, message: mailResponse });
    return res.status(200).send({ success: false, mailResponse });
});
exports.emailresetpassword = emailresetpassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDeleteRes = yield user_1.default.findByIdAndRemove(req.params.id);
    if (!userDeleteRes)
        return res.status(400).json({ success: false, message: "The user cannot be deleted!" });
    return res.status(200).json({ success: true, message: "The user is deleted!" });
});
exports.deleteUser = deleteUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    const user = yield user_1.default.findById((_s = req.user) === null || _s === void 0 ? void 0 : _s._id);
    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);
    if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
    }
    user.save();
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.send({ success: true });
});
exports.logout = logout;
const deleteTestUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_1.default.findOne({ email: req.body.email });
    const userDeleteRes = yield user_1.default.findByIdAndRemove(userExist === null || userExist === void 0 ? void 0 : userExist._id);
    if (!userDeleteRes)
        return res.status(400).json({ success: false, message: "The user cannot be deleted!" });
    return res.status(200).json({ success: true, message: "The user is deleted!" });
});
exports.deleteTestUser = deleteTestUser;
const countUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersCount = yield user_1.default.countDocuments();
    if (!usersCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        usersCount: usersCount,
    });
});
exports.countUsers = countUsers;
const getUsersWeek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersWeek = yield user_1.default.find({
        dateCreated: {
            $gte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
        }
    }).select("orderItems");
    const usersPrevWeek = yield user_1.default.find({
        dateCreated: {
            $gte: new Date(Date.now() - 14 * 60 * 60 * 24 * 1000), $lte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)
        }
    }).select("orderItems");
    let usersWeekTotal = usersWeek.length;
    let usersPrevWeekTotal = usersPrevWeek.length;
    const percent = usersPrevWeekTotal === 0 && usersWeekTotal === 0 ? 0 : usersPrevWeekTotal === 0 ? 100 : (usersWeekTotal > usersPrevWeekTotal ? usersWeekTotal : usersPrevWeekTotal) * 100 / (usersWeekTotal < usersPrevWeekTotal ? usersWeekTotal : usersPrevWeekTotal);
    res.status(200).send({ percent: `${usersWeekTotal >= usersPrevWeekTotal ? '' : '-'}${percent}` });
});
exports.getUsersWeek = getUsersWeek;
//# sourceMappingURL=users.js.map