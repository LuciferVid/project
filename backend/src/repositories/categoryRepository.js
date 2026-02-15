import Category from '../models/Category.js';

class CategoryRepository {
  async create(data) {
    const category = new Category(data);
    return await category.save();
  }

  async findAllActive() {
    return await Category.find({ isActive: true }).populate('parentCategory');
  }

  async findById(id) {
    return await Category.findById(id).populate('parentCategory');
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug }).populate('parentCategory');
  }

  async updateById(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async softDelete(id) {
    return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

export default new CategoryRepository();
