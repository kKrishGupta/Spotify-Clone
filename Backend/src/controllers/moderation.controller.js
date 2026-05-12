const Report =
  require(
    "../models/report.model"
  );

const report =
  async (
    req,
    res
  ) => {

    const created =
      await Report.create({
        reporter:
          req.user.id,

        targetId:
          req.body.targetId,

        targetType:
          req.body.targetType,

        reason:
          req.body.reason,
      });

    res.json({
      success: true,
      report: created,
    });
  };

const getReports =
  async (
    req,
    res
  ) => {

    const reports =
      await Report.find()
        .populate(
          "reporter",
          "username"
        );

    res.json({
      success: true,
      reports,
    });
  };

module.exports = {
  report,
  getReports,
};