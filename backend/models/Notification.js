const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['REGISTRATION', 'PAYMENT', 'SYSTEM'],
    default: 'SYSTEM'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
