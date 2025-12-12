import { budgetRule } from "./budget.rule";
import { spendingRule } from "./spending.rule";
import { healthRule } from "./health.rule";
import { incomeRule } from "./income.rule";
import { Rule, RuleResult } from "./types";

/**
 * Rule Engine - Central system for running financial rules
 * 
 * Available rules:
 * - Budget Rule: Monitors budget usage
 * - Spending Rule: Analyzes spending patterns
 * - Health Rule: Calculates financial health score
 * - Income Rule: Monitors income patterns
 */
export class RuleEngine {
  private static readonly rules: Rule[] = [
    budgetRule,
    incomeRule,
    spendingRule,
    healthRule // Run health rule last as it provides overall summary
  ];

  /**
   * Run all rules for a user
   * @param userId - The user ID to run rules for
   * @returns Array of rule results with alerts and insights
   */
  static async runAll(userId: string): Promise<RuleResult[]> {
    const results: RuleResult[] = [];

    for (const rule of this.rules) {
      try {
        console.log(`Running rule: ${rule.name}`);
        const ruleResults = await rule.run(userId);
        results.push(...ruleResults);
      } catch (error) {
        console.error(`Error running rule ${rule.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Run a specific rule by name
   * @param ruleName - Name of the rule to run
   * @param userId - The user ID
   * @returns Array of rule results
   */
  static async runRule(ruleName: string, userId: string): Promise<RuleResult[]> {
    const rule = this.rules.find(r => r.name.toLowerCase() === ruleName.toLowerCase());
    
    if (!rule) {
      throw new Error(`Rule "${ruleName}" not found`);
    }

    return await rule.run(userId);
  }

  /**
   * Get list of available rules
   * @returns Array of rule names and descriptions
   */
  static getRules(): { name: string; description: string }[] {
    return this.rules.map(rule => ({
      name: rule.name,
      description: rule.description
    }));
  }
}
