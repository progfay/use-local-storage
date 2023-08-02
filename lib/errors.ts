export class NoWindowError extends Error {
  constructor() {
    super("`window` is not defined");
  }
}
