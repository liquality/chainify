import { Address } from '@chainify/types';
import { Chain } from '../../types';

export async function importBitcoinAddresses(chain: Chain) {
    const change = await chain.client.wallet.getAddresses(0, 200, true);
    const nonChange = await chain.client.wallet.getAddresses(0, 200, false);
    const all = [...nonChange, ...change].map((address) => address.address);
    const request = all.map((address) => ({ scriptPubKey: { address }, timestamp: 0 }));
    return chain.client.chain.sendRpcRequest('importmulti', [request]);
}

export async function getRandomBitcoinAddress(chain: Chain): Promise<Address> {
    return chain.client.chain.sendRpcRequest('getnewaddress', []);
}
