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
exports.getUserFromRequest = exports.getUser = void 0;
const User_1 = require("../entities/User");
const jwt_1 = require("../utils/jwt");
const getUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.User.findOneBy({ username });
});
exports.getUser = getUser;
const getUserFromRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, jwt_1.verifyJwt)(req.cookies.access_token);
    return User_1.User.findOneByOrFail({ username: token.username });
});
exports.getUserFromRequest = getUserFromRequest;
//# sourceMappingURL=user.js.map