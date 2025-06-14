import Budget from "../models/budget.model";
import { IBudget, IBudgetRequest } from "../interfaces/budget.interface";
import { Types } from "mongoose";

export class BudgetRepository {
  async createBudget(budgetData: IBudgetRequest): Promise<IBudget> {
    const budget = new Budget(budgetData);
    return await budget.save();
  }
  async findBudgetById(id: string): Promise<IBudget | null> {
    return await Budget.findById(id);
  }
  async findBudgetsByAccountId(
    accountId: string | Types.ObjectId
  ): Promise<IBudget[]> {
    return await Budget.find({ accountId });
  }
  async updateBudget(
    id: string,
    updateData: Partial<IBudget>
  ): Promise<IBudget | null> {
    return await Budget.findByIdAndUpdate(id, updateData, { new: true });
  }
  async deleteBudget(id: string): Promise<IBudget | null> {
    return await Budget.findByIdAndDelete(id);
  }
}
