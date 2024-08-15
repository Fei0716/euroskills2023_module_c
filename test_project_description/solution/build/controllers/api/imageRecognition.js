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
const form_data_1 = __importDefault(require("form-data"));
const fs = __importStar(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ServiceUsage_1 = require("../../entities/ServiceUsage");
const Service_1 = require("../../entities/Service");
const ApiToken_1 = require("../../entities/ApiToken");
const service_1 = require("../../utils/service");
const MINDREADER_BASE_URL = process.env.MINDREADER_BASE_URL || 'http://127.0.0.1:9003';
console.log('MINDREADER_BASE_URL', MINDREADER_BASE_URL);
function recognize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a FormData object and append the file from the multipart form
            const formData = new form_data_1.default();
            formData.append('image', fs.createReadStream(req.file.path));
            const start = new Date();
            // Forward the FormData to the external endpoint using node-fetch
            const response = yield (0, node_fetch_1.default)(`${MINDREADER_BASE_URL}/recognize`, {
                method: 'POST',
                body: formData,
                headers: Object.assign({}, formData.getHeaders()),
            });
            if (response.status !== 200) {
                console.log('req url', `${MINDREADER_BASE_URL}/generate`);
                console.log('response.status', response.status);
                console.log('response.body', `${JSON.stringify(response.body)}`);
                return (0, service_1.serviceUnavailable)(req, res);
            }
            const serviceUsage = new ServiceUsage_1.ServiceUsage();
            serviceUsage.durationInMs = new Date().getTime() - start.getTime();
            serviceUsage.service = yield Service_1.Service.findOneOrFail({ where: { name: "MindReader" } });
            serviceUsage.apiToken = yield ApiToken_1.ApiToken.findOneOrFail({ where: { token: req.header('X-API-TOKEN') } });
            serviceUsage.usageStartedAt = start;
            yield serviceUsage.save();
            // Parse the response from the external endpoint
            const parsedData = yield response.json();
            res.send({
                objects: parsedData.objects.map(obj => ({
                    name: obj.label,
                    probability: obj.probability,
                    bounding_box: {
                        x: obj.bounding_box.left,
                        y: obj.bounding_box.top,
                        width: obj.bounding_box.right - obj.bounding_box.left,
                        height: obj.bounding_box.bottom - obj.bounding_box.top,
                    }
                }))
            });
        }
        catch (error) {
            console.error('Error:', error);
            return (0, service_1.serviceUnavailable)(req, res);
        }
    });
}
exports.default = { recognize };
//# sourceMappingURL=imageRecognition.js.map