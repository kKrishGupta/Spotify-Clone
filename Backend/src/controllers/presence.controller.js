const {
  getUserPresence,
} = require(
  "../service/presence.service"
);

const getPresence =
  async (
    req,
    res
  ) => {

    const presence =
      await getUserPresence(
        req.params.id
      );

    res.json({
      success: true,
      presence,
    });
  };

module.exports = {
  getPresence,
};