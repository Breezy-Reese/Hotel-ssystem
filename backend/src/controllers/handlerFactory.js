const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const AuditLog = require("../models/AuditLog");

// Fire-and-forget audit trail write. Never blocks or fails the main request.
function logAudit({ req, action, entity, entityId, result = "Success", meta }) {
  AuditLog.create({
    user: req.user ? req.user._id : undefined,
    action,
    entity,
    entityId,
    ip: req.ip,
    result,
    meta,
  }).catch((err) => console.error("Audit log write failed:", err.message));
}

exports.getAll = (Model, { searchableFields = [], defaultPopulate = "" } = {}) =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query, searchableFields)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    let query = features.query;
    if (defaultPopulate) query = query.populate(defaultPopulate);

    const [docs, total] = await Promise.all([
      query,
      Model.countDocuments(new APIFeatures(Model.find(), req.query, searchableFields).filter().search().query.getFilter()),
    ]);

    res.status(200).json({
      status: "success",
      results: docs.length,
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      pages: Math.ceil(total / features.pagination.limit) || 1,
      data: docs,
    });
  });

exports.getOne = (Model, { defaultPopulate = "" } = {}) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (defaultPopulate) query = query.populate(defaultPopulate);
    const doc = await query;

    if (!doc) return next(new AppError(`No ${Model.modelName} found with that ID`, 404));

    res.status(200).json({ status: "success", data: doc });
  });

exports.createOne = (Model, { entity } = {}) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    logAudit({ req, action: "CREATE", entity: entity || Model.modelName, entityId: doc._id });

    res.status(201).json({ status: "success", data: doc });
  });

exports.updateOne = (Model, { entity } = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError(`No ${Model.modelName} found with that ID`, 404));

    logAudit({ req, action: "UPDATE", entity: entity || Model.modelName, entityId: doc._id });

    res.status(200).json({ status: "success", data: doc });
  });

exports.deleteOne = (Model, { entity } = {}) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(`No ${Model.modelName} found with that ID`, 404));

    logAudit({ req, action: "DELETE", entity: entity || Model.modelName, entityId: req.params.id });

    res.status(204).json({ status: "success", data: null });
  });

exports.logAudit = logAudit;
