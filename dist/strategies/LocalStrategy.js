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
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const user_1 = __importDefault(require("../models/user"));
const passport_1 = __importDefault(require("passport"));
//Called during login/sign up.
passport_1.default.use(new LocalStrategy({
    usernameField: 'email',
}, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({ email: email });
        if (!user)
            return done(null, false);
        if (!bcrypt.compareSync(password, user.passwordHash))
            return done(null, false);
        return done(null, user);
    });
}));
//called while after logging in / signing up to set user details in req.user
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
//# sourceMappingURL=LocalStrategy.js.map