export class Address {
    address: string;
    derivationPath?: string;
    publicKey?: string;
    privateKey?: string;
    name?: string;

    constructor(fields?: { address: string; derivationPath?: string; publicKey?: string; privateKey?: string; name?: string }) {
        if (fields) {
            Object.assign(this, fields);
        }
    }

    public toString = () => {
        return this.address;
    };
}

export type AddressType = Address | string;
