"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    orderItems: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pendiente',
    },
    userEmail: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    paymentMPStatus: {
        type: String,
        default: 'No iniciado'
    },
    paymentMPStatus_detail: {
        type: String,
        default: ''
    },
    MPPreferenceId: {
        type: String,
    },
    MPbutton: {
        type: Boolean,
        default: false,
    },
    paymentStatus: {
        type: String,
        default: 'No iniciado'
    },
    trackingCode: {
        type: String,
        default: 'No se ha especificado aún.'
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
});
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
orderSchema.set('toJSON', {
    virtuals: true,
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=order.js.map