const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const LoyaltyAccount = require("../models/LoyaltyAccount");

const POPULATE = "guest";
const TIER_THRESHOLDS = [
  { tier: "Platinum", min: 10000 },
  { tier: "Gold", min: 5000 },
  { tier: "Silver", min: 1000 },
  { tier: "Bronze", min: 0 },
];

function tierForSpend(spend) {
  return TIER_THRESHOLDS.find((t) => spend >= t.min).tier;
}

exports.getAll = factory.getAll(LoyaltyAccount, { defaultPopulate: POPULATE });
exports.getOne = factory.getOne(LoyaltyAccount, { defaultPopulate: POPULATE });
exports.remove = factory.deleteOne(LoyaltyAccount, { entity: "LoyaltyAccount" });

// Creates the account if the guest doesn't have one yet; otherwise returns it.
exports.create = catchAsync(async (req, res) => {
  const { guest } = req.body;
  let account = await LoyaltyAccount.findOne({ guest });
  if (!account) {
    account = await LoyaltyAccount.create({ guest });
    factory.logAudit({ req, action: "CREATE", entity: "LoyaltyAccount", entityId: account._id });
  }
  res.status(201).json({ status: "success", data: account });
});

exports.earn = catchAsync(async (req, res, next) => {
  const { points, spend = 0, reason } = req.body;
  const account = await LoyaltyAccount.findById(req.params.id);
  if (!account) return next(new AppError("No loyalty account found with that ID", 404));

  account.points += points;
  account.lifetimeSpend += spend;
  account.tier = tierForSpend(account.lifetimeSpend);
  account.lastActivity = Date.now();
  account.history.push({ type: "Earn", points, reason });
  await account.save();

  factory.logAudit({ req, action: "LOYALTY_EARN", entity: "LoyaltyAccount", entityId: account._id });
  res.status(200).json({ status: "success", data: account });
});

exports.redeem = catchAsync(async (req, res, next) => {
  const { points, reason } = req.body;
  const account = await LoyaltyAccount.findById(req.params.id);
  if (!account) return next(new AppError("No loyalty account found with that ID", 404));
  if (account.points < points) return next(new AppError("Insufficient points balance", 400));

  account.points -= points;
  account.lastActivity = Date.now();
  account.history.push({ type: "Redeem", points: -points, reason });
  await account.save();

  factory.logAudit({ req, action: "LOYALTY_REDEEM", entity: "LoyaltyAccount", entityId: account._id });
  res.status(200).json({ status: "success", data: account });
});
