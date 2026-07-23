const mongoose = require("mongoose");

const grcCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "grcNo"
  },
  sequence_value: {
    type: Number,
    required: true,
    default: 1
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  }
});

module.exports = mongoose.model("GRCCounter", grcCounterSchema);
