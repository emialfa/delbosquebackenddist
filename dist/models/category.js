"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    }
});
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
categorySchema.set('toJSON', {
    virtuals: true,
});
exports.default = (0, mongoose_1.model)('Category', categorySchema);
//# sourceMappingURL=category.js.map