import { CreateLedgerApp } from '@chainify/hw-ledger';
import { Network } from '@chainify/types';
import HwAppEthereum from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';

export const CreateEvmLedgerApp: CreateLedgerApp = (transport: Transport, scrambleKey: string, _network: Network) => {
    {
        return new HwAppEthereum(transport, scrambleKey);
    }
};
