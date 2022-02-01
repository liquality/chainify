import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class HttpClient {
    private _node: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this._node = axios.create(config);
    }

    async nodeGet<I = any, O = any>(url: string, params: I = {} as I): Promise<O> {
        const response = await this._node.get(url, { params });
        return response.data as O;
    }

    async nodePost<I = any, O = any>(url: string, data: I): Promise<O> {
        const response = await this._node.post(url, data);
        return response.data as O;
    }
}
