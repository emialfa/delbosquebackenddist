"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = require("../controllers/cart");
const express_1 = require("express");
const router = (0, express_1.Router)();
const { verifyUser } = require("../authenticate");
router.get('/', verifyUser, cart_1.getCart);
router.post('/', verifyUser, cart_1.addCart);
module.exports = router;
//# sourceMappingURL=cart.js.map