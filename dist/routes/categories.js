"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const categories_1 = require("../controllers/categories");
const { authAdminJwt } = require("../helpers/jwt");
const { verifyUser } = require("../authenticate");
router.get("/", categories_1.getCategories);
router.get("/:id", categories_1.getCategory);
router.post("/", verifyUser, authAdminJwt, categories_1.addCategory);
router.put("/:id", verifyUser, authAdminJwt, categories_1.updateCategory);
router.delete("/:id", verifyUser, authAdminJwt, categories_1.deleteCategory);
module.exports = router;
//# sourceMappingURL=categories.js.map