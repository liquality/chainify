export class Address {
  address: string
  derivationPath?: string
  publicKey?: string

  constructor(fields?: { address: string, derivationPath?: string, publicKey?: string }) {
    if (fields) Object.assign(this, fields);
  }
}
