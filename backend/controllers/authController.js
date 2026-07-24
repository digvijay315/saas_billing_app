const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Hotel = require("../models/Hotel");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new hotel (SaaS)
// @route   POST /api/auth/register-hotel
// @access  Public
const registerHotel = async (req, res) => {
  const { hotelName, hotelEmail, hotelContact, hotelAddress, logo, gstNo, cinNo, adminName, adminEmail, adminPassword, adminMobile, adminAge, adminAddress } = req.body;

  try {
    const hotelExists = await Hotel.findOne({ email: hotelEmail });
    if (hotelExists) {
      return res.status(400).json({ success: false, message: "Hotel with this email already exists" });
    }
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      return res.status(400).json({ success: false, message: "Admin user with this email already exists" });
    }

    const hotel = await Hotel.create({
      name: hotelName,
      email: hotelEmail,
      contact: hotelContact,
      address: hotelAddress,
      logo: logo || "",
      gstNo: gstNo || "",
      cinNo: cinNo || "",
    });

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      mobile: adminMobile,
      age: adminAge,
      address: adminAddress,
      hotelId: hotel._id,
    });

    hotel.adminId = adminUser._id;
    await hotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      hotel,
      adminUser: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        hotelId: adminUser.hotelId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('hotelId', 'name email contact address logo gstNo cinNo staffPermissions subscriptionPlan subscriptionStatus subscriptionExpiresAt');

    if (user && (await user.matchPassword(password))) {
      // Check subscription for staff members
      if (user.role === "staff") {
        if (!user.hotelId || user.hotelId.subscriptionStatus !== "active") {
          return res.status(403).json({ 
            success: false, 
            message: "Subscription inactive! Admin must activate a plan before staff can login." 
          });
        }
      }

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          hotelId: user.hotelId ? user.hotelId._id : null,
          hotelName: user.hotelId ? user.hotelId.name : "NexaDesk Property",
          hotelEmail: user.hotelId ? user.hotelId.email : "",
          hotelContact: user.hotelId ? user.hotelId.contact : "",
          hotelAddress: user.hotelId ? user.hotelId.address : "",
          hotelLogo: user.hotelId ? user.hotelId.logo : "",
          hotelGstNo: user.hotelId ? user.hotelId.gstNo : "",
          hotelCinNo: user.hotelId ? user.hotelId.cinNo : "",
          staffPermissions: user.hotelId ? user.hotelId.staffPermissions : null,
          subscriptionPlan: user.hotelId ? user.hotelId.subscriptionPlan : "none",
          subscriptionStatus: user.hotelId ? user.hotelId.subscriptionStatus : "inactive",
          subscriptionExpiresAt: user.hotelId ? user.hotelId.subscriptionExpiresAt : null,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new staff member
// @route   POST /api/auth/register-staff
// @access  Private/Admin
const registerStaff = async (req, res) => {
  const { name, email, password, mobile, age, address } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "Staff with this email already exists" });
    }

    const staff = await User.create({
      name,
      email,
      password, // Will be hashed by userSchema pre-save hook
      role: "staff",
      mobile,
      age,
      address,
      hotelId: req.user.hotelId, // Associate with admin's hotel
    });

    if (staff) {
      res.status(201).json({
        success: true,
        message: "Staff member registered successfully",
        staff: {
          _id: staff._id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          age: staff.age,
          address: staff.address,
          hotelId: staff.hotelId,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid staff data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/auth/staff
// @access  Private/Admin
const getStaff = async (req, res) => {
  try {
    const staffMembers = await User.find({ role: "staff", hotelId: req.user.hotelId }).select("-password");
    res.json({ success: true, staff: staffMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/auth/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff || staff.role !== "staff" || staff.hotelId.toString() !== req.user.hotelId.toString()) {
      return res.status(404).json({ success: false, message: "Staff member not found or unauthorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/update-password
// @access  Private/Admin
const updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(401).json({ success: false, message: "Invalid current password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff panel permissions
// @route   PUT /api/auth/update-staff-permissions
// @access  Private/Admin
const updateStaffPermissions = async (req, res) => {
  const { permissions } = req.body;
  
  try {
    const hotel = await Hotel.findById(req.user.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    
    hotel.staffPermissions = permissions;
    await hotel.save();
    
    res.json({ success: true, message: "Staff permissions updated successfully", staffPermissions: hotel.staffPermissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subscription plan
// @route   PUT /api/auth/subscription
// @access  Private/Admin
const updateSubscription = async (req, res) => {
  const { plan, status } = req.body;
  
  try {
    const hotel = await Hotel.findById(req.user.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    
    if (plan) {
      hotel.subscriptionPlan = plan;
      if (plan === "premium") {
        // Set expiry to 28 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 28);
        hotel.subscriptionExpiresAt = expiryDate;
      } else if (plan === "free") {
        hotel.subscriptionExpiresAt = null;
      }
    }
    if (status) hotel.subscriptionStatus = status;
    
    await hotel.save();
    
    res.json({ 
      success: true, 
      message: "Subscription updated successfully", 
      subscriptionPlan: hotel.subscriptionPlan,
      subscriptionStatus: hotel.subscriptionStatus,
      subscriptionExpiresAt: hotel.subscriptionExpiresAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerHotel,
  loginUser,
  registerStaff,
  getStaff,
  deleteStaff,
  updateAdminPassword,
  updateStaffPermissions,
  updateSubscription,
};
