import { ApiResponse } from "../utils/apiResponse";
import { CategoryRepository } from "../repositories/category.repository";
import { ICategoryRequest } from "interfaces/category.interface";
export declare class CategoryService {
    private categoryRepo;
    constructor(categoryRepo?: CategoryRepository);
    createCategory(categoryData: ICategoryRequest): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>>;
    getCategoryById(id: string): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>>;
    getAllCategories(): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }[]>>;
    updateCategory(id: string, updateData: Partial<ICategoryRequest>): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>>;
    deleteCategory(id: string): Promise<ApiResponse<null> | ApiResponse<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>>;
}
//# sourceMappingURL=category.service.d.ts.map