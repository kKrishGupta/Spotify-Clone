const withTimeout =
  (
    promise,
    ms = 8000
  ) => {

    return Promise.race([
      promise,

      new Promise(
        (_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "Provider timeout"
                )
              ),
            ms
          )
      ),
    ]);
  };

module.exports = {
  withTimeout,
};