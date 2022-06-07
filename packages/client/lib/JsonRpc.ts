import { Logger } from '@chainify/logger';
import { AxiosRequestConfig } from 'axios';
import HttpClient from './Http';

const logger = new Logger('JsonRpcProvider');

export default class JsonRpcProvider {
    private readonly _httpClient: HttpClient;
    private _nextId: number;

    constructor(url?: string, username?: string, password?: string) {
        const config: AxiosRequestConfig = {
            baseURL: url || JsonRpcProvider.defaultUrl(),
            responseType: 'text',
            transformResponse: undefined, // https://github.com/axios/axios/issues/907,
            validateStatus: () => true,
        };

        if (username || password) {
            config.auth = { username, password };
        }

        this._nextId = 42;

        this._httpClient = new HttpClient(config);
    }

    static defaultUrl(): string {
        return 'http://localhost:8545';
    }

    public async send(method: string, params: Array<any>): Promise<any> {
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: '2.0',
        };

        const result = this._httpClient.nodePost('/', request).then(
            (result) => {
                logger.debug({
                    action: 'response',
                    request: request,
                    response: result,
                    provider: this,
                });
                return this.getResult(result);
            },
            (error) => {
                logger.debug({
                    action: 'response',
                    error: error,
                    request: request,
                    provider: this,
                });

                throw error;
            }
        );

        return result;
    }

    private getResult(payload: { error?: { code?: number; data?: any; message?: string }; result?: any }): any {
        if (payload.error) {
            const error: any = new Error(payload.error.message);
            error.code = payload.error.code;
            error.data = payload.error.data;
            throw error;
        }

        return payload.result;
    }
}
