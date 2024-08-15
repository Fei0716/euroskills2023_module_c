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
exports.CreateServiceUsagesTable1691092707370 = void 0;
class CreateServiceUsagesTable1691092707370 {
    constructor() {
        this.name = 'CreateServiceUsagesTable1691092707370';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`service_usages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`duration_in_ms\` int NOT NULL, \`api_token_id\` int NOT NULL, \`service_id\` int NOT NULL, \`usage_started_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`service_usages\` ADD CONSTRAINT \`FK_5ccd2747635edaf9f36f8bae5de\` FOREIGN KEY (\`api_token_id\`) REFERENCES \`api_tokens\`(\`id\`)`);
            yield queryRunner.query(`ALTER TABLE \`service_usages\` ADD CONSTRAINT \`FK_edbd8912f285c2a423d66020061\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`service_usages\` DROP FOREIGN KEY \`FK_edbd8912f285c2a423d66020061\``);
            yield queryRunner.query(`ALTER TABLE \`service_usages\` DROP FOREIGN KEY \`FK_5ccd2747635edaf9f36f8bae5de\``);
            yield queryRunner.query(`DROP TABLE \`service_usages\``);
        });
    }
}
exports.CreateServiceUsagesTable1691092707370 = CreateServiceUsagesTable1691092707370;
//# sourceMappingURL=1691092707370-create_service_usages_table.js.map