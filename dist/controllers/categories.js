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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategory = exports.getCategories = void 0;
const cloudinaryFiles_1 = require("../helpers/cloudinaryFiles");
const category_1 = __importDefault(require("../models/category"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.default.find();
    if (!categories)
        res.status(400).json({ success: false });
    res.send(categories);
});
exports.getCategories = getCategories;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.default.findById(req.params.id);
    if (!category)
        res.status(400).json({ success: false });
    res.status(200).send(category);
});
exports.getCategory = getCategory;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let iconImage;
    if (req.body.icon)
        iconImage = req.body.icon;
    if (req.files) {
        const file = req.files.image;
        iconImage = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
    }
    let category = new category_1.default({
        name: req.body.name,
        icon: iconImage,
        color: req.body.color
    });
    category = yield category.save();
    if (!category)
        return res.status(400).send({ success: false, message: 'The category cannot be created!' });
    res.send(category);
});
exports.addCategory = addCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let iconImage;
    const categoryFind = yield category_1.default.findById(req.params.id);
    if (!categoryFind)
        res.status(400).send({ success: false });
    if (req.body.icon) {
        iconImage = req.body.icon;
    }
    if (req.files) {
        const file = req.files.image;
        iconImage = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
        (0, cloudinaryFiles_1.removeFileToCloudinary)(`${categoryFind === null || categoryFind === void 0 ? void 0 : categoryFind.icon}`);
    }
    const category = yield category_1.default.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: iconImage,
        color: req.body.color,
    }, { new: true });
    if (!category)
        return res.status(400).send({ success: false });
    res.send(category);
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryFind = yield category_1.default.findById(req.params.id);
    if (!categoryFind) {
        return res.status(404).send('category not found');
    }
    if (`${categoryFind.icon}`.length > 0) {
        (0, cloudinaryFiles_1.removeFileToCloudinary)(`${categoryFind.icon}`);
    }
    const categoryUpdateResponse = yield category_1.default.findByIdAndRemove(req.params.id);
    if (!categoryUpdateResponse)
        return res.status(400).json({ success: false, message: "The category cannot be deleted!" });
    return res.status(200).json({ success: true, message: 'the category is deleted!' });
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categories.js.map