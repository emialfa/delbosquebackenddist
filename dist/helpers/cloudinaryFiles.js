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
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlDefaultImage = exports.removeFileToCloudinary = exports.uploadFiletoCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const uploadFiletoCloudinary = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(image.tempFilePath);
        return result.secure_url;
    }
    catch (err) {
        throw err;
    }
});
exports.uploadFiletoCloudinary = uploadFiletoCloudinary;
const removeFileToCloudinary = (urlIcon) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = urlIcon.split('/');
        yield cloudinary_1.v2.uploader.destroy(`${url[url.length - 1].slice(0, -4)}`);
    }
    catch (err) {
        throw err;
    }
});
exports.removeFileToCloudinary = removeFileToCloudinary;
exports.urlDefaultImage = "https://res.cloudinary.com/delbosque-tienda/image/upload/v1634497960/noImage_w4m5hg.png";
//# sourceMappingURL=cloudinaryFiles.js.map