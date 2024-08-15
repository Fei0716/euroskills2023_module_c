"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuth = exports.userAuth = void 0;
const jwt_1 = require("../utils/jwt");
const apiTokens_1 = require("../services/apiTokens");
const userAuth = (req, res, next) => {
    if (req.path !== '/login') {
        const token = req.cookies.access_token;
        try {
            (0, jwt_1.verifyJwt)(token);
            next();
        }
        catch (e) {
            res.redirect('/login');
        }
    }
    else {
        next();
    }
};
exports.userAuth = userAuth;
const tokenAuth = (req, res, next) => {
    const token = req.header('X-API-TOKEN');
    (0, apiTokens_1.isValidToken)(token).then(isValid => {
        if (isValid) {
            next();
            return;
        }
        res
            .status(401)
            .contentType("application/problem+json")
            .json({
            "type": "/problem/types/401",
            "title": "Unauthorized",
            "status": 401,
            "detail": "The header X-API-TOKEN is missing or invalid."
        });
    });
};
exports.tokenAuth = tokenAuth;
//# sourceMappingURL=authentication.js.map