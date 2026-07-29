const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const Notification = require("../models/Notification");
const SubscriptionInvoice = require("../models/SubscriptionInvoice");
const User = require("../models/User");

// @desc    Get dashboard statistics
// @route   GET /api/superadmin/dashboard-stats
// @access  Public
router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments({});
    const activeSubscriptions = await Hotel.countDocuments({ subscriptionStatus: "active" });
    const totalUsers = await User.countDocuments({});
    
    const revenueAggregation = await SubscriptionInvoice.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    const recentHotels = await Hotel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name subscriptionPlan createdAt');

    const planDistribution = await Hotel.aggregate([
      { $group: { _id: { $ifNull: ["$subscriptionPlan", "free"] }, value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await SubscriptionInvoice.aggregate([
      { $match: { status: 'success', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).then(results => results.map(r => {
      const date = new Date(r._id.year, r._id.month - 1, 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        revenue: r.revenue
      };
    }));

    res.json({
      totalHotels,
      activeSubscriptions,
      totalUsers,
      totalRevenue,
      recentHotels,
      planDistribution,
      revenueByMonth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all hotels
// @route   GET /api/superadmin/hotels
// @access  Public (for local dev, should be protected by super admin middleware in prod)
router.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Toggle block status of a hotel
// @route   PUT /api/superadmin/hotels/:id/block
// @access  Public
router.put("/hotels/:id/block", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    hotel.isActive = !hotel.isActive;
    await hotel.save();
    res.json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Toggle subscription status of a hotel
// @route   PUT /api/superadmin/hotels/:id/subscription
// @access  Public
router.put("/hotels/:id/subscription", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    // Assuming subscriptionStatus is either "active" or "inactive"
    hotel.subscriptionStatus = hotel.subscriptionStatus === "active" ? "inactive" : "active";
    await hotel.save();
    res.json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a hotel
// @route   DELETE /api/superadmin/hotels/:id
// @access  Public
router.delete("/hotels/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all SaaS Subscription Invoices (with Server-Side Pagination)
// @route   GET /api/superadmin/invoices
// @access  Public
router.get("/invoices", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await SubscriptionInvoice.find({})
      .populate('hotelId', 'name email contact')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SubscriptionInvoice.countDocuments({});

    res.json({
      data: invoices,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all admin notifications
// @route   GET /api/superadmin/notifications
// @access  Public
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/superadmin/notifications/:id/read
// @access  Public
router.put("/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Not found' });
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
