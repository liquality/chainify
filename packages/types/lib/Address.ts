export class Address {
    address: string;
    derivationPath?: string;
    publicKey?: string;
    privateKey?: string;

    constructor(fields?: { address: string; derivationPath?: string; publicKey?: string; privateKey?: string }) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

    static addressToString(address: Address | string): string {
        return typeof address === 'string' ? address : address.address;
    }
}

export type AddressType = Address | string;
