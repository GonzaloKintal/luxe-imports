import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  title: { type: String },
  price: { type: Number },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [cartProductSchema],
  status: { type: String, default: 'abierto' }, // 'abierto', 'pendiente de confirmacion', 'confirmado'
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
