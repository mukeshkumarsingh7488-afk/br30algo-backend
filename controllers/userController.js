import axios from "axios";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { uploadImageToCloud } from "../middleware/uploadMiddleware.js";
import { getRegisterOtpEmailTemplate } from "../utils/emailTemplate.js";

if (typeof registerOtpMemoryCache === "undefined") {
  global.registerOtpMemoryCache = {};
}

export const sendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered in our database!",
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    registerOtpMemoryCache[email] = {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    const emailTemplateHtml = getRegisterOtpEmailTemplate(generatedOtp, email);

    const brevoResponse = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Sudha Dairy Hub",
          email: process.env.BREVO_EMAIL.trim(),
        },
        to: [{ email: email }],
        subject: "SUDHA DAIRY PORTAL - NEW REGISTRATION VERIFICATION CODE",
        htmlContent: emailTemplateHtml,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_SMTP_KEY.trim(),
          "content-type": "application/json",
        },
      },
    );

    if (brevoResponse.status === 201 || brevoResponse.status === 200) {
      return res.status(200).json({
        success: true,
        message: "6-Digit registration code successfully sent to email!",
      });
    } else {
      throw new Error("Brevo API node rejected transaction");
    }
  } catch (error) {
    console.error(
      "💡 LIVE BREVO API ERROR LOG:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      success: false,
      message: "Failed to send registration verification code.",
    });
  }
};

export const sendDeliveryBoyOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered in our database!",
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    registerOtpMemoryCache[email] = {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    const transporter = createMailTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "🔒 SUDHA DAIRY PORTAL - AGENT REGISTRATION VERIFICATION CODE",
      html: getRegisterOtpEmailTemplate(generatedOtp, email),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "6-Digit registration code successfully sent to email!",
    });
  } catch (error) {
    console.log("MAIL ERROR =>", error);
    console.log("MESSAGE =>", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP email.",
    });
  }
};

export const registerRetailer = async (req, res) => {
  try {
    const {
      shopName,
      proprietor,
      mobile,
      email,
      password,
      route,
      dealerCode,
      role,
      aadharNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
      previews,
      otp,
    } = req.body;
    if (!proprietor || !mobile || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Mobile, Email, Password and Verification OTP are mandatory fields!",
      });
    }

    if (
      role === "retailer" &&
      (!shopName ||
        !aadharNumber ||
        !panNumber ||
        !bankName ||
        !accountNumber ||
        !ifscCode)
    ) {
      return res.status(400).json({
        success: false,
        message: "All shop KYC and bank details are mandatory for retailers!",
      });
    }

    const cachedRecord = registerOtpMemoryCache[email];
    if (!cachedRecord || Date.now() > cachedRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired or not requested!",
      });
    }
    if (cachedRecord.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration verification code!",
      });
    }

    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });
    if (emailExists || mobileExists) {
      return res.status(400).json({
        success: false,
        message: emailExists
          ? "Email already registered!"
          : "Mobile already registered!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let cloudPreviews = {
      photo: null,
      aadharFront: null,
      aadharBack: null,
      panCard: null,
      bankCheque: null,
    };
    if (previews && role === "retailer") {
      if (previews.photo)
        cloudPreviews.photo = await uploadImageToCloud(
          previews.photo,
          "retailer_photos",
        );
      if (previews.aadharFront)
        cloudPreviews.aadharFront = await uploadImageToCloud(
          previews.aadharFront,
          "aadhar_cards",
        );
      if (previews.aadharBack)
        cloudPreviews.aadharBack = await uploadImageToCloud(
          previews.aadharBack,
          "aadhar_cards",
        );
      if (previews.panCard)
        cloudPreviews.panCard = await uploadImageToCloud(
          previews.panCard,
          "pan_cards",
        );
      if (previews.bankCheque)
        cloudPreviews.bankCheque = await uploadImageToCloud(
          previews.bankCheque,
          "bank_documents",
        );
    }

    const newRetailer = new User({
      shopName:
        role === "admin"
          ? `OFFICE_STAFF_${proprietor.toUpperCase().replace(/ /g, "_")}`
          : shopName,
      proprietor,
      mobile,
      email,
      password: hashedPassword,
      route: role === "admin" ? "All Routes" : route,
      dealerCode: role === "admin" ? "STAFF-CODE" : dealerCode,
      role: role || "retailer",
      status: "Active",
      aadharNumber: role === "admin" ? `STAFF-AA-${Date.now()}` : aadharNumber,
      panNumber: role === "admin" ? `STAFF-PA-${Date.now()}` : panNumber,
      bankName: role === "admin" ? "N/A" : bankName,
      accountNumber: role === "admin" ? "N/A" : accountNumber,
      ifscCode: role === "admin" ? "N/A" : ifscCode,
      previews: cloudPreviews,
    });

    await newRetailer.save();
    delete registerOtpMemoryCache[email];

    res.status(201).json({
      success: true,
      message: "Account successfully registered and synchronized!",
    });
  } catch (error) {
    console.error(`❌ Register User System Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to process account onboarding parameters.",
    });
  }
};

export const registerDeliveryBoyNode = async (req, res) => {
  try {
    const { proprietor, mobile, email, password, route, otp } = req.body;

    const cachedOtpData = registerOtpMemoryCache[email];
    if (
      !cachedOtpData ||
      cachedOtpData.otp !== otp ||
      cachedOtpData.expiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification OTP code!",
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Agent node already exists in cluster",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new User({
      proprietor,
      mobile,
      email,
      password: hashedPassword,
      role: "delivery_boy",
      route,
      status: "Active",
    });

    await newAgent.save();

    delete registerOtpMemoryCache[email];

    res.status(201).json({
      success: true,
      message: "Delivery Agent authorized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRetailers = async (req, res) => {
  try {
    let targetRoles = ["retailer"];

    if (
      req.query.role === "delivery_boy" ||
      req.originalUrl.includes("agent") ||
      req.originalUrl.includes("delivery")
    ) {
      targetRoles = ["delivery_boy", "deliveryBoy"];
    } else if (req.query.role === "all") {
      targetRoles = ["retailer", "delivery_boy", "deliveryBoy", "admin"];
    }

    const users = await User.find({ role: { $in: targetRoles } })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching account records.",
    });
  }
};

export const toggleRetailerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const shopUser = await User.findById(id);
    if (!shopUser)
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    const nextStatus = shopUser.status === "Active" ? "Blocked" : "Active";
    shopUser.status = nextStatus;
    await shopUser.save();
    res.status(200).json({
      success: true,
      message: `Status successfully updated to ${nextStatus}!`,
      status: nextStatus,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update supply status." });
  }
};

export const deleteRetailer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });
    res.status(200).json({
      success: true,
      message: "Record permanently erased from system records.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to remove shop record." });
  }
};

export const updateRetailerProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID parameter is missing from context.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account record not found.",
      });
    }

    const { proprietor, mobile, email, route } = req.body;

    if (proprietor) user.proprietor = proprietor;
    if (mobile) user.mobile = mobile;
    if (email) user.email = email;
    if (route) user.route = route;

    const imagePayload =
      req.body.profilePhoto || req.body.image || req.body.userProfilePic;

    if (imagePayload) {
      const imageUrl = await uploadImageToCloud(imagePayload, "profile");

      user.userProfilePic = imageUrl;
    }

    await user.save();
    console.log("UPDATED USER =>", user);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
      url: user.userProfilePic,
    });
  } catch (error) {
    console.error("❌ updateRetailerProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getSingleRetailerProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID parameter is missing from context.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user document found inside MongoDB cluster.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const rechargeRetailerWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, actionType } = req.body;

    const changeAmount = parseFloat(amount);
    if (isNaN(changeAmount) || changeAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid amount!" });
    }

    const shopUser = await User.findById(id);
    if (!shopUser) {
      return res
        .status(404)
        .json({ success: false, message: "User account record not found." });
    }

    if (shopUser.walletBalance === undefined) {
      shopUser.walletBalance = 0;
    }

    if (actionType === "add" || !actionType) {
      shopUser.walletBalance += changeAmount;
    } else if (actionType === "deduct") {
      if (shopUser.walletBalance < changeAmount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance for this booking!",
        });
      }
      shopUser.walletBalance -= changeAmount;
    }

    await shopUser.save();

    return res.status(200).json({
      success: true,
      message: "Wallet balance successfully synchronized with MongoDB Cloud! ✓",
      newBalance: shopUser.walletBalance,
    });
  } catch (error) {
    console.error(`❌ Complete Recharge Sync Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal cloud gateway architecture failure.",
    });
  }
};

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_YOUR_KEY_HERE",
  key_secret: "YOUR_SECRET_HERE",
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const rzpKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_MOCK_KEY_ID";
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET || "MOCK_SECRET";

    const orderAmtPaise = Math.round(parseFloat(amount) * 100);

    if (
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID.includes("YOUR_KEY")
    ) {
      return res.status(200).json({
        success: true,
        isMockMode: true,
        order: {
          id: `order_mock_${Date.now()}`,
          amount: orderAmtPaise,
          currency: "INR",
        },
      });
    }

    const razorpayInstance = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpSecret,
    });
    const options = {
      amount: orderAmtPaise,
      currency: "INR",
      receipt: `receipt_topup_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({ success: true, isMockMode: false, order });
  } catch (error) {
    console.error(`❌ Razorpay Create Order Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate merchant banking node.",
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      retailerId,
      amount,
    } = req.body;

    const shopUser = await User.findById(retailerId);
    if (!shopUser)
      return res
        .status(404)
        .json({ success: false, message: "User account record not found." });
    if (shopUser.walletBalance === undefined) shopUser.walletBalance = 0;

    if (razorpay_order_id && razorpay_order_id.startsWith("order_mock_")) {
      shopUser.walletBalance += parseFloat(amount);
      await shopUser.save();
      return res.status(200).json({
        success: true,
        message: "Mock payment verified successfully! ✓",
        newBalance: shopUser.walletBalance,
      });
    }

    const rzpSecret = process.env.RAZORPAY_KEY_SECRET || "MOCK_SECRET";
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", rzpSecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      shopUser.walletBalance += parseFloat(amount);
      await shopUser.save();
      return res.status(200).json({
        success: true,
        message: "Real payment verified and locked! ✓",
        newBalance: shopUser.walletBalance,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment signature mismatch! Transaction counterfeited.",
      });
    }
  } catch (error) {
    console.error(`❌ Razorpay Verification Error: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal validation layer failure." });
  }
};
