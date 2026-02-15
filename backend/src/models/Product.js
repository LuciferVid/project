import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  images: [{ type: String }], // Cloudinary URLs
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  tags: [{ type: String }],
  specifications: { type: Map, of: String },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    const baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
