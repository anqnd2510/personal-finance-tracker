"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.getCategoryById = exports.createCategory = void 0;
const category_service_1 = require("../services/category.service");
const service = new category_service_1.CategoryService();
const createCategory = async (req, res, next) => {
    try {
        const categoryData = req.body;
        const response = await service.createCategory(categoryData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.createCategory = createCategory;
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.getCategoryById(id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getCategoryById = getCategoryById;
const getAllCategories = async (req, res, next) => {
    try {
        const response = await service.getAllCategories();
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllCategories = getAllCategories;
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const response = await service.updateCategory(id, updateData);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.deleteCategory(id);
        res.status(response.statusCode).json(response);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map