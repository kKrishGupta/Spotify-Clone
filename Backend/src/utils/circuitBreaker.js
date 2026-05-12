class CircuitBreaker {

  constructor() {

    this.failures = 0;

    this.open = false;

    this.lastFailure =
      null;
  }

  async execute(fn) {

    if (
      this.open &&
      Date.now() -
        this.lastFailure <
        30000
    ) {
      throw new Error(
        "Circuit open"
      );
    }

    try {

      const result =
        await fn();

      this.failures = 0;

      this.open = false;

      return result;

    } catch (err) {

      this.failures++;

      this.lastFailure =
        Date.now();

      if (
        this.failures >= 5
      ) {
        this.open = true;
      }

      throw err;
    }
  }
}

module.exports =
  CircuitBreaker;