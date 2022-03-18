"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const typeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
    categories: [{
            type: String
        }]
});
typeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
typeSchema.set('toJSON', {
    virtuals: true,
});
exports.default = (0, mongoose_1.model)('Type', typeSchema);
//# sourceMappingURL=type.js.map