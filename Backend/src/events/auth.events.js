const emitLogin = (
  io,
  payload
) => {
  io.emit("user:login", payload);
};

const emitLogout = (
  io,
  payload
) => {
  io.emit("user:logout", payload);
};

module.exports = {
  emitLogin,
  emitLogout,
};