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

    public toString = () => {
        return this.address;
    };
}

export type AddressType = Address | string;
