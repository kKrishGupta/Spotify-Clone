const isObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

module.exports = {
  isObjectId,
  isNonEmptyString,
};
