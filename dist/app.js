"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const cloudinary_1 = require("cloudinary");
const mercadopago_1 = __importDefault(require("mercadopago"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { PORT, API_URL, MERCADOPAGO_ACCESSTOKEN } = require('./helpers/config');
const errorHandler = require('./helpers/error-handler');
// settings
app.set('port', PORT);
require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");
// middlewares
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(",")
    : [];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(passport.initialize());
app.use(errorHandler);
require('express-async-errors');
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
mercadopago_1.default.configure({
    access_token: `${MERCADOPAGO_ACCESSTOKEN}`
});
cloudinary_1.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});
//routes
const categoriesRoutes = require('./routes/categories');
const typesRoutes = require('./routes/types');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const favoritesRoutes = require('./routes/favorites');
const cartRoutes = require('./routes/cart');
const sucursalesCARoutes = require('./routes/sucursalesCA');
app.use(`${API_URL}/types`, typesRoutes);
app.use(`${API_URL}/categories`, categoriesRoutes);
app.use(`${API_URL}/products`, productsRoutes);
app.use(`${API_URL}/users`, usersRoutes);
app.use(`${API_URL}/favorites`, favoritesRoutes);
app.use(`${API_URL}/orders`, ordersRoutes);
app.use(`${API_URL}/cart`, cartRoutes);
app.use(`${API_URL}/sucursalesCA`, sucursalesCARoutes);
module.exports = app;
//# sourceMappingURL=app.js.map