"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// should of course be read from the ENV in reality, but this should simplify it a bit for us
const secret = 'B6EGGa61KgQKluRnuZCxKKZOJg9OO8cfME9SULhA2Bv3Gpd8qYE5cbFoWAFzNhk';
const signToken = (data, subject) => jsonwebtoken_1.default.sign(data, secret, {
    expiresIn: '3d',
    subject,
});
exports.signToken = signToken;
const verifyJwt = (token) => jsonwebtoken_1.default.verify(token, secret);
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=jwt.js.map