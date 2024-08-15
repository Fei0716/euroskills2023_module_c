"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingQuota = void 0;
const typeorm_1 = require("typeorm");
const Workspace_1 = require("./Workspace");
let BillingQuota = exports.BillingQuota = class BillingQuota extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BillingQuota.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], BillingQuota.prototype, "limit", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Workspace_1.Workspace, (workspace) => workspace.billingQuota),
    __metadata("design:type", Workspace_1.Workspace)
], BillingQuota.prototype, "workspace", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BillingQuota.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BillingQuota.prototype, "updatedAt", void 0);
exports.BillingQuota = BillingQuota = __decorate([
    (0, typeorm_1.Entity)()
], BillingQuota);
//# sourceMappingURL=BillingQuota.js.map