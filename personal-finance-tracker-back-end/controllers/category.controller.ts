import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";

const service = new CategoryService();

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryData = req.body;
    const response = await service.createCategory(categoryData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await service.getCategoryById(id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await service.getAllCategories();
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const response = await service.updateCategory(id, updateData);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await service.deleteCategory(id);
    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};
