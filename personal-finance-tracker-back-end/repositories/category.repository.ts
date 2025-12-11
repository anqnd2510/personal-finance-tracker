import { prisma } from "../config/database";
import { ICategory, ICategoryRequest } from "../interfaces/category.interface";

export class CategoryRepository {
  async createCategory(categoryData: ICategoryRequest): Promise<ICategory> {
    return await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description || "",
      },
    });
  }

  async findCategoryById(id: string): Promise<ICategory | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  async findAllCategories(): Promise<ICategory[]> {
    return await prisma.category.findMany();
  }

  async updateCategory(
    id: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
