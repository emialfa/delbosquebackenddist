"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const sucursalesCA_1 = require("../controllers/sucursalesCA");
router.get(`/:codpostal`, sucursalesCA_1.getCodPostal);
module.exports = router;
//# sourceMappingURL=sucursalesCA.js.map