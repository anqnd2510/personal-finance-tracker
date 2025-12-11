import { ICategory, ICategoryRequest } from "../interfaces/category.interface";
export declare class CategoryRepository {
    createCategory(categoryData: ICategoryRequest): Promise<ICategory>;
    findCategoryById(id: string): Promise<ICategory | null>;
    findAllCategories(): Promise<ICategory[]>;
    updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<ICategory | null>;
}
//# sourceMappingURL=category.repository.d.ts.map