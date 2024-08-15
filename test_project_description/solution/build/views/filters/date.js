"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateTimeFilter = exports.dateFilter = void 0;
const date_fns_1 = require("date-fns");
const dateFilter = (value, dateFormat = 'yyyy-MM-dd') => (0, date_fns_1.format)(value, dateFormat);
exports.dateFilter = dateFilter;
const dateTimeFilter = (value, dateTimeFormat = 'yyyy-MM-dd HH:mm') => (0, exports.dateFilter)(value, dateTimeFormat);
exports.dateTimeFilter = dateTimeFilter;
//# sourceMappingURL=date.js.map