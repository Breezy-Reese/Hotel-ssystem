const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Guest = require("../models/Guest");

exports.protectCustomer = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Please log in to continue.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (decoded.type !== "customer") {
    return next(new AppError("Invalid session. Please log in again.", 401));
  }

  const guest = await Guest.findById(decoded.id);
  if (!guest || !guest.hasAccount) {
    return next(new AppError("This account no longer exists.", 401));
  }
  if (guest.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password was recently changed. Please log in again.", 401));
  }

  req.customer = guest;
  next();
});