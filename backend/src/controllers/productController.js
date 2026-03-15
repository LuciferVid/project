import productService from '../services/productService.js';
import ApiResponse from '../utils/ApiResponse.js';

class ProductController {
  async listProducts(req, res, next) {
    try {
      const result = await productService.listProducts(req.query);
      res.status(200).json(new ApiResponse(200, result, 'Products retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      const product = await productService.getProduct(req.params.id);
      res.status(200).json(new ApiResponse(200, { product }, 'Product details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.status(200).json(new ApiResponse(200, { product }, 'Product details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.user.id, req.body);
      res.status(201).json(new ApiResponse(201, { product }, 'Product created'));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.user.id, req.body);
      res.status(200).json(new ApiResponse(200, { product }, 'Product updated'));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id, req.user.id);
      res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
    } catch (error) {
      next(error);
    }
  }

  async getVendorProducts(req, res, next) {
    try {
      const products = await productService.getVendorProducts(req.user.id);
      res.status(200).json(new ApiResponse(200, { products }, 'Vendor products retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new Error('No files uploaded');
      }
      const product = await productService.uploadImages(req.params.id, req.user.id, req.files);
      res.status(200).json(new ApiResponse(200, { product }, 'Images uploaded successfully'));
    } catch (error) {
      next(error);
    }
  }

  async removeImage(req, res, next) {
    try {
      const product = await productService.removeImage(req.params.id, req.user.id, req.params.imgIndex);
      res.status(200).json(new ApiResponse(200, { product }, 'Image removed successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
