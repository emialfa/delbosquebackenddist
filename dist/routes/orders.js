"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../controllers/orders");
const express_1 = require("express");
const router = (0, express_1.Router)();
const { authJwt, authAdminJwt } = require("../helpers/jwt");
const { verifyUser } = require("../authenticate");
router.get("/single/:id", verifyUser, orders_1.getMyOrder);
router.get("/all", verifyUser, orders_1.getAllMyOrders);
router.get("/admin/single/:id", verifyUser, authAdminJwt, orders_1.getOrder);
router.get('/admin/all', verifyUser, authAdminJwt, orders_1.getAllOrders);
router.post('/mpwebhooks', orders_1.mpwebhooks);
router.post('/mpnotification', verifyUser, orders_1.mpnotification);
router.post('/', verifyUser, orders_1.addMyOrder);
router.put('/mpprefenceid', verifyUser, orders_1.mpprefenceid);
router.put('/:id', orders_1.updateOrder);
router.delete('/:id', orders_1.deleteOrder);
router.post('/payment', orders_1.addPayment);
router.get("/feedback", orders_1.feedback);
router.get(`/get/count`, orders_1.getCount);
module.exports = router;
//# sourceMappingURL=orders.js.map