import Product from '../models/Product.js';

class ProductRepository {
  async create(data) {
    const product = new Product(data);
    return await product.save();
  }

  async findWithFilters(query, page = 1, limit = 10, sort = {}) {
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('vendor', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    
    const count = await Product.countDocuments(query);
    return { products, total: count, page, pages: Math.ceil(count / limit) };
  }

  async findById(id) {
    return await Product.findById(id)
      .populate('category', 'name slug')
      .populate('vendor', 'name avatar');
  }

  async findBySlug(slug) {
    return await Product.findOne({ slug })
      .populate('category', 'name slug')
      .populate('vendor', 'name avatar');
  }

  async findByVendor(vendorId) {
    return await Product.find({ vendor: vendorId }).populate('category', 'name');
  }

  async updateById(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async softDelete(id) {
    return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async addImage(id, imageUrl) {
    return await Product.findByIdAndUpdate(id, { $push: { images: imageUrl } }, { new: true });
  }
  
  async removeImage(id, imageUrl) {
    return await Product.findByIdAndUpdate(id, { $pull: { images: imageUrl } }, { new: true });
  }
}

export default new ProductRepository();
