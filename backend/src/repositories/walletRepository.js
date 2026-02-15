import Wallet from '../models/Wallet.js';

class WalletRepository {
  async findByCustomer(customerId) {
    let wallet = await Wallet.findOne({ customer: customerId });
    if (!wallet) {
      wallet = await this.create(customerId);
    }
    return wallet;
  }

  async create(customerId) {
    const wallet = new Wallet({ customer: customerId });
    return await wallet.save();
  }

  async addTransaction(customerId, type, amount, description) {
    const balanceChange = type === 'credit' ? amount : -amount;
    return await Wallet.findOneAndUpdate(
      { customer: customerId },
      { 
        $inc: { balance: balanceChange },
        $push: { transactions: { type, amount, description } }
      },
      { new: true, upsert: true }
    );
  }
}

export default new WalletRepository();
