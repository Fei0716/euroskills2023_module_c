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
const workspace_1 = require("../services/workspace");
const user_1 = require("../services/user");
const views_1 = require("../utils/views");
const validWorkspace = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.workspaceId && req.params.workspaceId !== 'create') {
        const workspace = yield (0, workspace_1.getWorkspace)(req.params.workspaceId);
        const user = yield (0, user_1.getUserFromRequest)(req);
        if (!workspace || !user || workspace.user.id !== user.id) {
            return (0, views_1.notFound)(res);
        }
    }
    next();
});
exports.default = validWorkspace;
//# sourceMappingURL=validWorkspace.js.map