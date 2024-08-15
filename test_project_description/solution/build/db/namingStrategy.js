"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaravelNamingStrategy = void 0;
const typeorm_1 = require("typeorm");
const pluralize_1 = __importDefault(require("pluralize"));
const snake_case_1 = require("snake-case");
class LaravelNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(targetName, userSpecifiedName) {
        return userSpecifiedName || (0, snake_case_1.snakeCase)((0, pluralize_1.default)(targetName));
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return customName || (0, snake_case_1.snakeCase)(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return `${(0, snake_case_1.snakeCase)(relationName)}_${referencedColumnName}`;
    }
}
exports.LaravelNamingStrategy = LaravelNamingStrategy;
//# sourceMappingURL=namingStrategy.js.map