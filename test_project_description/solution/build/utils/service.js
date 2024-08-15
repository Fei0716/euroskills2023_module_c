"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceUnavailable = void 0;
function serviceUnavailable(req, res) {
    res.status(503).send({
        "type": "/problem/types/503",
        "title": "Service Unavailable",
        "status": 503,
        "detail": "The service is currently unavailable."
    });
}
exports.serviceUnavailable = serviceUnavailable;
//# sourceMappingURL=service.js.map