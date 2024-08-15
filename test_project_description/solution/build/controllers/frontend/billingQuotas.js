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
const zod_1 = require("zod");
const validation_1 = require("../../utils/validation");
const workspace_1 = require("../../services/workspace");
const BillingQuota_1 = require("../../entities/BillingQuota");
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    return res.render('billingQuotas/edit.njk', {
        workspace,
        values: {
            limit: (_a = workspace.billingQuota) === null || _a === void 0 ? void 0 : _a.limit,
        },
    });
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        limit: zod_1.z.coerce.number(),
    });
    const errors = (0, validation_1.validate)(schema, req.body);
    if (errors) {
        return res.render('billingQuotas/edit.njk', {
            errors,
            values: req.body,
        });
    }
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    if (req.body.limit) {
        const quota = workspace.billingQuota || new BillingQuota_1.BillingQuota();
        quota.limit = parseFloat(req.body.limit);
        quota.updatedAt = new Date();
        yield quota.save();
        if (!workspace.billingQuota) {
            workspace.billingQuota = quota;
            yield workspace.save();
        }
    }
    else if (workspace.billingQuota) {
        const quota = workspace.billingQuota;
        workspace.billingQuota = null;
        yield workspace.save();
        yield quota.remove();
    }
    return res.redirect(`/workspaces/${workspace.id}?action=quotaUpdated`);
});
exports.default = {
    edit,
    update,
};
//# sourceMappingURL=billingQuotas.js.map