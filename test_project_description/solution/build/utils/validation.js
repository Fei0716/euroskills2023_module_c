"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, values) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = schema.safeParse(values)) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c.reduce((errors, error) => error.path.reduce((a, b, level) => {
        if (level === error.path.length - 1) {
            a[b] = error.message;
            return errors;
        }
        if (!a[b]) {
            a[b] = {};
        }
        return a[b];
    }, errors), {});
};
exports.validate = validate;
//# sourceMappingURL=validation.js.map