const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
import Product from "../models/product";
import "../database";
import { createUserTest } from "./utils/create-usertest";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

const initialProducts = [
    {
        name: 'test1',
        description: 'test1',
        category: 'test',
        type: 'test',
        countInStock: 50,
        image: 'https://res.cloudinary.com/delbosque-tienda/image/upload/v1626594479/bdi8e10t2sq4ypf3e9h3.jpg',
        price: 30
    },
    {
        name: 'test2',
        description: 'test2',
        category: 'test',
        type: 'test',
        countInStock: 50,
        image:'https://res.cloudinary.com/delbosque-tienda/image/upload/v1626594479/bdi8e10t2sq4ypf3e9h3.jpg',
        price: 30
    }
]

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        token = await createUserTest()
        await Product.deleteMany({})
        for(const product of initialProducts) {
            let newProduct = new Product(product)
            await newProduct.save()
        }
    }
})

test("all products are returned", async () => {
  const response = await api.get(process.env.TEST_API_URL + "/products").send();
  console.log(response.body);
  expect(response.body).toHaveLength(initialProducts.length)
});

test('add product, then all products and new type are returned', async () => {
    await api.post(process.env.TEST_API_URL + '/products') 
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: 'test2',
        description: 'test2',
        category: 'test',
        type: 'test',
        countInStock: 50,
    })
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/products").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialProducts.length+1)
})

test('update name of product, then new name of product are returned', async () => {
    const res = await api.get(process.env.TEST_API_URL + "/products").send();
    await api.put(process.env.TEST_API_URL + '/products/'+res.body[1]._id) 
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: "test2updated",
    })
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/products").send();
    console.log(response.body);
    expect(response.body[1].name).toBe("test2updated")
})

test('delete product, then all products less one are returned', async () => {
    const res = await api.get(process.env.TEST_API_URL + "/products").send();
    await api.delete(process.env.TEST_API_URL + '/products/'+res.body[1]._id) 
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/products").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialProducts.length-1)
})

afterAll(() => {
    mongoose.connection.close()
})