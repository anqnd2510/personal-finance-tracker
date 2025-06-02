import Category from "../models/category.model";
import { ICategory, ICategoryRequest } from "../interfaces/category.interface";

export class CategoryRepository {
  async createCategory(categoryData: ICategoryRequest): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  async findCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async findAllCategories(): Promise<ICategory[]> {
    return await Category.find();
  }

  async updateCategory(
    id: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }
}
