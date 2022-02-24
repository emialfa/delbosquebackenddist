"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const authAdminJwt = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin) === true) {
        next();
    }
    else {
        res.status(400).json({ error: 'Acceso denegado' });
    }
};
const authTestJwt = (req, res, next) => {
    const token = req.header('authtoken');
    if (!token)
        return res.status(401).json({ error: 'Acceso denegado' });
    try {
        const verified = jwt.verify(token, process.env.secret);
        if (verified.userEmail !== 'test@test.com')
            return res.status(401).json({ error: 'Acceso denegado' });
        req.body.email = verified.userEmail;
        next();
    }
    catch (error) {
        res.status(400).json({ error: 'Acceso denegado' });
    }
};
module.exports = { authAdminJwt };
//# sourceMappingURL=jwt.js.map