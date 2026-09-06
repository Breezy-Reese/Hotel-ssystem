const jwt = require("jsonwebtoken");
const Guest = require("../models/Guest");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

function signToken(id) {
  // `type: "customer"` distinguishes this from a staff token — see
  // middleware/customerAuth.js and the added check in middleware/auth.js.
  return jwt.sign({ id, type: "customer" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
}

function createSendToken(guest, statusCode, res) {
  const token = signToken(guest._id);
  res.status(statusCode).json({ status: "success", token, data: { guest } });
}

// POST /api/v1/customer-auth/register
// If a Guest record with this email already exists (e.g. staff created it
// during a walk-in booking) and has no password yet, this "claims" that
// record instead of creating a duplicate — so booking history carries over.
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("name, email and password are required", 400));
  }
  if (password.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400));
  }

  let guest = await Guest.findOne({ email: email.toLowerCase() });

  if (guest && guest.hasAccount) {
    return next(new AppError("An account with this email already exists. Please log in instead.", 409));
  }

  if (guest) {
    guest.name = name;
    guest.phone = phone || guest.phone;
    guest.password = password;
    await guest.save();
  } else {
    guest = await Guest.create({ name, email: email.toLowerCase(), phone, password });
  }

  createSendToken(guest, 201, res);
});

// POST /api/v1/customer-auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Please provide email and password", 400));

  const guest = await Guest.findOne({ email: email.toLowerCase() }).select("+password");

  if (!guest || !guest.hasAccount || !(await guest.correctPassword(password, guest.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(guest, 200, res);
});

// GET /api/v1/customer-auth/me
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: "success", data: { guest: req.customer } });
});