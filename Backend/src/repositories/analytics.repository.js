const analyticsModel = require("../models/analytics.model");

const create = (data) => analyticsModel.create(data);

const findLatest = (limit = 100) =>
  analyticsModel.find().sort({ createdAt: -1 }).limit(limit).lean();

module.exports = {
  create,
  findLatest,
};
