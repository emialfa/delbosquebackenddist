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
exports.getCodPostal = void 0;
const sucursalesCA = require('../helpers/sucursalesCA.json');
const getCodPostal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.codpostal)
        return res.status(400).json({ success: false });
    let search = (suc) => suc.codpostal == req.params.codpostal;
    const listSucursalesCA = sucursalesCA.filter(search);
    if (!listSucursalesCA)
        return res.status(400).json({ success: false });
    res.status(200).send(listSucursalesCA);
});
exports.getCodPostal = getCodPostal;
//# sourceMappingURL=sucursalesCA.js.map