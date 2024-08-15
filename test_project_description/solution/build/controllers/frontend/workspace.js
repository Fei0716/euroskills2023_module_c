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
const Workspace_1 = require("../../entities/Workspace");
const user_1 = require("../../services/user");
const workspace_1 = require("../../services/workspace");
const date_fns_1 = require("date-fns");
const bills_1 = require("../../services/bills");
const schema = zod_1.z.object({
    title: zod_1.z.string().max(100, 'Title must be at most 100 characters').nonempty({ message: 'Title is required' }),
    description: zod_1.z.string().optional(),
});
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.getUserFromRequest)(req);
    const workspaces = yield Workspace_1.Workspace.findBy({ user: { id: user.id } });
    return res.render('workspaces/list.njk', {
        workspaces,
    });
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('workspaces/create.njk');
});
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, validation_1.validate)(schema, req.body);
    const sendError = (e) => res.render('workspaces/create.njk', {
        errors: e,
        values: req.body,
    });
    if (errors) {
        return sendError(errors);
    }
    // check if a workspace with this title already exists
    const user = yield (0, user_1.getUserFromRequest)(req);
    const existing = yield Workspace_1.Workspace.findOneBy({ title: req.body.title, user: { id: user.id } });
    if (existing) {
        return sendError({ title: 'A workspace with this title already exists' });
    }
    const workspace = new Workspace_1.Workspace();
    workspace.title = req.body.title;
    workspace.description = req.body.description || null;
    workspace.user = user;
    yield workspace.save();
    return res.redirect(`/workspaces/${workspace.id}`);
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    const { total: costsCurrentMonth } = yield (0, bills_1.getBill)(workspace, new Date().getFullYear(), new Date().getMonth() + 1);
    const daysLeftCurrentMonth = (0, date_fns_1.formatDuration)((0, date_fns_1.intervalToDuration)({ start: new Date(), end: (0, date_fns_1.startOfMonth)((0, date_fns_1.addMonths)(new Date(), 1)) }), { format: ['days'] }) || '1 day';
    const firstMonth = (0, date_fns_1.startOfMonth)(workspace.createdAt);
    const numBills = Math.abs((0, date_fns_1.differenceInMonths)(firstMonth, (0, date_fns_1.startOfMonth)(new Date()))) + 1;
    const bills = [...Array(numBills).keys()].map((i) => (0, date_fns_1.addMonths)(firstMonth, i)).reverse();
    return res.render('workspaces/view.njk', {
        workspace,
        action: req.query.action,
        costsCurrentMonth,
        daysLeftCurrentMonth,
        bills,
    });
});
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    return res.render('workspaces/edit.njk', {
        workspace,
        values: workspace,
    });
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    const errors = (0, validation_1.validate)(schema, req.body);
    const sendError = (e) => res.render('workspaces/create.njk', {
        workspace,
        errors: e,
        values: req.body,
    });
    if (errors) {
        return sendError(errors);
    }
    // check if a workspace with this title already exists which is not this one
    const user = yield (0, user_1.getUserFromRequest)(req);
    const existing = yield Workspace_1.Workspace.findOneBy({ title: req.body.title, user: { id: user.id } });
    if (existing && existing.id !== workspace.id) {
        return sendError({ title: 'A workspace with this title already exists' });
    }
    workspace.title = req.body.title;
    workspace.title = req.body.title;
    workspace.description = req.body.description || null;
    yield workspace.save();
    return res.redirect(`/workspaces/${workspace.id}?action=workspaceUpdated`);
});
exports.default = {
    index,
    create,
    store,
    show,
    edit,
    update,
};
//# sourceMappingURL=workspace.js.map