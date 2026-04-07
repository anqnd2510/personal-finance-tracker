import { ApiResponse } from "../utils/apiResponse";
import { RuleRepository } from "../repositories/rule.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { IRuleRequest, IRuleUpdateRequest } from "../interfaces/rule.interface";
export declare class RuleService {
    private ruleRepo;
    private categoryRepo;
    constructor(ruleRepo?: RuleRepository, categoryRepo?: CategoryRepository);
    createRule(ruleData: IRuleRequest): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        categoryId: string;
        descriptionContains: string;
        priority: number;
    }>>;
    getRulesByAccountId(accountId: string): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        categoryId: string;
        descriptionContains: string;
        priority: number;
    }[]>>;
    updateRule(accountId: string, id: string, updateData: IRuleUpdateRequest): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        categoryId: string;
        descriptionContains: string;
        priority: number;
    }>>;
    deleteRule(accountId: string, id: string): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        categoryId: string;
        descriptionContains: string;
        priority: number;
    }>>;
    resolveCategoryFromRules(accountId: string, description?: string): Promise<string | null>;
}
//# sourceMappingURL=rule.service.d.ts.map