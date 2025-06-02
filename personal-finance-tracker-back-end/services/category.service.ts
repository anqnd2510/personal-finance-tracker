import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../utils/apiResponse";
import { CategoryRepository } from "../repositories/category.repository";
import { ICategoryRequest } from "interfaces/category.interface";

export class CategoryService {
  constructor(private categoryRepo = new CategoryRepository()) {}
  /**
   * Creates a new category.
   * @param {ICategoryRequest} categoryData - The data for the category.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   * @throws {Error} - Throws an error if the category creation fails.
   */
  async createCategory(categoryData: ICategoryRequest) {
    try {
      const category = await this.categoryRepo.createCategory(categoryData);
      if (!category) {
        return ApiResponse.error(
          "Failed to create category",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
      return ApiResponse.success(
        category,
        "Category created",
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      console.error("Error in createCategory method:", error);
      return ApiResponse.error(
        "Failed to create category",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Retrieves a category by its ID.
   * @param {string} id - The ID of the category.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async getCategoryById(id: string) {
    try {
      const category = await this.categoryRepo.findCategoryById(id);
      if (!category) {
        return ApiResponse.error("Category not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        category,
        "Category retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getCategoryById method:", error);
      return ApiResponse.error(
        "Failed to retrieve category",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Retrieves all categories.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async getAllCategories() {
    try {
      const categories = await this.categoryRepo.findAllCategories();
      return ApiResponse.success(
        categories,
        "Categories retrieved successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in getAllCategories method:", error);
      return ApiResponse.error(
        "Failed to retrieve categories",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Updates a category by its ID.
   * @param {string} id - The ID of the category.
   * @param {Partial<ICategoryRequest>} updateData - The data to update the category with.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async updateCategory(id: string, updateData: Partial<ICategoryRequest>) {
    try {
      const updatedCategory = await this.categoryRepo.updateCategory(
        id,
        updateData
      );
      if (!updatedCategory) {
        return ApiResponse.error("Category not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        updatedCategory,
        "Category updated successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in updateCategory method:", error);
      return ApiResponse.error(
        "Failed to update category",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
  /**
   * Deletes a category by its ID.
   * @param {string} id - The ID of the category.
   * @returns {Promise<ApiResponse>} - A promise that resolves to an ApiResponse object.
   */
  async deleteCategory(id: string) {
    try {
      const deletedCategory = await this.categoryRepo.deleteCategory(id);
      if (!deletedCategory) {
        return ApiResponse.error("Category not found", HTTP_STATUS.NOT_FOUND);
      }
      return ApiResponse.success(
        deletedCategory,
        "Category deleted successfully",
        HTTP_STATUS.OK
      );
    } catch (error) {
      console.error("Error in deleteCategory method:", error);
      return ApiResponse.error(
        "Failed to delete category",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
