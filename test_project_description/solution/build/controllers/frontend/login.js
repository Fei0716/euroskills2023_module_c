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
const zod_1 = require("zod");
const user_1 = require("../../services/user");
const validation_1 = require("../../utils/validation");
const hashing_1 = require("../../utils/hashing");
const jwt_1 = require("../../utils/jwt");
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('auth/login.njk');
});
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        username: zod_1.z.string().nonempty({ message: 'Username is required' }),
        password: zod_1.z.string().nonempty({ message: 'Password is required' }),
    });
    const errors = (0, validation_1.validate)(schema, req.body);
    if (errors) {
        return res.render('auth/login.njk', {
            errors,
        });
    }
    const user = yield (0, user_1.getUser)(req.body.username);
    if (!user || !(yield (0, hashing_1.verifyHash)(req.body.password, user.password))) {
        return res.render('auth/login.njk', {
            loginFailed: true,
        });
    }
    const token = (0, jwt_1.signToken)({ username: req.body.username }, `${user.id}`);
    return res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
    }).redirect('/');
});
exports.default = {
    get,
    post,
};
//# sourceMappingURL=login.js.map