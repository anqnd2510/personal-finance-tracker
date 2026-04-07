"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRepository = void 0;
const database_1 = require("../config/database");
class RuleRepository {
    async createRule(ruleData) {
        return await database_1.prisma.rule.create({
            data: {
                accountId: ruleData.accountId,
                name: ruleData.name,
                descriptionContains: ruleData.descriptionContains,
                categoryId: ruleData.categoryId,
                priority: ruleData.priority ?? 100,
                isActive: ruleData.isActive ?? true,
            },
        });
    }
    async findRulesByAccountId(accountId) {
        return await database_1.prisma.rule.findMany({
            where: { accountId },
            orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        });
    }
    async findRuleByIdAndAccountId(id, accountId) {
        return await database_1.prisma.rule.findFirst({
            where: { id, accountId },
        });
    }
    async updateRule(id, accountId, updateData) {
        const existing = await this.findRuleByIdAndAccountId(id, accountId);
        if (!existing) {
            return null;
        }
        return await database_1.prisma.rule.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteRule(id, accountId) {
        const existing = await this.findRuleByIdAndAccountId(id, accountId);
        if (!existing) {
            return null;
        }
        return await database_1.prisma.rule.delete({
            where: { id },
        });
    }
    async findBestMatchingRule(accountId, description) {
        const normalized = description.trim();
        if (!normalized) {
            return null;
        }
        const rules = await database_1.prisma.rule.findMany({
            where: {
                accountId,
                isActive: true,
            },
            orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        });
        const lowerDescription = normalized.toLowerCase();
        return (rules.find((rule) => lowerDescription.includes(rule.descriptionContains.toLowerCase())) || null);
    }
}
exports.RuleRepository = RuleRepository;
//# sourceMappingURL=rule.repository.js.map