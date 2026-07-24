const GRCCounter = require("../models/GRCCounter");

// Get current GRC number
exports.getCounter = async (req, res) => {
  try {
    const hotelId = req.user.hotelId || req.user._id;
    const counterName = `grcNo_${hotelId}`;
    let counter = await GRCCounter.findOne({ name: counterName, hotelId });
    if (!counter) {
      counter = new GRCCounter({ name: counterName, sequence_value: 1, hotelId });
      await counter.save();
    }
    res.json({ sequence_value: counter.sequence_value });
  } catch (error) {
    console.error("GRC Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Increment GRC number
exports.incrementCounter = async (req, res) => {
  try {
    const hotelId = req.user.hotelId || req.user._id;
    const counterName = `grcNo_${hotelId}`;
    let counter = await GRCCounter.findOneAndUpdate(
      { name: counterName, hotelId },
      { $inc: { sequence_value: 1 }, $setOnInsert: { hotelId, name: counterName } },
      { new: true, upsert: true }
    );
    res.json({ sequence_value: counter.sequence_value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset GRC number
exports.resetCounter = async (req, res) => {
  try {
    const hotelId = req.user.hotelId || req.user._id;
    const counterName = `grcNo_${hotelId}`;
    const { sequence_value } = req.body;
    const val = sequence_value || 1;
    let counter = await GRCCounter.findOneAndUpdate(
      { name: counterName, hotelId },
      { sequence_value: val, $setOnInsert: { hotelId, name: counterName } },
      { new: true, upsert: true }
    );
    res.json({ sequence_value: counter.sequence_value, message: "GRC Number reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
