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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCount = exports.deleteOrder = exports.feedback = exports.addPayment = exports.updateOrder = exports.mpprefenceid = exports.addMyOrder = exports.mpnotification = exports.mpwebhooks = exports.getAllOrders = exports.getOrder = exports.getAllMyOrders = exports.getMyOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const mercadopago = require('mercadopago');
const user_1 = __importDefault(require("../models/user"));
const orderConfirmMail = require("../templates/order-confirm");
const { MERCADOPAGO_ACCESSTOKEN, _URL_ } = require('../helpers/config');
mercadopago.configure({
    access_token: `${MERCADOPAGO_ACCESSTOKEN}`
});
const getMyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userExist = yield user_1.default.find({ email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email });
    if (!userExist)
        res.status(400).send({ success: false });
    const orders = yield order_1.default.findById(req.params.id);
    res.send(orders);
});
exports.getMyOrder = getMyOrder;
const getAllMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userExist = yield user_1.default.find({ email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email });
    if (!userExist)
        res.status(400).send({ success: false });
    const orders = yield order_1.default.find({ userEmail: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email });
    res.send(orders);
});
exports.getAllMyOrders = getAllMyOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_1.default.findById(req.params.id);
    res.send(orders);
});
exports.getOrder = getOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_1.default.find();
    res.send(orders);
});
exports.getAllOrders = getAllOrders;
const mpwebhooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('ok');
});
exports.mpwebhooks = mpwebhooks;
const mpnotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data.id)
        return res.status(400).send({ success: false });
    const payment = yield mercadopago.payment.findById(req.body.data.id);
    const merchantOrder = yield mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    const order = yield order_1.default.findOne({ MPPreferenceId: preferenceId });
    const orderUpdateRes = yield order_1.default.findByIdAndUpdate(order === null || order === void 0 ? void 0 : order._id, {
        paymentMPStatus: status == 'approved' ? 'Aprobado' : status == 'in_process' ? 'Pendiente de aprobación' : status == 'rejected' ? 'Fallido' : status,
        paymentMPStatus_detail: statusDetail,
    }, { new: true });
    if (!orderUpdateRes)
        return res.status(400).send({ success: false, message: 'The order cannot be updated.' });
    return res.status(200).send({ sucess: true });
});
exports.mpnotification = mpnotification;
const addMyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const userExist = yield user_1.default.findOne({ email: (_d = req.user) === null || _d === void 0 ? void 0 : _d.email });
    if (!userExist)
        return res.status(400).send({ success: false });
    let order = new order_1.default(Object.assign(Object.assign({}, req.body), { userEmail: (_e = req.user) === null || _e === void 0 ? void 0 : _e.email }));
    console.log(order);
    order = yield order.save();
    if (!order)
        return res.status(400).send({ success: false, message: 'The order cannot be created!' });
    const mailResponse = yield orderConfirmMail(userExist.name, (_f = req.user) === null || _f === void 0 ? void 0 : _f.email, req.body.paymentMPStatus, order._id);
    if (!mailResponse)
        return res.status(400).send({ success: false, message: mailResponse });
    return res.status(200).send({ success: true, message: mailResponse, order });
});
exports.addMyOrder = addMyOrder;
const mpprefenceid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const orderFind = yield order_1.default.findOne({ MPPreferenceId: req.body.MPPreferenceId });
    console.log(orderFind);
    const order = yield order_1.default.findByIdAndUpdate(orderFind === null || orderFind === void 0 ? void 0 : orderFind._id, {
        paymentMPStatus: req.body.paymentMPStatus,
        paymentMPStatus_detail: req.body.paymentMPStatus_detail,
    }, { new: true });
    if (!order)
        return res.status(400).send({ success: false, messagge: 'The order cannot be update!' });
    return res.send(order);
});
exports.mpprefenceid = mpprefenceid;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order)
        return res.status(400).send({ success: false, messagge: 'The order cannot be update!' });
    return res.send(order);
});
exports.updateOrder = updateOrder;
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let preference = {
        items: [],
        back_urls: {
            success: `${_URL_}/order/resultmp`,
            failure: `${_URL_}/order/resultmp`,
            pending: `${_URL_}/order/resultmp`,
        },
        auto_return: "approved",
    };
    req.body.cart.forEach((p) => {
        preference.items.push({
            title: p.name,
            unit_price: p.price,
            quantity: p.quantity,
        });
    });
    preference.items.push({
        title: 'Costo de envío',
        unit_price: req.body.shippingCost,
        quantity: 1,
    });
    const response = yield mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;
    const sandbox_init_point = response.body.sandbox_init_point;
    console.log(response.body);
    console.log(preferenceId);
    res.send({ preferenceId, sandbox_init_point });
});
exports.addPayment = addPayment;
const feedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield mercadopago.payment.findById(req.query.payment_id);
    const merchantOrder = yield mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    console.log(preferenceId);
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    res.status(200).send({ preferenceId, status, statusDetail });
});
exports.feedback = feedback;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderFind = yield order_1.default.findById(req.params.id);
    if (!orderFind)
        return res.status(400).send({ success: false });
    const orderDeleteRes = yield order_1.default.findByIdAndRemove(req.params.id);
    if (!orderDeleteRes)
        return res.status(404).json({ success: false, message: "The order cannot be created!" });
    return res.status(200).json({ success: true, message: 'the order is deleted!' });
});
exports.deleteOrder = deleteOrder;
const getCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderCount = yield order_1.default.countDocuments((count) => count);
    if (!orderCount)
        res.status(400).json({ success: false });
    res.status(200).send({ orderCount: orderCount });
});
exports.getCount = getCount;
//# sourceMappingURL=orders.js.map