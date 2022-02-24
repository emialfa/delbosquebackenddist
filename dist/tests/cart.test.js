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
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs');
const user_1 = __importDefault(require("../models/user"));
const jwt = require("jsonwebtoken");
require("../database");
const { MONGODB_URI } = require('../helpers/config');
const api = supertest(app);
let token;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI) {
        yield user_1.default.deleteMany({});
        const newUser = new user_1.default({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            cart: 'cartTest',
            favorites: [],
        });
        const res = yield newUser.save();
        console.log(res);
        token = jwt.sign({
            userEmail: res.email,
            isAdmin: res.isAdmin,
        }, process.env.secret);
    }
}));
test("cart are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get("/api/v1/cart")
        .set('authtoken', token)
        .send();
    expect(response.body.cart).toBe('cartTest');
}));
test("add to cart, then new cart are returned ", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.post("/api/v1/cart")
        .set('authtoken', token)
        .send({
        cart: 'cartTestUpdated'
    });
    const response = yield api.get("/api/v1/cart")
        .set('authtoken', token)
        .send();
    expect(response.body.cart).toBe('cartTestUpdated');
}));
afterAll(() => {
    mongoose.connection.close();
});
//# sourceMappingURL=cart.test.js.map