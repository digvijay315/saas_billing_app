const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    logo: {
      type: String,
      default: "",
    },
    gstNo: {
      type: String,
      default: "",
    },
    cinNo: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    staffPermissions: {
      restaurant: { type: Boolean, default: true },
      roomBooking: { type: Boolean, default: true },
      kot: { type: Boolean, default: true },
      advanceBooking: { type: Boolean, default: true },
      grc: { type: Boolean, default: true }
    },
    subscriptionPlan: {
      type: String,
      default: "none",
      enum: ["none", "free", "premium"]
    },
    subscriptionStatus: {
      type: String,
      default: "inactive",
      enum: ["inactive", "active", "expired"]
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);
