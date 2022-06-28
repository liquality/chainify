import { AddressType } from './Address';

export interface NameService {
    /**
     * @param address - resolve name to address
     * @returns - address
     */
    resolveName(name: string): Promise<AddressType>;

    /**
     * @param address - look up address
     * @returns - ens
     */
    lookupAddress(address: AddressType): Promise<string>;
}
