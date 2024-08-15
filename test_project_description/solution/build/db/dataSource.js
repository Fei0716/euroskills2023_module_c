"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Workspace_1 = require("../entities/Workspace");
const namingStrategy_1 = require("./namingStrategy");
const ApiToken_1 = require("../entities/ApiToken");
const BillingQuota_1 = require("../entities/BillingQuota");
const Service_1 = require("../entities/Service");
const ServiceUsage_1 = require("../entities/ServiceUsage");
const _1691091534692_create_users_table_1 = require("./migrations/1691091534692-create_users_table");
const _1691091567274_create_workspaces_table_1 = require("./migrations/1691091567274-create_workspaces_table");
const _1691091830668_create_api_tokens_table_1 = require("./migrations/1691091830668-create_api_tokens_table");
const _1691092241007_create_billing_quotas_table_1 = require("./migrations/1691092241007-create_billing_quotas_table");
const _1691092484427_create_services_table_1 = require("./migrations/1691092484427-create_services_table");
const _1691092707370_create_service_usages_table_1 = require("./migrations/1691092707370-create_service_usages_table");
const _1691315514778_insert_sample_data_1 = require("./migrations/1691315514778-insert_sample_data");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER || 'skill17',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'euroskills2023',
    namingStrategy: new namingStrategy_1.LaravelNamingStrategy(),
    logging: false,
    entities: [
        User_1.User,
        Workspace_1.Workspace,
        ApiToken_1.ApiToken,
        BillingQuota_1.BillingQuota,
        Service_1.Service,
        ServiceUsage_1.ServiceUsage,
    ],
    migrations: [
        _1691091534692_create_users_table_1.CreateUsersTable1691091534692,
        _1691091567274_create_workspaces_table_1.CreateWorkspacesTable1691091567274,
        _1691091830668_create_api_tokens_table_1.CreateApiTokensTable1691091830668,
        _1691092241007_create_billing_quotas_table_1.CreateBillingQuotasTable1691092241007,
        _1691092484427_create_services_table_1.CreateServicesTable1691092484427,
        _1691092707370_create_service_usages_table_1.CreateServiceUsagesTable1691092707370,
        _1691315514778_insert_sample_data_1.InsertSampleData1691315514778,
    ],
    subscribers: [],
});
//# sourceMappingURL=dataSource.js.map