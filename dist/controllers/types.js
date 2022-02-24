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
exports.deleteType = exports.updateType = exports.addType = exports.getType = exports.getTypes = void 0;
const type_1 = __importDefault(require("../models/type"));
const cloudinaryFiles_1 = require("../helpers/cloudinaryFiles");
const getTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield type_1.default.find();
    if (!types)
        return res.status(400).json({ success: false });
    res.send(types);
});
exports.getTypes = getTypes;
const getType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typesList = yield type_1.default.findById(req.params.id);
    if (!typesList)
        return res.status(400).json({ success: false });
    res.status(200).send(typesList);
});
exports.getType = getType;
const addType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let iconImage;
    if (req.body.icon)
        iconImage = req.body.icon;
    if (req.files) {
        const file = req.files.image;
        iconImage = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
    }
    const type = new type_1.default({
        name: req.body.name,
        icon: iconImage,
        color: req.body.color,
    });
    const typeCreateResponse = yield type.save();
    if (!typeCreateResponse)
        return res.status(400).send({ success: false, message: "The type cannot be created!" });
    res.status(200).send(typeCreateResponse);
});
exports.addType = addType;
const updateType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let iconImage = "";
    const typeFind = yield type_1.default.findById(req.params.id);
    if (!typeFind)
        return res.status(400).send({ success: false });
    if (req.body.icon)
        iconImage = req.body.icon;
    if (req.files) {
        const file = req.files.image;
        iconImage = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
        yield (0, cloudinaryFiles_1.removeFileToCloudinary)(`${typeFind === null || typeFind === void 0 ? void 0 : typeFind.icon}`);
    }
    const type = yield type_1.default.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: iconImage,
        color: req.body.color,
    }, { new: true });
    if (!type)
        return res.status(400).send({ success: false, message: "The type cannot be created" });
    res.send(type);
});
exports.updateType = updateType;
const deleteType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeFind = yield type_1.default.findById(req.params.id);
    if (!typeFind)
        return res.status(400).send({ success: false });
    if (`${typeFind.icon}`.length > 0) {
        yield (0, cloudinaryFiles_1.removeFileToCloudinary)(`${typeFind.icon}`);
    }
    const typeDeleteResponse = yield type_1.default.findByIdAndRemove(req.params.id);
    if (!typeDeleteResponse)
        return res.status(400).json({ success: false, message: "The type cannot be deleted!" });
    return res.status(200).json({ success: true, message: "the type is deleted!" });
});
exports.deleteType = deleteType;
//# sourceMappingURL=types.js.map