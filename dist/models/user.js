"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Session = new mongoose_1.Schema({
    refreshToken: {
        type: String,
        default: "",
    },
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
    },
    phone: {
        type: String,
    },
    document: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    authStrategy: {
        type: String,
        default: "local",
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    cart: {
        type: String,
        default: '',
    },
    shippingAdress: {
        type: String,
    },
    activation: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: [Session],
    },
    favorites: [{
            type: mongoose_1.Schema.Types.ObjectId,
        }],
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.refreshToken;
        return ret;
    }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.js.map