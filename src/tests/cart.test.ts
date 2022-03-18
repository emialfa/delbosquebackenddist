const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs')
import User from "../models/user";
import "../database";
const {getToken} = require("../authenticate")
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        await User.deleteMany({});
        const newUser = new User({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            cart: 'cartTest',
            favorites: [],
        })
        token = getToken({ _id: newUser?._id })
        await newUser.save()       
    }
})

test("cart are returned", async () => {
  const response = await api.get(process.env.TEST_API_URL + "/cart")
  .set('Authorization', `Bearer ${token}`)
  .send();
  expect(response.body.cart).toBe('cartTest')
});

test("add to cart, then new cart are returned ", async () => {
    const res = await api.post(process.env.TEST_API_URL + "/cart")
    .set('Authorization', `Bearer ${token}`)
    .send({
        cart: 'cartTestUpdated'
    });
    const response = await api.get(process.env.TEST_API_URL + "/cart")
    .set('Authorization', `Bearer ${token}`)
    .send();
    expect(response.body.cart).toBe('cartTestUpdated')
  });

afterAll(() => {
    mongoose.connection.close()
})