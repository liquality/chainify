import { Client } from '@liquality/client';

import { deployEvmContracts } from './evm';

export async function deploy(client: Client) {
    await deployEvmContracts(client);
}
