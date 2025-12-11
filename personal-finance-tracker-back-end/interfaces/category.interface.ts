import { Category } from "@prisma/client";

// Use Prisma's generated Category type
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
