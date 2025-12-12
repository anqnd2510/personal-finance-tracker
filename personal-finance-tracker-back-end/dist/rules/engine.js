"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = void 0;
const budget_rule_1 = require("./budget.rule");
const spending_rule_1 = require("./spending.rule");
const health_rule_1 = require("./health.rule");
const income_rule_1 = require("./income.rule");
class RuleEngine {
    static async runAll(userId) {
        const results = [];
        for (const rule of this.rules) {
            try {
                console.log(`Running rule: ${rule.name}`);
                const ruleResults = await rule.run(userId);
                results.push(...ruleResults);
            }
            catch (error) {
                console.error(`Error running rule ${rule.name}:`, error);
            }
        }
        return results;
    }
    static async runRule(ruleName, userId) {
        const rule = this.rules.find(r => r.name.toLowerCase() === ruleName.toLowerCase());
        if (!rule) {
            throw new Error(`Rule "${ruleName}" not found`);
        }
        return await rule.run(userId);
    }
    static getRules() {
        return this.rules.map(rule => ({
            name: rule.name,
            description: rule.description
        }));
    }
}
exports.RuleEngine = RuleEngine;
RuleEngine.rules = [
    budget_rule_1.budgetRule,
    income_rule_1.incomeRule,
    spending_rule_1.spendingRule,
    health_rule_1.healthRule
];
//# sourceMappingURL=engine.js.map