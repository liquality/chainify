import { AddressType } from './Address';

export interface NameService {
    /**
     * @param address - address to look up
     * @returns - ens
     */
    resolve(address: AddressType): Promise<string>;
}
