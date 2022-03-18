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
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProduct = exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const cloudinaryFiles_1 = require("../helpers/cloudinaryFiles");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.type && req.query.category) {
        const filter = `${req.query.category}`.replace("+", " ");
        const products = yield product_1.default.find({
            category: filter,
            type: req.query.type,
        });
        if (!products)
            res.status(400).json({ success: false });
        res.send(products);
    }
    else if (req.query.type) {
        const products = yield product_1.default.find({ type: req.query.type });
        if (!products)
            res.status(400).json({ success: false });
        res.send(products);
    }
    else if (req.query.category) {
        const filter = `${req.query.category}`.replace("+", " ");
        const products = yield product_1.default.find({ category: filter });
        if (!products)
            res.status(400).json({ success: false });
        res.send(products);
    }
    else {
        const products = yield product_1.default.find();
        if (!products)
            res.status(400).json({ success: false });
        res.send(products);
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.findById(req.params.id);
    if (!product)
        res.status(400).json({ success: false });
    res.send(product);
});
exports.getProduct = getProduct;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const arr = [];
    if (req.body.urls)
        arr.push(...req.body.urls.split(","));
    //SI LLEGAN ARCHIVOS, SE SUBEN A CLOUDINARY Y SE GUARDAN LAS URLS
    if (req.files) {
        const files = req.files.image;
        if (Array.isArray(files)) {
            for (const file of files) {
                const url = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
                arr.push(url);
            }
        }
        else if (files) {
            const url = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(files);
            arr.push(url);
        }
    }
    if (arr.indexOf(cloudinaryFiles_1.urlDefaultImage) >= 0 && arr.length > 1) {
        arr.shift();
    }
    let product = new product_1.default(Object.assign(Object.assign({}, req.body), { price: Number(req.body.price), countInStock: Number(req.body.countInStock), image: arr[0], images: arr.length > 1 ? arr.filter((i, indice) => indice !== 0) : [] }));
    product = yield product.save();
    if (!product)
        return res.status(400).send({ success: false, message: "The product cannot be created" });
    res.send(product);
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productFind = yield product_1.default.findById(req.params.id);
    if (!productFind)
        return res.status(400).send({ success: false });
    const arr = [];
    //BORRANDO IMAGENES DE CLOUDIFY SI ES NECESARIO
    if (req.body.urls) {
        arr.push(...req.body.urls.split(","));
        if (arr.indexOf(`${productFind.image}`) < 0) {
            yield (0, cloudinaryFiles_1.removeFileToCloudinary)(`${productFind.image}`);
        }
        (_a = productFind.images) === null || _a === void 0 ? void 0 : _a.forEach((p) => __awaiter(void 0, void 0, void 0, function* () {
            if (arr.indexOf(p) < 0) {
                yield (0, cloudinaryFiles_1.removeFileToCloudinary)(p);
            }
        }));
    }
    //SI LLEGAN ARCHIVOS, SE SUBEN A CLOUDINARY Y SE GUARDAN LAS URLS
    if (req.files) {
        const files = req.files.image;
        if (Array.isArray(files)) {
            for (const file of files) {
                const url = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(file);
                arr.push(url);
            }
        }
        else if (files) {
            const url = yield (0, cloudinaryFiles_1.uploadFiletoCloudinary)(files);
            arr.push(url);
        }
    }
    const product = yield product_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { image: arr.length > 0 ? arr[0] : "", images: arr.length > 1 ? arr.filter((i, indice) => indice !== 0) : [] }), { new: true });
    if (!product)
        return res.status(400).send({ success: false, message: "The product cannot be updated" });
    res.send(product);
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const productFind = yield product_1.default.findById(req.params.id);
    if (!productFind)
        return res.status(400).send({ success: false });
    if (productFind.image && productFind.image !== cloudinaryFiles_1.urlDefaultImage) {
        yield (0, cloudinaryFiles_1.removeFileToCloudinary)(`${productFind.image}`);
    }
    if (productFind.images && productFind.images.length > 0) {
        (_b = productFind.images) === null || _b === void 0 ? void 0 : _b.forEach((im) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, cloudinaryFiles_1.removeFileToCloudinary)(im);
        }));
    }
    const productDeleteResponse = yield product_1.default.findByIdAndRemove(req.params.id);
    if (!productDeleteResponse)
        return res.status(400).json({ success: false, message: "product not found!" });
    return res.status(200).json({ success: true, message: "the product is deleted!" });
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products.js.map