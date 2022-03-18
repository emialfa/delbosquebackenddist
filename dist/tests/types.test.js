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
const type_1 = __importDefault(require("../models/type"));
require("../database");
const create_usertest_1 = require("./utils/create-usertest");
const { MONGODB_URI } = require('../helpers/config');
const api = supertest(app);
let token;
const initialTypes = [
    {
        name: "test1",
        icon: '',
        color: '',
        categories: ['testCategory1']
    }, {
        name: "test2",
        icon: '',
        color: '',
        categories: ['test2Category1']
    }
];
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI) {
        token = yield (0, create_usertest_1.createUserTest)();
        yield type_1.default.deleteMany({});
        for (const type of initialTypes) {
            let typeObject = new type_1.default(type);
            yield typeObject.save();
        }
    }
}));
test("all types are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length);
}));
test('add type, then all types and new type are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post(process.env.TEST_API_URL + '/types')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: "test3",
        icon: '',
        color: '',
    })
        .expect(200);
    const response = yield api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length + 1);
}));
test('update name of type, then new name of type are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.get(process.env.TEST_API_URL + "/types").send();
    yield api.put(process.env.TEST_API_URL + '/types/' + res.body[1]._id)
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: "test2updated",
        icon: '',
        color: '',
    })
        .expect(200);
    const response = yield api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body[1].name).toBe("test2updated");
}));
test('delete type, then all types less one are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.get(process.env.TEST_API_URL + "/types").send();
    yield api.delete(process.env.TEST_API_URL + '/types/' + res.body[1]._id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    const response = yield api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length - 1);
}));
test('wrong id return status 500, and without modification', () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.delete(process.env.TEST_API_URL + '/types/134567')
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    const response = yield api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length);
}));
afterAll(() => {
    mongoose.connection.close();
});
//# sourceMappingURL=types.test.js.map