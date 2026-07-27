const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Hotel = require('../models/Hotel');
const Notification = require('../models/Notification');
const SubscriptionInvoice = require('../models/SubscriptionInvoice');
const { protect } = require('../middleware/auth');

// Use env variables, fallback for local testing if not provided
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
const PAYU_SALT = process.env.PAYU_SALT || 'eCwWELxi';
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @desc    Generate hash for PayU request
// @route   POST /api/payment/hash
// @access  Public
router.post('/hash', (req, res) => {
  const { txnid, amount, productinfo, firstname, email, udf1 } = req.body;

  if (!txnid || !amount || !productinfo || !firstname || !email) {
    return res.status(400).json({ error: 'Missing mandatory fields' });
  }

  // Hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const udf1Safe = udf1 || '';
  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1Safe}||||||||||${PAYU_SALT}`;
  
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.json({
    hash,
    key: PAYU_MERCHANT_KEY,
    url: PAYU_BASE_URL
  });
});

// @desc    Handle PayU Success Callback
// @route   POST /api/payment/success
// @access  Public (PayU server / browser redirect)
router.post('/success', async (req, res) => {
  try {
    const { 
      txnid, amount, productinfo, firstname, email, status, hash, 
      udf1, udf2, udf3, udf4, udf5 
    } = req.body;

    // Verify Reverse Hash
    // Reverse Hash format: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const udf1Safe = udf1 || '';
    const reverseHashString = `${PAYU_SALT}|${status}||||||||||${udf1Safe}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
    const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    if (calculatedHash !== hash) {
      // If hashes don't match, it's an invalid/tampered request
      return res.redirect(`${FRONTEND_URL}/admin/billing?payment=failed&reason=hash_mismatch`);
    }

    if (status === 'success') {
      // Find hotel by email (since email is unique) and update subscription
      // Note: In a real app, you might pass hotelId in a udf field. For simplicity, we use email here.
      const hotel = await Hotel.findOne({ email });
      if (hotel) {
        const planName = udf1 || 'premium'; // fallback
        hotel.subscriptionPlan = planName;
        hotel.subscriptionStatus = 'active';
        hotel.subscriptionExpiresAt = new Date(new Date().setDate(new Date().getDate() + 28)); // 28 days
        await hotel.save();

        // Create Admin Notification
        await Notification.create({
          title: 'Payment Successful',
          message: `Hotel ${hotel.name} just purchased the ${planName} plan!`,
          type: 'PAYMENT',
          hotelId: hotel._id
        });

        // Record the transaction as a SaaS Invoice
        await SubscriptionInvoice.create({
          txnid,
          hotelId: hotel._id,
          planName: planName,
          amount: parseFloat(amount),
          status: 'success',
          customerEmail: email,
          customerName: firstname
        });
      }

      // Redirect back to frontend
      return res.redirect(`${FRONTEND_URL}/admin/billing?payment=success`);
    }

    res.redirect(`${FRONTEND_URL}/admin/billing?payment=failed`);
  } catch (error) {
    console.error("Payment Success Handler Error:", error);
    res.redirect(`${FRONTEND_URL}/admin/billing?payment=error`);
  }
});

// @desc    Handle PayU Failure Callback
// @route   POST /api/payment/failure
// @access  Public
router.post('/failure', (req, res) => {
  res.redirect(`${FRONTEND_URL}/admin/billing?payment=failed`);
});

// @desc    Get logged-in hotel's subscription invoices
// @route   GET /api/payment/my-invoices
// @access  Private (Admin only)
router.get('/my-invoices', protect, async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    if (!hotelId) {
      return res.status(400).json({ message: 'User does not belong to a hotel' });
    }
    const invoices = await SubscriptionInvoice.find({ hotelId })
      .populate('hotelId', 'name email contact')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
