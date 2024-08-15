"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crypto = __importStar(require("crypto"));
const ServiceUsage_1 = require("../../entities/ServiceUsage");
const Service_1 = require("../../entities/Service");
const ApiToken_1 = require("../../entities/ApiToken");
const service_1 = require("../../utils/service");
const CHATTERBLAST_BASE_URL = process.env.CHATTERBLAST_BASE_URL || 'http://127.0.0.1:9001';
console.log('CHATTERBLAST_BASE_URL', CHATTERBLAST_BASE_URL);
const conversations = {};
function parseResponse(textResponse) {
    const responseParts = textResponse.split('<EOF>');
    if (responseParts.length > 1) {
        const words = textResponse.split(' ');
        const durationInMs = parseInt(words[words.length - 1].replace('ms', ''));
        return {
            isFinal: true,
            durationInMs,
            text: responseParts[0],
        };
    }
    return {
        isFinal: false,
        durationInMs: 0,
        text: textResponse
    };
}
function readResponse(token, conversationId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`);
        const textResponse = yield response.text();
        const { isFinal, text, durationInMs } = parseResponse(textResponse);
        if (isFinal) {
            conversations[conversationId].promptsResponseCount = conversations[conversationId].promptCount;
            // save usage, but only once
            if (((_a = conversations[conversationId]) === null || _a === void 0 ? void 0 : _a.promptCount) > ((_b = conversations[conversationId]) === null || _b === void 0 ? void 0 : _b.savedUsageCount)) {
                const serviceUsage = new ServiceUsage_1.ServiceUsage();
                serviceUsage.durationInMs = durationInMs;
                serviceUsage.service = yield Service_1.Service.findOneOrFail({ where: { name: "ChatterBlast" } });
                serviceUsage.apiToken = yield ApiToken_1.ApiToken.findOneOrFail({ where: { token } });
                serviceUsage.usageStartedAt = conversations[conversationId].lastPromptTimestamp;
                yield serviceUsage.save();
                conversations[conversationId].savedUsageCount = conversations[conversationId].promptCount;
            }
        }
        return {
            conversation_id: conversationId,
            response: text,
            is_final: isFinal
        };
    });
}
function startConversation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.prompt) {
                res.status(400).json({
                    "type": "/problem/types/400",
                    "title": "Bad Request",
                    "status": 400,
                    "detail": "Invalid request body",
                });
                return;
            }
            const conversationId = crypto.randomUUID();
            const creationResponse = yield (0, node_fetch_1.default)(`${CHATTERBLAST_BASE_URL}/conversation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId: `${conversationId}`
                })
            });
            if (creationResponse.status !== 201) {
                return (0, service_1.serviceUnavailable)(req, res);
            }
            conversations[conversationId] = {
                lastPromptTimestamp: new Date(),
                promptCount: 1,
                promptsResponseCount: 0,
                savedUsageCount: 0,
            };
            const postPromptResponse = yield (0, node_fetch_1.default)(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`, {
                method: 'POST',
                body: req.body.prompt || ''
            });
            if (postPromptResponse.status !== 200) {
                return (0, service_1.serviceUnavailable)(req, res);
            }
            res.json(yield readResponse(req.header('X-API-TOKEN'), conversationId));
        }
        catch (error) {
            console.error('Error:', error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
function continueConversation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversationId = req.params.conversationId;
        if (!conversations[conversationId]) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "The conversation does not exist.",
            });
            return;
        }
        if (conversations[conversationId].promptsResponseCount < conversations[conversationId].promptCount) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "The conversation is not ready for a new prompt.",
            });
            return;
        }
        conversations[conversationId].lastPromptTimestamp = new Date();
        conversations[conversationId].promptCount++;
        const postPromptResponse = yield (0, node_fetch_1.default)(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`, {
            method: 'POST',
            body: req.body.prompt || ''
        });
        if (postPromptResponse.status !== 200) {
            return (0, service_1.serviceUnavailable)(req, res);
        }
        res.json(yield readResponse(req.header('X-API-TOKEN'), conversationId));
    });
}
function getResponse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conversationId = req.params.conversationId;
        if (!conversations[conversationId]) {
            res.status(404).json({
                "type": "/problem/types/404",
                "title": "Not Found",
                "status": 404,
                "detail": "The conversation does not exist.",
            });
            return;
        }
        res.json(yield readResponse(req.header('X-API-TOKEN'), req.params.conversationId));
    });
}
exports.default = {
    startConversation,
    continueConversation,
    getResponse,
};
//# sourceMappingURL=chat.js.map