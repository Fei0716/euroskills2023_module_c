"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (res) => res.status(404).render('errors/404.njk');
exports.notFound = notFound;
//# sourceMappingURL=views.js.map