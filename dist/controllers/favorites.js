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
exports.addFavorites = exports.getFavorites = void 0;
const user_1 = __importDefault(require("../models/user"));
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_1.default.findOne({ email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email }).select("favorites");
    if (!user)
        res.status(400).send({ success: false });
    res.status(200).json({ favorites: user === null || user === void 0 ? void 0 : user.favorites });
});
exports.getFavorites = getFavorites;
const addFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = yield user_1.default.findOne({ email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email });
    if (!user)
        res.status(400).send({ success: false });
    const userUpdated = yield user_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        favorites: req.body.favorites,
    });
    if (!userUpdated)
        return res.status(400).send({ success: false, message: "The favorites cannot be updated" });
    res.status(200).send({ success: true, message: "Added product successfully" });
});
exports.addFavorites = addFavorites;
//# sourceMappingURL=favorites.js.map