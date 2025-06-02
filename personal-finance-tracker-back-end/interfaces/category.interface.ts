import { Document } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICategoryRequest {
  name: string;
  description?: string;
  status?: string;
}
export interface ICategoryResponse {
  name: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
