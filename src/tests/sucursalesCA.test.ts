const supertest = require("supertest");
const app = require("../app");
const api = supertest(app)

test("branch office of correo argentino are returned", async () => {
    const response = await api.get(process.env.TEST_API_URL + "/sucursalesCA/8000")
    .send();
    expect(response.body[0].codpostal).toBe('8000')
    expect(response.body[0].localidad).toBe('BAHIA BLANCA')
  });
