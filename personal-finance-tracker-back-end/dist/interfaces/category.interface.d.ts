import { Category } from "@prisma/client";
export type ICategory = Category;
export interface ICategoryRequest {
    name: string;
    description?: string;
}
export interface ICategoryResponse {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=category.interface.d.ts.map