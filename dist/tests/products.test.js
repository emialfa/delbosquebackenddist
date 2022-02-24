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
const product_1 = __importDefault(require("../models/product"));
require("../database");
const create_usertest_1 = require("./utils/create-usertest");
const { MONGODB_URI } = require('../helpers/config');
const api = supertest(app);
let token;
const initialProducts = [
    {
        name: 'test1',
        description: 'test1',
        category: 'test',
        type: 'test',
        countInStock: 50,
    },
    {
        name: 'test2',
        description: 'test2',
        category: 'test',
        type: 'test',
        countInStock: 50,
    }
];
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI) {
        token = yield (0, create_usertest_1.createUserTest)();
        yield product_1.default.deleteMany({});
        for (const product of initialProducts) {
            let newProduct = new product_1.default(product);
            yield newProduct.save();
        }
    }
}));
test("all products are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get("/api/v1/products").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialProducts.length);
}));
test('add product, then all products and new type are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/api/v1/products')
        .set('authtoken', token)
        .send({
        name: 'test2',
        description: 'test2',
        category: 'test',
        type: 'test',
        countInStock: 50,
    })
        .expect(200);
    const response = yield api.get("/api/v1/products").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialProducts.length + 1);
}));
test('update name of product, then new name of product are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.get("/api/v1/products").send();
    yield api.put('/api/v1/products/' + res.body[1]._id)
        .set('authtoken', token)
        .send({
        name: "test2updated",
    })
        .expect(200);
    const response = yield api.get("/api/v1/products").send();
    console.log(response.body);
    expect(response.body[1].name).toBe("test2updated");
}));
test('delete product, then all products less one are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.get("/api/v1/products").send();
    yield api.delete('/api/v1/products/' + res.body[1]._id)
        .set('authtoken', token)
        .expect(200);
    const response = yield api.get("/api/v1/products").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialProducts.length - 1);
}));
afterAll(() => {
    mongoose.connection.close();
});
//# sourceMappingURL=products.test.js.map