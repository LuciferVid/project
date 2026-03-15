import productRepository from '../repositories/productRepository.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

class ProductService {
  async createProduct(vendorId, data) {
    return await productRepository.create({ ...data, vendor: vendorId });
  }

  async listProducts(queryOptions) {
    const { category, minPrice, maxPrice, rating, vendor, search, page, limit, sortColumn, sortOrder } = queryOptions;
    
    const query = { isActive: true };

    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (rating) query.averageRating = { $gte: Number(rating) };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sort = {};
    if (sortColumn) {
      sort[sortColumn] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default
    }

    return await productRepository.findWithFilters(query, Number(page) || 1, Number(limit) || 10, sort);
  }

  async getProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
  }

  async getVendorProducts(vendorId) {
    return await productRepository.findByVendor(vendorId);
  }

  async updateProduct(id, vendorId, data) {
    const product = await this.getProduct(id);
    if (product.vendor._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Not authorized to update this product');
    }
    return await productRepository.updateById(id, data);
  }

  async deleteProduct(id, vendorId) {
    const product = await this.getProduct(id);
    if (product.vendor._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Not authorized to delete this product');
    }
    return await productRepository.softDelete(id);
  }

  async uploadImages(id, vendorId, files) {
    const product = await this.getProduct(id);
    if (product.vendor._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Not authorized to modify this product');
    }
    
    const imageUrls = files.map(file => file.path);
    let updatedProduct;
    for (const url of imageUrls) {
      updatedProduct = await productRepository.addImage(id, url);
    }
    return updatedProduct || product;
  }

  async removeImage(id, vendorId, index) {
    const product = await this.getProduct(id);
    if (product.vendor._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Not authorized to modify this product');
    }

    const imageUrl = product.images[index];
    if (!imageUrl) throw new ApiError(400, 'Image not found at that index');

    // Extract public_id from Cloudinary URL (assuming standard format)
    const urlParts = imageUrl.split('/');
    const publicIdWithExtract = urlParts[urlParts.length - 1]; // e.g. "image_id.jpg"
    const publicId = `ecommerce_products/${publicIdWithExtract.split('.')[0]}`; // Reconstruct path
    
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch(err) {
      console.log('Failed to delete image from Cloudinary', err);
    }

    return await productRepository.removeImage(id, imageUrl);
  }
}

export default new ProductService();
