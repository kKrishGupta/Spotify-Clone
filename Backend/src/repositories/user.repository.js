const userModel = require("../models/user.model");

const findById = async (userId) => {
  return await userModel.findById(userId);
};

module.exports = {
  findById,
};