import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  stockCritico: { type: Number, default: 0 },
  thumbnails: [{ type: String }],
  status: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  displayOrder: { 
    type: Number, 
    default: 1,
    min: [1, 'Display order must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Display order must be an integer'
    }
  },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
