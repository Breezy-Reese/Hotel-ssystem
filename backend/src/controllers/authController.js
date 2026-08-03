const jwt = require("jsonwebtoken");
const User = require("../models/User");
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

// Only Admin/Manager should call this in practice (protected + restricted in routes)
// to create staff accounts. Public self-registration is intentionally not exposed.
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

  logAudit({ req, action: "CREATE", entity: "User", entityId: user._id });

  createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.status === "Disabled") {
    return next(new AppError("This account has been disabled.", 401));
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  logAudit({ req: { ...req, user }, action: "LOGIN", entity: "User", entityId: user._id });

  createSendToken(user, 200, req, res);
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect.", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  createSendToken(user, 200, req, res);
});
