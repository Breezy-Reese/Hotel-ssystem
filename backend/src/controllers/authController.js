const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Guest = require("../models/Guest");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/AppError");

const { logAudit } = require("./handlerFactory");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function createSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
}

// ============================================================
// STAFF REGISTRATION
// Only Admin/Manager should call this.
// Protected in authRoutes.js.
// ============================================================

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role, branch, phone } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    branch,
    phone,
    status: "Active",
  });

  logAudit({
    req,
    action: "CREATE",
    entity: "User",
    entityId: user._id,
  });

  createSendToken(user, 201, req, res);
});

// ============================================================
// CUSTOMER REGISTRATION
// Public customer self-registration.
// Creates both User and Guest records.
// ============================================================

exports.customerRegister = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(
      new AppError("Name, email and password are required.", 400),
    );
  }

  // Validate password length
  if (password.length < 8) {
    return next(
      new AppError("Password must be at least 8 characters long.", 400),
    );
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new AppError("An account with this email already exists.", 409),
    );
  }

  // Create customer account
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "Customer",
    status: "Active",
  });

  try {
    // Create guest profile
    const guest = await Guest.create({
      name,
      email,
      phone,
    });

    // Link guest profile to customer account
    user.guest = guest._id;

    await user.save({ validateBeforeSave: false });
  } catch (error) {
    // If guest creation fails, remove the user we just created
    await User.findByIdAndDelete(user._id);

    throw error;
  }

  createSendToken(user, 201, req, res);
});

// ============================================================
// LOGIN
// Used by both staff and customers.
// ============================================================

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide email and password", 400),
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError("Incorrect email or password", 401),
    );
  }

  if (user.status === "Disabled") {
    return next(
      new AppError("This account has been disabled.", 401),
    );
  }

  user.lastLogin = Date.now();

  await user.save({
    validateBeforeSave: false,
  });

  logAudit({
    req: { ...req, user },
    action: "LOGIN",
    entity: "User",
    entityId: user._id,
  });

  createSendToken(user, 200, req, res);
});

// ============================================================
// GET CURRENT USER
// ============================================================

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// ============================================================
// UPDATE PASSWORD
// ============================================================

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (
    !(await user.correctPassword(
      req.body.currentPassword,
      user.password,
    ))
  ) {
    return next(
      new AppError("Current password is incorrect.", 401),
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  createSendToken(user, 200, req, res);
});