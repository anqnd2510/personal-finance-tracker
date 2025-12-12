import { RuleResult } from "./types";
export declare class RuleEngine {
    private static readonly rules;
    static runAll(userId: string): Promise<RuleResult[]>;
    static runRule(ruleName: string, userId: string): Promise<RuleResult[]>;
    static getRules(): {
        name: string;
        description: string;
    }[];
}
//# sourceMappingURL=engine.d.ts.map