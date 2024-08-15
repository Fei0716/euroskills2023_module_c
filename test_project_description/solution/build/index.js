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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dataSource_1 = require("./db/dataSource");
const routes_1 = require("./routes");
const date_1 = require("./views/filters/date");
dataSource_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connection established');
    const app = (0, express_1.default)();
    const port = parseInt(process.env.PORT, 10) || 3000;
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, 'static')));
    (0, routes_1.setupRoutes)(app);
    const nunEnv = nunjucks_1.default.configure(path_1.default.join(__dirname, 'views'), {
        autoescape: true,
        express: app,
        noCache: true,
    });
    nunEnv.addFilter('date', date_1.dateFilter);
    nunEnv.addFilter('dateTime', date_1.dateTimeFilter);
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})).catch(console.error);
//# sourceMappingURL=index.js.map