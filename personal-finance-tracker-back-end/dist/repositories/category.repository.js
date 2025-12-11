"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = require("../config/database");
class CategoryRepository {
    async createCategory(categoryData) {
        return await database_1.prisma.category.create({
            data: {
                name: categoryData.name,
                description: categoryData.description || "",
            },
        });
    }
    async findCategoryById(id) {
        return await database_1.prisma.category.findUnique({
            where: { id },
        });
    }
    async findAllCategories() {
        return await database_1.prisma.category.findMany();
    }
    async updateCategory(id, updateData) {
        return await database_1.prisma.category.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteCategory(id) {
        return await database_1.prisma.category.delete({
            where: { id },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map