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
exports.getApiTokenUsagePerService = exports.isQuotaExceeded = exports.isValidToken = exports.getApiToken = void 0;
const date_fns_1 = require("date-fns");
const ApiToken_1 = require("../entities/ApiToken");
const ServiceUsage_1 = require("../entities/ServiceUsage");
const bills_1 = require("./bills");
const getApiToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return ApiToken_1.ApiToken.findOne({
        where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
        relations: ['workspace'],
    });
});
exports.getApiToken = getApiToken;
const isValidToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return !!(yield ApiToken_1.ApiToken.findOne({
        where: { token },
    }));
});
exports.isValidToken = isValidToken;
const isQuotaExceeded = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const apiToken = yield ApiToken_1.ApiToken.findOne({
        where: { token },
        relations: ['workspace', 'workspace.apiTokens', 'workspace.billingQuota'],
    });
    if (!apiToken.workspace.billingQuota) {
        return false;
    }
    const date = new Date();
    const bill = yield (0, bills_1.getBill)(apiToken.workspace, date.getFullYear(), date.getMonth() + 1);
    return bill.total > apiToken.workspace.billingQuota.limit;
});
exports.isQuotaExceeded = isQuotaExceeded;
const getApiTokenUsagePerService = (apiToken, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const from = new Date(`${year}-${month}-01`);
    const to = (0, date_fns_1.addMonths)(from, 1);
    return (yield ServiceUsage_1.ServiceUsage.getRepository()
        .query('SELECT service_id, SUM(duration_in_ms) AS duration FROM `service_usages` WHERE api_token_id = ? AND usage_started_at >= ? AND usage_started_at < ? GROUP BY service_id', [
        apiToken.id,
        (0, date_fns_1.format)(from, 'yyyy-MM-dd'),
        (0, date_fns_1.format)(to, 'yyyy-MM-dd')
    ])).map(({ service_id, duration }) => ({
        serviceId: service_id,
        durationInMs: parseInt(duration),
    }));
});
exports.getApiTokenUsagePerService = getApiTokenUsagePerService;
//# sourceMappingURL=apiTokens.js.map