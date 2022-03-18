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
const product_1 = __importDefault(require("../models/product"));
require("../database");
const { getToken } = require("../authenticate");
const { MONGODB_URI } = require('../helpers/config');
const api = supertest(app);
let token;
let idFavorite;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI) {
        yield user_1.default.deleteMany({});
        yield product_1.default.deleteMany({});
        let newProduct = new product_1.default({
            name: 'test1',
            description: 'test1',
            category: 'test',
            type: 'test',
            countInStock: 50,
        });
        const product = yield newProduct.save();
        const newUser = new user_1.default({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            favorites: [product._id + ""],
        });
        idFavorite = product._id + '';
        token = getToken({ _id: newUser === null || newUser === void 0 ? void 0 : newUser._id });
        const res = yield newUser.save();
    }
}));
test("favorites are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get(process.env.TEST_API_URL + "/favorites")
        .set('Authorization', `Bearer ${token}`)
        .send();
    console.log(response.body);
    expect(response.body.favorites[0] + '').toBe(idFavorite);
}));
test("remove to favorites, then new favorites are returned ", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.post(process.env.TEST_API_URL + "/favorites")
        .set('Authorization', `Bearer ${token}`)
        .send({
        favorites: []
    });
    const response = yield api.get(process.env.TEST_API_URL + "/favorites")
        .set('Authorization', `Bearer ${token}`)
        .send();
    expect(response.body.favorites).toHaveLength(0);
}));
afterAll(() => {
    mongoose.connection.close();
});
//# sourceMappingURL=favorites.test.js.map