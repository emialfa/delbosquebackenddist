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
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
test("branch office of correo argentino are returned", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get(process.env.TEST_API_URL + "/sucursalesCA/8000")
        .send();
    expect(response.body[0].codpostal).toBe('8000');
    expect(response.body[0].localidad).toBe('BAHIA BLANCA');
}));
//# sourceMappingURL=sucursalesCA.test.js.map