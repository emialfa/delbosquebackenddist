"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const { authAdminJwt } = require("../helpers/jwt");
const users_1 = require("../controllers/users");
const passport = require("passport");
const { verifyUser } = require("../authenticate");
router.get("/all", verifyUser, authAdminJwt, users_1.getAllUsers);
router.get("/logout", verifyUser, users_1.logout);
router.get("/:id", verifyUser, users_1.getUserFromId);
router.get("/", verifyUser, users_1.getUserFromEmail);
router.put("/update", verifyUser, users_1.update);
router.put("/changepassword", verifyUser, users_1.changepassword);
router.post("/login", passport.authenticate("local"), users_1.login);
router.post("/login/googleAuth", users_1.loginGoogleAuth);
router.post("/login/facebookAuth", users_1.loginFacebookAuth);
router.post("/register", users_1.register);
router.post("/refreshToken", users_1.refreshToken);
router.post("/emailconfirm", verifyUser, users_1.emailconfirm);
router.post("/confirm", verifyUser, users_1.confirm);
router.post("/emailresetpassword", users_1.emailresetpassword);
router.delete("/:id", verifyUser, authAdminJwt, users_1.deleteUser);
if (((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === 'test') {
    router.post("/deletetestuser", users_1.deleteTestUser);
}
module.exports = router;
//# sourceMappingURL=users.js.map