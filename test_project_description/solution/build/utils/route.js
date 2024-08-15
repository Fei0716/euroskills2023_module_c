"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unless = void 0;
function unless(paths, middleware) {
    return function (req, res, next) {
        if (paths.some(path => req.path.startsWith(path))) {
            return next();
        }
        else {
            return middleware(req, res, next);
        }
    };
}
exports.unless = unless;
//# sourceMappingURL=route.js.map