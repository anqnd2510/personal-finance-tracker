import { prisma } from "../config/database";
import { IRule, IRuleRequest, IRuleUpdateRequest } from "../interfaces/rule.interface";

export class RuleRepository {
  async createRule(ruleData: IRuleRequest): Promise<IRule> {
    return await prisma.rule.create({
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

  async findRulesByAccountId(accountId: string): Promise<IRule[]> {
    return await prisma.rule.findMany({
      where: { accountId },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });
  }

  async findRuleByIdAndAccountId(id: string, accountId: string): Promise<IRule | null> {
    return await prisma.rule.findFirst({
      where: { id, accountId },
    });
  }

  async updateRule(
    id: string,
    accountId: string,
    updateData: IRuleUpdateRequest
  ): Promise<IRule | null> {
    const existing = await this.findRuleByIdAndAccountId(id, accountId);
    if (!existing) {
      return null;
    }

    return await prisma.rule.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteRule(id: string, accountId: string): Promise<IRule | null> {
    const existing = await this.findRuleByIdAndAccountId(id, accountId);
    if (!existing) {
      return null;
    }

    return await prisma.rule.delete({
      where: { id },
    });
  }

  async findBestMatchingRule(
    accountId: string,
    description: string
  ): Promise<IRule | null> {
    const normalized = description.trim();
    if (!normalized) {
      return null;
    }

    const rules = await prisma.rule.findMany({
      where: {
        accountId,
        isActive: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });

    const lowerDescription = normalized.toLowerCase();

    return (
      rules.find((rule) =>
        lowerDescription.includes(rule.descriptionContains.toLowerCase())
      ) || null
    );
  }
}
