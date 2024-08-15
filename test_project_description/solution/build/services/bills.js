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
exports.getBill = void 0;
const apiTokens_1 = require("./apiTokens");
const services_1 = require("./services");
const getBill = (workspace, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const apiTokens = yield Promise.all(workspace.apiTokens.map((token) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            token,
            usages: yield (0, apiTokens_1.getApiTokenUsagePerService)(token, year, month),
        });
    })));
    const services = (yield (0, services_1.getAllServices)()).reduce((all, service) => (Object.assign(Object.assign({}, all), { [service.id]: service })), {});
    const total = apiTokens.reduce((totalCost, token) => totalCost + token.usages.reduce((totalToken, usage) => totalToken + usage.durationInMs * services[usage.serviceId].costPerMs, 0), 0);
    return {
        apiTokens,
        services,
        total,
    };
});
exports.getBill = getBill;
//# sourceMappingURL=bills.js.map