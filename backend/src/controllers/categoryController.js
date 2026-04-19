import categoryService from '../services/categoryService.js';
import ApiResponse from '../utils/ApiResponse.js';

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const categoriesTree = await categoryService.getAllCategories();
      res.status(200).json(new ApiResponse(200, { categories: categoriesTree }, 'Categories retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, { category }, 'Category updated'));
    } catch (error) {
      next(error);
    }
  }

  async deactivateCategory(req, res, next) {
    try {
      await categoryService.deactivateCategory(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Category deactivated'));
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
