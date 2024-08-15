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
exports.Workspace = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const ApiToken_1 = require("./ApiToken");
const BillingQuota_1 = require("./BillingQuota");
let Workspace = exports.Workspace = class Workspace extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Workspace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Workspace.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Workspace.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.workspaces, { nullable: false }),
    __metadata("design:type", User_1.User)
], Workspace.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ApiToken_1.ApiToken, (apiToken) => apiToken.workspace),
    __metadata("design:type", Array)
], Workspace.prototype, "apiTokens", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => BillingQuota_1.BillingQuota, (billingQuota) => billingQuota.workspace),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", BillingQuota_1.BillingQuota)
], Workspace.prototype, "billingQuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Workspace.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Workspace.prototype, "updatedAt", void 0);
exports.Workspace = Workspace = __decorate([
    (0, typeorm_1.Entity)({ name: 'workspaces' })
], Workspace);
//# sourceMappingURL=Workspace.js.map