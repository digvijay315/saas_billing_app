const mongoose = require('mongoose');

const subscriptionInvoiceSchema = new mongoose.Schema({
  txnid: {
    type: String,
    required: true,
    unique: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  customerEmail: {
    type: String
  },
  customerName: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionInvoice', subscriptionInvoiceSchema);
