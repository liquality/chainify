import { AddressType, NamingProvider } from '@chainify/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export class EnsProvider implements NamingProvider {
    private _provider: StaticJsonRpcProvider;

    constructor(provider: StaticJsonRpcProvider) {
        this._provider = provider;
    }

    /**
     * @param address - resolve name to address
     * @returns - address
     */
    public async resolveName(name: string): Promise<AddressType> {
        return this._provider.resolveName(name);
    }

    /**
     * @param address - look up address
     * @returns - ens
     */
    public async lookupAddress(address: AddressType): Promise<string> {
        return this._provider.lookupAddress(address.toString());
    }
}
