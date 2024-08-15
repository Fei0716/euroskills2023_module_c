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
exports.CreateApiTokensTable1691091830668 = void 0;
class CreateApiTokensTable1691091830668 {
    constructor() {
        this.name = 'CreateApiTokensTable1691091830668';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`api_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`token\` varchar(100) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`revoked_at\` timestamp NULL, \`workspace_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`api_tokens\` ADD CONSTRAINT \`FK_9c644dd21cac1a0e8fca9443373\` FOREIGN KEY (\`workspace_id\`) REFERENCES \`workspaces\`(\`id\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`api_tokens\` DROP FOREIGN KEY \`FK_9c644dd21cac1a0e8fca9443373\``);
            yield queryRunner.query(`DROP TABLE \`api_tokens\``);
        });
    }
}
exports.CreateApiTokensTable1691091830668 = CreateApiTokensTable1691091830668;
//# sourceMappingURL=1691091830668-create_api_tokens_table.js.map