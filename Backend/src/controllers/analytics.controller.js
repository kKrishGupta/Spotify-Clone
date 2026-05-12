const analyticsService =
  require(
    "../service/analytics.service"
  );

const asyncHandler =
  require(
    "../utils/asyncHandler"
  );

// 🚀 PLATFORM ANALYTICS
const getPlatformAnalytics =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const data =
        await analyticsService.getPlatformAnalytics();

      res.json({
        success: true,
        data,
      });
    }
  );

module.exports = {
  getPlatformAnalytics,
};