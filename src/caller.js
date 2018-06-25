export default class Caller {
  constructor ({ driver } = {}) {
    this.driver = driver
  }

  run ({ method, params = [], _this }) {
    return this.driver.methods[method].function.run(_this, params)
  }
}
