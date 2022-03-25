import { addMyOrder, addPayment, deleteOrder, feedback, getAllMyOrders, getAllOrders,  getMyOrder, getOrder, getOrdersCount, getOrdersDay, getOrdersMonths, getOrdersWeek, getRevenues, mpnotification, mpprefenceid, mpwebhooks, updateOrder } from '../controllers/orders';
import {Router} from 'express';
const router = Router();
const { authJwt, authAdminJwt } = require("../helpers/jwt");
const {verifyUser} = require("../authenticate")

router.get("/single/:id",verifyUser, getMyOrder)

router.get("/all", verifyUser, getAllMyOrders)

router.get("/admin/single/:id",verifyUser, authAdminJwt, getOrder)

router.get('/admin/all',verifyUser, authAdminJwt, getAllOrders)

router.post('/mpwebhooks', mpwebhooks)

router.post('/mpnotification', verifyUser, mpnotification)

router.post('/', verifyUser, addMyOrder)

router.put('/mpprefenceid',verifyUser,  mpprefenceid)

router.put('/:id', updateOrder)

router.delete('/:id', deleteOrder)

router.post('/payment', addPayment)

router.get("/feedback", feedback)

router.get(`/get/count`, getOrdersCount)

router.get(`/get/week`, getOrdersWeek)

router.get(`/get/day`, getOrdersDay)

router.get(`/get/revenues`, getRevenues)

router.get(`/get/sixmonths`, getOrdersMonths)

module.exports = router;