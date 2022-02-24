"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const favorites_1 = require("../controllers/favorites");
const express_1 = require("express");
const router = (0, express_1.Router)();
const { verifyUser } = require("../authenticate");
router.get('/', verifyUser, favorites_1.getFavorites);
router.post('/', verifyUser, favorites_1.addFavorites);
module.exports = router;
//# sourceMappingURL=favorites.js.map