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
exports.CreateWorkspacesTable1691091567274 = void 0;
class CreateWorkspacesTable1691091567274 {
    constructor() {
        this.name = 'CreateWorkspacesTable1691091567274';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_78512d762073bf8cb3fc88714c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_78512d762073bf8cb3fc88714c1\``);
            yield queryRunner.query(`DROP TABLE \`workspaces\``);
        });
    }
}
exports.CreateWorkspacesTable1691091567274 = CreateWorkspacesTable1691091567274;
//# sourceMappingURL=1691091567274-create_workspaces_table.js.map