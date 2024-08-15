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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const validation_1 = require("../../utils/validation");
const ApiToken_1 = require("../../entities/ApiToken");
const workspace_1 = require("../../services/workspace");
const apiTokens_1 = require("../../services/apiTokens");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('apiTokens/create.njk');
});
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().max(100, 'Name must be at most 100 characters').nonempty({ message: 'Name is required' }),
    });
    const errors = (0, validation_1.validate)(schema, req.body);
    if (errors) {
        return res.render('apiTokens/create.njk', {
            errors,
            values: req.body,
        });
    }
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    const apiToken = new ApiToken_1.ApiToken();
    apiToken.name = req.body.name;
    apiToken.token = crypto_1.default.randomBytes(25).toString('hex'); // 25 bytes => 50 hex chars
    apiToken.workspace = workspace;
    yield apiToken.save();
    return res.render('apiTokens/view.njk', {
        apiToken,
        workspace,
    });
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
    const apiToken = yield (0, apiTokens_1.getApiToken)(req.params.tokenId);
    if (workspace && apiToken && apiToken.workspace.id === workspace.id) {
        apiToken.revokedAt = new Date();
        yield apiToken.save();
    }
    return res.redirect(`/workspaces/${workspace.id}?action=tokenRevoked`);
});
exports.default = {
    create,
    store,
    destroy,
};
//# sourceMappingURL=apiTokens.js.map