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
const node_fetch_1 = __importDefault(require("node-fetch"));
const download_1 = __importDefault(require("../../services/download"));
const service_1 = require("../../utils/service");
const ServiceUsage_1 = require("../../entities/ServiceUsage");
const Service_1 = require("../../entities/Service");
const ApiToken_1 = require("../../entities/ApiToken");
const DREAMWEAVER_BASE_URL = process.env.DREAMWEAVER_BASE_URL || 'http://127.0.0.1:9002';
console.log('DREAMWEAVER_BASE_URL', DREAMWEAVER_BASE_URL);
const jobs = {};
function generate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.text_prompt) {
                res.status(400).json({
                    "type": "/problem/types/400",
                    "title": "Bad Request",
                    "status": 400,
                    "detail": "Invalid request body",
                });
                return;
            }
            const response = yield (0, node_fetch_1.default)(`${DREAMWEAVER_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text_prompt: req.body.text_prompt,
                }),
            });
            if (response.status !== 201) {
                console.log('req url', `${DREAMWEAVER_BASE_URL}/generate`);
                console.log('response.status', response.status);
                console.log('response.body', `${JSON.stringify(response.body)}`);
                return (0, service_1.serviceUnavailable)(req, res);
            }
            const responseJson = yield response.json();
            jobs[responseJson.job_id] = { start: new Date(), savedUsage: false };
            res.json({
                job_id: responseJson.job_id,
            });
        }
        catch (error) {
            console.error('Error:', error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
function getJobStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobId = req.params.jobId;
        if (!jobId) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "Missing jobId parameter",
            });
            return;
        }
        try {
            const response = yield (0, node_fetch_1.default)(`${DREAMWEAVER_BASE_URL}/status/${jobId}`);
            if (response.status === 400) {
                res.status(404).json({
                    "type": "/problem/types/404",
                    "title": "Bad Request",
                    "status": 404,
                    "detail": "The requested job was not found."
                });
                return;
            }
            const responseJson = yield response.json();
            const filepath = yield (0, download_1.default)(responseJson.image_url);
            const imageUrl = `${req.protocol}://${req.get('host')}/files/${filepath}`;
            res.json({
                "status": responseJson.status,
                "progress": responseJson.progress,
                "image_url": imageUrl,
            });
        }
        catch (error) {
            console.error(error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
function getResult(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobId = req.params.jobId;
        if (!jobId) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "Missing jobId parameter",
            });
            return;
        }
        if (!jobs[jobId]) {
            res.status(404).json({
                "type": "/problem/types/404",
                "title": "Bad Request",
                "status": 404,
                "detail": "The requested job was not found."
            });
            return;
        }
        try {
            const response = yield (0, node_fetch_1.default)(`${DREAMWEAVER_BASE_URL}/result/${jobId}`);
            if (response.status === 400) {
                res.status(404).json({
                    "type": "/problem/types/404",
                    "title": "Bad Request",
                    "status": 404,
                    "detail": "The requested job was not found or is not finished."
                });
                return;
            }
            const responseJson = yield response.json();
            if (!jobs[jobId].savedUsage) {
                const durationInMs = (new Date(responseJson.finished_at)).getTime() - jobs[jobId].start.getTime();
                const serviceUsage = new ServiceUsage_1.ServiceUsage();
                serviceUsage.durationInMs = durationInMs;
                serviceUsage.service = yield Service_1.Service.findOneOrFail({ where: { name: "DreamWeaver" } });
                serviceUsage.apiToken = yield ApiToken_1.ApiToken.findOneOrFail({ where: { token: req.header('X-API-TOKEN') } });
                serviceUsage.usageStartedAt = jobs[jobId].start;
                yield serviceUsage.save();
                jobs[jobId].savedUsage = true;
            }
            const filepath = yield (0, download_1.default)(responseJson.image_url);
            const imageUrl = `${req.protocol}://${req.get('host')}/files/${filepath}`;
            res.json({
                "resource_id": responseJson.resource_id,
                "image_url": imageUrl,
            });
        }
        catch (error) {
            console.error(error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
function triggerResourceAction(req, res, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${DREAMWEAVER_BASE_URL}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resource_id: req.body.resource_id,
                }),
            });
            if (response.status === 400) {
                res.status(404).json({
                    "type": "/problem/types/404",
                    "title": "Not Found",
                    "status": 404,
                    "detail": "The requested resource was not found."
                });
                return;
            }
            if (response.status === 500) {
                return (0, service_1.serviceUnavailable)(req, res);
            }
            const json = yield response.json();
            jobs[json.job_id] = { start: new Date(), savedUsage: false };
            res.json(json);
        }
        catch (error) {
            console.error(error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
function upscale(req, res) {
    triggerResourceAction(req, res, 'upscale');
}
function zoomIn(req, res) {
    triggerResourceAction(req, res, 'zoom/in');
}
function zoomOut(req, res) {
    triggerResourceAction(req, res, 'zoom/out');
}
exports.default = {
    generate,
    getJobStatus,
    getResult,
    upscale,
    zoomIn,
    zoomOut,
};
//# sourceMappingURL=imageGeneration.js.map