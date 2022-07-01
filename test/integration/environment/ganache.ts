import Ganache from 'ganache';

let server: any = null;

export async function startGanache(_options: any = {}) {
    const defaultOptions = {
        mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
        totalAccounts: 10,
        port: 8545,
        network_id: '1337',
        chainId: '1337',
        quiet: true,
        blockTime: 0,
        instamine: 'eager',
        defaultGasPrice: 0,
        default_balance_ether: 1000000000,
        ..._options,
    };
    server = Ganache.server(defaultOptions);

    server.listen(defaultOptions.port, async (err: any) => {
        if (err) {
            throw err;
        }

        console.log(`Ganache listening on port ${defaultOptions.port}...`);
        const provider = server.provider;
        const accounts = await provider.request({
            method: 'eth_accounts',
            params: [],
        });

        console.log(accounts);
    });

    return new Promise((resolve) => {
        setInterval(async () => {
            if ((server.status & ServerStatus.open) !== 0) {
                resolve(true);
            }
        }, 500);
    });
}

export async function closeGanache() {
    if (server) {
        await server.close();
    }
}

export enum ServerStatus {
    /**
     * The Server is in an unknown state; perhaps construction didn't succeed
     */
    unknown = 0,
    /**
     * The Server has been constructed and is ready to be opened.
     */
    ready = 1 << 0,
    /**
     * The Server has started to open, but has not yet finished initialization.
     */
    opening = 1 << 1,
    /**
     * The Server is open and ready for connection.
     */
    open = 1 << 2,
    /**
     * The Server is either opening or is already open
     */
    openingOrOpen = (1 << 1) | (1 << 2),
    /**
     * The Server is in the process of closing.
     */
    closing = 1 << 3,
    /**
     * The Server is closed and not accepting new connections.
     */
    closed = 1 << 4,
    /**
     * The Server is either opening or is already open
     */
    closingOrClosed = (1 << 3) | (1 << 4),
}
