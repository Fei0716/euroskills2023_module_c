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
exports.CreateBillingQuotasTable1691092241007 = void 0;
class CreateBillingQuotasTable1691092241007 {
    constructor() {
        this.name = 'CreateBillingQuotasTable1691092241007';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`billing_quotas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`limit\` decimal(10,2) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` ADD \`billing_quota_id\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` ADD UNIQUE INDEX \`IDX_bc02d89a5cbb742925cda902c5\` (\`billing_quota_id\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`REL_bc02d89a5cbb742925cda902c5\` ON \`workspaces\` (\`billing_quota_id\`)`);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_bc02d89a5cbb742925cda902c5b\` FOREIGN KEY (\`billing_quota_id\`) REFERENCES \`billing_quotas\`(\`id\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_bc02d89a5cbb742925cda902c5b\``);
            yield queryRunner.query(`DROP INDEX \`REL_bc02d89a5cbb742925cda902c5\` ON \`workspaces\``);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` DROP INDEX \`IDX_bc02d89a5cbb742925cda902c5\``);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` DROP COLUMN \`billing_quota_id\``);
            yield queryRunner.query(`DROP TABLE \`billing_quotas\``);
        });
    }
}
exports.CreateBillingQuotasTable1691092241007 = CreateBillingQuotasTable1691092241007;
//# sourceMappingURL=1691092241007-create_billing_quotas_table.js.map