"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const login_1 = __importDefault(require("./controllers/frontend/login"));
const logout_1 = __importDefault(require("./controllers/frontend/logout"));
const workspace_1 = __importDefault(require("./controllers/frontend/workspace"));
const apiTokens_1 = __importDefault(require("./controllers/frontend/apiTokens"));
const billingQuotas_1 = __importDefault(require("./controllers/frontend/billingQuotas"));
const bills_1 = __importDefault(require("./controllers/frontend/bills"));
const chat_1 = __importDefault(require("./controllers/api/chat"));
const imageGeneration_1 = __importDefault(require("./controllers/api/imageGeneration"));
const imageRecognition_1 = __importDefault(require("./controllers/api/imageRecognition"));
const files_1 = __importDefault(require("./controllers/files"));
const authentication_1 = require("./middlewares/authentication");
const validWorkspace_1 = __importDefault(require("./middlewares/validWorkspace"));
const views_1 = require("./utils/views");
const route_1 = require("./utils/route");
const quota_1 = __importDefault(require("./middlewares/quota"));
const setupRoutes = (app) => {
    const upload = (0, multer_1.default)({ dest: 'uploads/' });
    // api
    app.use('/api', (0, cors_1.default)());
    app.use('/api', (0, express_1.json)());
    app.use('/api', authentication_1.tokenAuth);
    app.use('/api', quota_1.default);
    app.post('/api/chat/conversation', chat_1.default.startConversation);
    app.put('/api/chat/conversation/:conversationId', chat_1.default.continueConversation);
    app.get('/api/chat/conversation/:conversationId', chat_1.default.getResponse);
    app.post('/api/imagegeneration/generate', imageGeneration_1.default.generate);
    app.get('/api/imagegeneration/status/:jobId', imageGeneration_1.default.getJobStatus);
    app.get('/api/imagegeneration/result/:jobId', imageGeneration_1.default.getResult);
    app.post('/api/imagegeneration/upscale', imageGeneration_1.default.upscale);
    app.post('/api/imagegeneration/zoom/in', imageGeneration_1.default.zoomIn);
    app.post('/api/imagegeneration/zoom/out', imageGeneration_1.default.zoomOut);
    app.post('/api/imagerecognition/recognize', upload.single('image'), imageRecognition_1.default.recognize);
    // views
    app.use((0, route_1.unless)(['/api', '/files'], authentication_1.userAuth));
    app.get('/login', login_1.default.get);
    app.post('/login', login_1.default.post);
    app.get('/logout', logout_1.default.get);
    app.get('/workspaces', workspace_1.default.index);
    app.get('/workspaces/create', workspace_1.default.create);
    app.post('/workspaces/create', workspace_1.default.store);
    app.use('/workspaces/:workspaceId', validWorkspace_1.default);
    app.get('/workspaces/:workspaceId', workspace_1.default.show);
    app.get('/workspaces/:workspaceId/edit', workspace_1.default.edit);
    app.post('/workspaces/:workspaceId/edit', workspace_1.default.update);
    app.get('/workspaces/:workspaceId/tokens/create', apiTokens_1.default.create);
    app.post('/workspaces/:workspaceId/tokens/create', apiTokens_1.default.store);
    app.post('/workspaces/:workspaceId/tokens/:tokenId/revoke', apiTokens_1.default.destroy);
    app.get('/workspaces/:workspaceId/quota', billingQuotas_1.default.edit);
    app.post('/workspaces/:workspaceId/quota', billingQuotas_1.default.update);
    app.get('/workspaces/:workspaceId/bills/:year/:month', bills_1.default.show);
    app.get('/', (req, res) => res.redirect('/workspaces'));
    // files
    app.get('/files/*', files_1.default.file);
    // 404
    app.get('*', (req, res) => (0, views_1.notFound)(res));
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=routes.js.map