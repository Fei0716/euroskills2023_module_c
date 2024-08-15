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
const workspace_1 = require("../../services/workspace");
const views_1 = require("../../utils/views");
const bills_1 = require("../../services/bills");
const date_fns_1 = require("date-fns");
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    if (!workspace || !year || !month) {
        return (0, views_1.notFound)(res);
    }
    const { apiTokens, services, total } = yield (0, bills_1.getBill)(workspace, year, month);
    return res.render('bills/view.njk', {
        workspace,
        apiTokens,
        services,
        year,
        month,
        monthName: (0, date_fns_1.format)(new Date(`${year}-${month}-01`), 'MMMM'),
        total,
    });
});
exports.default = {
    show,
};
//# sourceMappingURL=bills.js.map