"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = require('./app');
require("./database");
function main() {
    app.listen(app.get('port'));
    console.log('Server on port ' + app.get('port'));
}
main();
//# sourceMappingURL=index.js.map