import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  balance: { type: Number, default: 0 },
  transactions: [walletTransactionSchema]
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
