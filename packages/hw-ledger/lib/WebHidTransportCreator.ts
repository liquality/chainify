import Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { TransportCreator } from "./types";

export class WebHidTransportCreator implements TransportCreator {

    private _transport: Transport = null;
    private _onDisconnectCallbacks: Array<() => void> = [];

    async create(onDisconnect?: () => void): Promise<Transport> {
        if (!this._transport || !(this._transport as TransportWebHID)?.device?.opened) {
            this._transport = await TransportWebHID.create();
            this._transport.on('disconnect', async () => {
                this._onDisconnectCallbacks.forEach((cb) => {
                    cb();
                })
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


