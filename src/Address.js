export default class Address {
  constructor (address, derivationPath, index = false) {
    this.address = address
    this.derivationPath = derivationPath
    this.index = index
  }

  toString () {
    return this.address
  }

  toLocaleString () {
    return this.address
  }
}
