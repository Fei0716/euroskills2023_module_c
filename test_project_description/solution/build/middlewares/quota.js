"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiTokens_1 = require("../services/apiTokens");
const quotaCheck = (req, res, next) => {
    const token = req.header('X-API-TOKEN');
    (0, apiTokens_1.isQuotaExceeded)(token).then(isExceeded => {
        if (!isExceeded) {
            next();
            return;
        }
        res
            .status(403)
            .contentType("application/problem+json")
            .json({
            "type": "/problem/types/403",
            "title": "Quota Exceeded",
            "status": 403,
            "detail": "You have exceeded your quota."
        });
    });
};
exports.default = quotaCheck;
//# sourceMappingURL=quota.js.map