import { NodeError } from '@chainify/errors';
import { Logger } from '@chainify/logger';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const logger = new Logger('HttpClient');
export default class HttpClient {
    private _node: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this._node = axios.create(config);
    }

    public async nodeGet<I = any, O = any>(url: string, params: I = {} as I, config?: AxiosRequestConfig): Promise<O> {
        const response = await this._node
            .get(url, { ...config, params })
            .then((response) => response.data as O)
            .catch(this.handleError);

        return response as unknown as O;
    }

    public async nodePost<I = any, O = any>(url: string, data: I, config?: AxiosRequestConfig): Promise<O> {
        const response = this._node
            .post(url, data, config)
            .then((response) => response.data as O)
            .catch(this.handleError);

        return response as unknown as O;
    }

    public setConfig(config: AxiosRequestConfig) {
        this._node = axios.create(config);
    }

    private handleError(error: any): void {
        const { message, ...attrs } = error;
        const errorMessage = error?.response?.data || message;

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            logger.debug('error.response');
            logger.debug(error.response.data);
            logger.debug(error.response.status);
            logger.debug(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            logger.debug('error.request');
            logger.debug(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            logger.debug('error.message');
            logger.debug(error.message);
        }

        throw new NodeError(errorMessage, { ...attrs });
    }
}
