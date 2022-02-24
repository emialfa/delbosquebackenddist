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
exports.createUserTest = void 0;
const user_1 = __importDefault(require("../../models/user"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const initialUser = {
    name: "testUser",
    email: "test@test.com",
    passwordHash: bcrypt.hashSync("test123", 10),
    phone: "1234567",
    document: "1234567",
    isAdmin: true,
    street: "test 123",
    apartment: "test 123",
    zip: "1234",
    city: "test",
    country: "test",
    cart: "",
    shippingAdress: "",
    activation: true,
    favorites: [],
};
const createUserTest = () => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.deleteMany({});
    const newUser = new user_1.default(initialUser);
    yield newUser.save();
    const token = jwt.sign({
        userEmail: initialUser.email,
        isAdmin: initialUser.isAdmin,
    }, process.env.secret);
    return token;
});
exports.createUserTest = createUserTest;
//# sourceMappingURL=create-usertest.js.map