"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.error(err);
        return res.status(401).json({ message: "The user is not authorized" });
    }
    if (err.name === 'ValidationError') {
        //  validation error
        console.error(err);
        return res.status(401).json({ message: err });
    }
    // default to 500 server error
    console.error(err);
    return res.status(500).json(err);
}
module.exports = errorHandler;
//# sourceMappingURL=error-handler.js.map