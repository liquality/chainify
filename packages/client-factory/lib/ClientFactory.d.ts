import Client from '@liquality/client';
import * as presets from './presets';
interface ProviderOption {
    provider: any;
    optional: string[];
    args: any[] | ((config: any) => any[]);
    requires: string[];
    onlyIf: string[];
}
export default class ClientFactory {
    static createFrom(preset: ProviderOption[], config?: any): Client;
    static create(network: string, asset: string, config?: {}): Client;
    static presets: typeof presets;
}
export {};
