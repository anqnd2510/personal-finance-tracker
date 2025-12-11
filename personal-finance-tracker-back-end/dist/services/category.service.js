"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const apiResponse_1 = require("../utils/apiResponse");
const category_repository_1 = require("../repositories/category.repository");
class CategoryService {
    constructor(categoryRepo = new category_repository_1.CategoryRepository()) {
        this.categoryRepo = categoryRepo;
    }
    async createCategory(categoryData) {
        try {
            const category = await this.categoryRepo.createCategory(categoryData);
            if (!category) {
                return apiResponse_1.ApiResponse.error("Failed to create category", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return apiResponse_1.ApiResponse.success(category, "Category created", httpStatus_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            console.error("Error in createCategory method:", error);
            return apiResponse_1.ApiResponse.error("Failed to create category", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getCategoryById(id) {
        try {
            const category = await this.categoryRepo.findCategoryById(id);
            if (!category) {
                return apiResponse_1.ApiResponse.error("Category not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(category, "Category retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getCategoryById method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve category", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCategories() {
        try {
            const categories = await this.categoryRepo.findAllCategories();
            return apiResponse_1.ApiResponse.success(categories, "Categories retrieved successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in getAllCategories method:", error);
            return apiResponse_1.ApiResponse.error("Failed to retrieve categories", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(id, updateData) {
        try {
            const updatedCategory = await this.categoryRepo.updateCategory(id, updateData);
            if (!updatedCategory) {
                return apiResponse_1.ApiResponse.error("Category not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(updatedCategory, "Category updated successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in updateCategory method:", error);
            return apiResponse_1.ApiResponse.error("Failed to update category", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCategory(id) {
        try {
            const deletedCategory = await this.categoryRepo.deleteCategory(id);
            if (!deletedCategory) {
                return apiResponse_1.ApiResponse.error("Category not found", httpStatus_1.HTTP_STATUS.NOT_FOUND);
            }
            return apiResponse_1.ApiResponse.success(deletedCategory, "Category deleted successfully", httpStatus_1.HTTP_STATUS.OK);
        }
        catch (error) {
            console.error("Error in deleteCategory method:", error);
            return apiResponse_1.ApiResponse.error("Failed to delete category", httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map