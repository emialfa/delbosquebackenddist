"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const types_1 = require("../controllers/types");
const { authAdminJwt } = require("../helpers/jwt");
const { verifyUser } = require("../authenticate");
router.get("/", types_1.getTypes);
router.get("/:id", types_1.getType);
router.post("/", verifyUser, authAdminJwt, types_1.addType);
router.put("/:id", verifyUser, authAdminJwt, types_1.updateType);
router.delete("/:id", verifyUser, authAdminJwt, types_1.deleteType);
module.exports = router;
//# sourceMappingURL=types.js.map