"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const { authAdminJwt } = require("../helpers/jwt");
const products_1 = require("../controllers/products");
const { verifyUser } = require("../authenticate");
router.get("/", products_1.getProducts);
router.get("/:id", products_1.getProduct);
router.post("/", verifyUser, authAdminJwt, products_1.addProduct);
router.put("/:id", verifyUser, authAdminJwt, products_1.updateProduct);
router.delete("/:id", verifyUser, authAdminJwt, products_1.deleteProduct);
router.get(`/get/featuredproducts`, products_1.featuredProducts);
module.exports = router;
//# sourceMappingURL=products.js.map