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
exports.InsertSampleData1691315514778 = void 0;
const User_1 = require("../../entities/User");
const hashing_1 = require("../../utils/hashing");
const Service_1 = require("../../entities/Service");
const Workspace_1 = require("../../entities/Workspace");
const ApiToken_1 = require("../../entities/ApiToken");
const ServiceUsage_1 = require("../../entities/ServiceUsage");
const BillingQuota_1 = require("../../entities/BillingQuota");
class InsertSampleData1691315514778 {
    constructor() {
        this.name = 'InsertSampleData1691315514778';
    }
    generateServiceUsage(service, token, year, month, usage) {
        return __awaiter(this, void 0, void 0, function* () {
            let usageLeft = usage;
            let steps = Math.ceil(Math.random() * 50);
            let usageSteps = Math.ceil(usage / steps);
            let lastDate = new Date(`${year}-${month}-01`);
            let maxStepSize = (27 * 24 * 60 * 60 * 1000) / steps;
            while (usageLeft > 0) {
                let nextUsage = usageLeft > usageSteps ? (usageSteps - Math.floor(Math.random() * 5)) : usageLeft;
                usageLeft -= nextUsage;
                lastDate = new Date(lastDate.getTime() + Math.ceil(Math.random() * maxStepSize));
                const usage = new ServiceUsage_1.ServiceUsage();
                usage.service = service;
                usage.apiToken = token;
                usage.usageStartedAt = lastDate;
                usage.durationInMs = nextUsage;
                yield usage.save();
            }
        });
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const demo1 = new User_1.User();
            demo1.username = 'demo1';
            demo1.password = yield (0, hashing_1.hash)('skills2023d1');
            demo1.createdAt = new Date('2023-06-27 14:32:11');
            demo1.updatedAt = demo1.createdAt;
            yield demo1.save();
            const demo2 = new User_1.User();
            demo2.username = 'demo2';
            demo2.password = yield (0, hashing_1.hash)('skills2023d2');
            demo2.createdAt = new Date('2023-06-27 14:33:11');
            demo2.updatedAt = demo2.createdAt;
            yield demo2.save();
            const service1 = new Service_1.Service();
            service1.name = 'ChatterBlast';
            service1.costPerMs = 0.0015;
            service1.createdAt = new Date('2023-06-26 10:00:00');
            service1.updatedAt = service1.createdAt;
            yield service1.save();
            const service2 = new Service_1.Service();
            service2.name = 'DreamWeaver';
            service2.costPerMs = 0.005;
            service2.createdAt = new Date('2023-06-26 11:00:00');
            service2.updatedAt = service2.createdAt;
            yield service2.save();
            const service3 = new Service_1.Service();
            service3.name = 'MindReader';
            service3.costPerMs = 0.01;
            service3.createdAt = new Date('2023-06-26 12:00:00');
            service3.updatedAt = service3.createdAt;
            yield service3.save();
            const workspace1 = new Workspace_1.Workspace();
            workspace1.title = 'My App';
            workspace1.user = demo1;
            workspace1.createdAt = new Date('2023-06-28 12:55:05');
            workspace1.updatedAt = workspace1.createdAt;
            yield workspace1.save();
            const workspace2 = new Workspace_1.Workspace();
            workspace2.title = 'Default Workspace';
            workspace2.description = 'My personal workspace for smaller apps.';
            workspace2.user = demo2;
            workspace2.createdAt = new Date('2023-06-28 16:06:34');
            workspace2.updatedAt = workspace2.createdAt;
            yield workspace2.save();
            const workspace3 = new Workspace_1.Workspace();
            workspace3.title = 'Quota Exceeded Test';
            workspace3.user = demo1;
            workspace3.createdAt = new Date('2023-06-28 12:55:05');
            workspace3.updatedAt = workspace3.createdAt;
            yield workspace3.save();
            const devToken = new ApiToken_1.ApiToken();
            devToken.name = 'development';
            devToken.token = '13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6';
            devToken.workspace = workspace1;
            devToken.createdAt = new Date('2023-06-28 13:14:22');
            devToken.updatedAt = devToken.createdAt;
            yield devToken.save();
            const prodToken = new ApiToken_1.ApiToken();
            prodToken.name = 'production';
            prodToken.token = '8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91';
            prodToken.workspace = workspace1;
            prodToken.createdAt = new Date('2023-06-28 18:44:51');
            prodToken.updatedAt = prodToken.createdAt;
            yield prodToken.save();
            const testToken = new ApiToken_1.ApiToken();
            testToken.name = 'test';
            testToken.token = 'b8ef2feea8a2bf982d637b5ff4be4771d2ef46f3564c5ecd7b';
            testToken.workspace = workspace3;
            testToken.createdAt = new Date('2023-06-28 18:44:51');
            testToken.updatedAt = testToken.createdAt;
            yield testToken.save();
            const billingQuota = new BillingQuota_1.BillingQuota();
            billingQuota.limit = 9;
            billingQuota.workspace = workspace3;
            billingQuota.createdAt = new Date('2023-06-28 12:57:05');
            billingQuota.updatedAt = billingQuota.createdAt;
            yield billingQuota.save();
            yield this.generateServiceUsage(service1, prodToken, 2023, 7, 1502);
            yield this.generateServiceUsage(service2, prodToken, 2023, 7, 705);
            yield this.generateServiceUsage(service1, devToken, 2023, 7, 406);
            yield this.generateServiceUsage(service1, prodToken, 2023, 8, 1039);
            yield this.generateServiceUsage(service2, prodToken, 2023, 8, 501);
            yield this.generateServiceUsage(service1, devToken, 2023, 8, 162);
            yield this.generateServiceUsage(service1, prodToken, 2023, 9, 1500);
            yield this.generateServiceUsage(service2, prodToken, 2023, 9, 800);
            yield this.generateServiceUsage(service1, devToken, 2023, 9, 500);
            yield this.generateServiceUsage(service1, testToken, 2023, 9, 1800);
            yield this.generateServiceUsage(service2, testToken, 2023, 9, 900);
            yield this.generateServiceUsage(service3, testToken, 2023, 9, 200);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('TRUNCATE TABLE api_tokens');
            yield queryRunner.query('TRUNCATE TABLE billing_quotas');
            yield queryRunner.query('TRUNCATE TABLE service_usages');
            yield queryRunner.query('TRUNCATE TABLE services');
            yield queryRunner.query('TRUNCATE TABLE workspaces');
            yield queryRunner.query('TRUNCATE TABLE users');
        });
    }
}
exports.InsertSampleData1691315514778 = InsertSampleData1691315514778;
//# sourceMappingURL=1691315514778-insert_sample_data.js.map