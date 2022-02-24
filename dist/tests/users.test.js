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
require("../database");
const create_usertest_1 = require("./utils/create-usertest");
const { MONGODB_URI } = require('../helpers/config');
const api = supertest(app);
let token;
const initialUsers = [
    {
        name: "testUser1",
        email: "test1@test.com",
        passwordHash: bcrypt.hashSync("test1234", 10),
        activation: true,
        favorites: [],
    }, {
        name: "testUser2",
        email: "test2@test.com",
        passwordHash: bcrypt.hashSync("test1234", 10),
        activation: true,
        favorites: [],
    }
];
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI) {
        yield user_1.default.deleteMany({});
        token = yield (0, create_usertest_1.createUserTest)();
        for (const user of initialUsers) {
            let userObject = new user_1.default(user);
            yield userObject.save();
        }
        const res = yield user_1.default.find();
    }
}));
test("all users are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get("/api/v1/users/all")
        .set('authtoken', token)
        .send();
    expect(response.body).toHaveLength(initialUsers.length);
}));
test('register user, then all users and new type are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/api/v1/users/register')
        .send(Object.assign(Object.assign({}, initialUsers[0]), { name: "testUser3", email: "test3@test.com", password: "test1234" }))
        .expect(200);
    const response = yield api.get("/api/v1/users/all")
        .set('authtoken', token)
        .send();
    expect(response.body).toHaveLength(initialUsers.length + 1);
}));
test('update name of user, then new name of user are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.post("/api/v1/users/login")
        .send({
        email: initialUsers[1].email,
        password: "test1234"
    });
    const resUpdate = yield api.put('/api/v1/users/update')
        .set('authtoken', res.body.token)
        .send({
        name: "testUser2updated"
    })
        .expect(200);
    const response = yield api.get("/api/v1/users/all")
        .set('authtoken', token)
        .send();
    expect(response.body[1].name).toBe("testUser2updated");
}));
test('delete user, then all users less one are returned', () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield api.get("/api/v1/users/all")
        .set('authtoken', token)
        .send();
    yield api.delete('/api/v1/users/' + res.body[1]._id)
        .set('authtoken', token)
        .expect(200);
    const response = yield api.get("/api/v1/users/all")
        .set('authtoken', token)
        .send();
    expect(response.body).toHaveLength(initialUsers.length - 1);
}));
afterAll(() => {
    mongoose.connection.close();
});
//# sourceMappingURL=users.test.js.map