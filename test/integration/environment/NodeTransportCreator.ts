import { LedgerProviderTypes } from '@chainify/hw-ledger';
import Transport from '@ledgerhq/hw-transport';
import LedgerHwTransportNode from '@ledgerhq/hw-transport-node-hid';

export class NodeTransportCreator implements LedgerProviderTypes.TransportCreator {
    private _transport: Transport = null;
    private _onDisconnectCallbacks: Array<() => void> = [];

    async create(onDisconnect?: () => void): Promise<Transport> {
        if (!this._transport || !(this._transport as LedgerHwTransportNode)?.device?.opened) {
            this._transport = await LedgerHwTransportNode.create();
            this._transport.on('disconnect', async () => {
                this._onDisconnectCallbacks.forEach((cb) => {
                    cb();
                });
                await this._transport?.close();
                this._transport = null;
                this._onDisconnectCallbacks = [];
            });
        }

        if (onDisconnect) {
            this._onDisconnectCallbacks.push(onDisconnect);
        }

        return this._transport;
    }
}
