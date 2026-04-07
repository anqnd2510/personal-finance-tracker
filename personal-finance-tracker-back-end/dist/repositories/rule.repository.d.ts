import { IRule, IRuleRequest, IRuleUpdateRequest } from "../interfaces/rule.interface";
export declare class RuleRepository {
    createRule(ruleData: IRuleRequest): Promise<IRule>;
    findRulesByAccountId(accountId: string): Promise<IRule[]>;
    findRuleByIdAndAccountId(id: string, accountId: string): Promise<IRule | null>;
    updateRule(id: string, accountId: string, updateData: IRuleUpdateRequest): Promise<IRule | null>;
    deleteRule(id: string, accountId: string): Promise<IRule | null>;
    findBestMatchingRule(accountId: string, description: string): Promise<IRule | null>;
}
//# sourceMappingURL=rule.repository.d.ts.map