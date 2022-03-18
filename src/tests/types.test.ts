const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
import Type from "../models/type";
import "../database";
import { createUserTest } from "./utils/create-usertest";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

const initialTypes = [
    {
        name: "test1",
        icon:'',
        color:'',  
        categories: ['testCategory1']
    }, {
        name: "test2",
        icon:'',
        color:'',  
        categories: ['test2Category1']
    }
]

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        token = await createUserTest()
        await Type.deleteMany({})
        for(const type of initialTypes) {
            let typeObject = new Type(type)
            await typeObject.save()
        }
    }
})

test("all types are returned", async () => {
  const response = await api.get(process.env.TEST_API_URL + "/types").send();
  expect(response.body).toHaveLength(initialTypes.length)
});

test('add type, then all types and new type are returned', async () => {
    await api.post(process.env.TEST_API_URL + '/types') 
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: "test3",
        icon:'',
        color:'', 
    })
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length+1)
})

test('update name of type, then new name of type are returned', async () => {
    const res = await api.get(process.env.TEST_API_URL + "/types").send();
    await api.put(process.env.TEST_API_URL + '/types/'+res.body[1]._id) 
    .set('Authorization', `Bearer ${token}`)
    .send({
        name: "test2updated",
        icon:'',
        color:'', 
    })
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body[1].name).toBe("test2updated")
})

test('delete type, then all types less one are returned', async () => {
    const res = await api.get(process.env.TEST_API_URL + "/types").send();
    await api.delete(process.env.TEST_API_URL + '/types/'+res.body[1]._id) 
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    const response = await api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length-1)
})

test('wrong id return status 500, and without modification', async () => {
    await api.delete(process.env.TEST_API_URL + '/types/134567') 
    .set('Authorization', `Bearer ${token}`)
    .expect(500)
    const response = await api.get(process.env.TEST_API_URL + "/types").send();
    expect(response.body).toHaveLength(initialTypes.length);
})

afterAll(() => {
    mongoose.connection.close()
})