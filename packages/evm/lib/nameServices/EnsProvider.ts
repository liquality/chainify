import { AddressType, NameService } from '@chainify/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export class EnsProvider implements NameService {
    private _provider: StaticJsonRpcProvider;

    constructor(provider: StaticJsonRpcProvider) {
        this._provider = provider;
    }

    /**
     * @param address - address to look up
     * @returns - ens
     */
    public async resolve(address: AddressType): Promise<string> {
        return this._provider.lookupAddress(address.toString());
    }
}
