import categoryRepository from '../repositories/categoryRepository.js';
import ApiError from '../utils/ApiError.js';

class CategoryService {
  async createCategory(data) {
    const existing = await categoryRepository.findBySlug(
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    );
    if (existing) {
      throw new ApiError(400, 'Category with this name already exists');
    }
    return await categoryRepository.create(data);
  }

  async getAllCategories() {
    const categories = await categoryRepository.findAllActive();
    
    // Build tree structure
    const categoryMap = {};
    const roots = [];

    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = { ...cat.toObject(), subcategories: [] };
    });

    categories.forEach(cat => {
      const node = categoryMap[cat._id.toString()];
      if (cat.parentCategory) {
        const parentId = cat.parentCategory._id.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].subcategories.push(node);
        } else {
          roots.push(node); // Fallback if parent is somehow dead
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.updateById(id, data);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  async deactivateCategory(id) {
    const category = await categoryRepository.softDelete(id);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }
}

export default new CategoryService();
