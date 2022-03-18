const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs')
import User from "../models/user";
import Product from "../models/product";
import "../database";
const {getToken} = require("../authenticate")
const {MONGODB_URI} = require('../helpers/config')

const api = supertest(app)

let token:string;
let idFavorite: string;

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        await User.deleteMany({});
        await Product.deleteMany({})
        let newProduct = new Product({
            name: 'test1',
            description: 'test1',
            category: 'test',
            type: 'test',
            countInStock: 50,
        })
        const product = await newProduct.save()
        const newUser = new User({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            favorites: [product._id+""],
        })
        idFavorite = product._id+''
        token = getToken({ _id: newUser?._id })
        const res = await newUser.save()
    }
})

test("favorites are returned", async () => {
  const response = await api.get(process.env.TEST_API_URL + "/favorites")
  .set('Authorization', `Bearer ${token}`)
  .send();
  console.log(response.body)
  expect(response.body.favorites[0]+'').toBe(idFavorite)
});

test("remove to favorites, then new favorites are returned ", async () => {
    const res = await api.post(process.env.TEST_API_URL + "/favorites")
    .set('Authorization', `Bearer ${token}`)
    .send({
        favorites: []
    });
    const response = await api.get(process.env.TEST_API_URL + "/favorites")
    .set('Authorization', `Bearer ${token}`)
    .send();
    expect(response.body.favorites).toHaveLength(0)
  });

afterAll(() => {
    mongoose.connection.close()
})