import fetch from 'node-fetch';
import { HTTP_METHOD, HTTP_STATUS_CODE } from '../../../types';
import { GITLAB_API_ENDPOINTS, IGitlabAPIRequest, IGitlabAPIResponse } from '../types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { GitlabError } from '../../../errors/gitlabError';
import { GitlabNoConnection } from '../../../errors/gitlabNoConnection';

export interface IAbstractCommand_Params<T extends GITLAB_API_ENDPOINTS> {
    /**
     * Параметры GET-запроса, сериализуемые в строку "?name=value&name1=value1..."
     *
     * @type {({[key: string]: string | number | boolean})}
     * @memberof IAbstractCommand_Params
     */
    query?: { [key: string]: string | number | boolean };
    /**
     * Параметры запроса указанные в строке this._path
     * вида "/api/path/:paramName/somePath"
     *
     * @type {({[key: string]: string | number | boolean})}
     * @memberof IAbstractCommand_Params
     */
    params?: { [key: string]: string | number };
    body?: IGitlabAPIRequest[T];
    headers?: { [key: string]: string };
}

export default abstract class Command<T extends GITLAB_API_ENDPOINTS> {
    private _url: string = process.env.GITLAB_URL as string;
    abstract _apiPrefix: string;
    abstract _path: GITLAB_API_ENDPOINTS;
    abstract _params: IAbstractCommand_Params<T>;
    abstract _method: HTTP_METHOD;

    public send(): Promise<IGitlabAPIResponse[T]> {
        let fullUrl = this._url + this._apiPrefix + this._path;
        const options: AxiosRequestConfig = {
            method: this._method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (this._params.body && this._method !== HTTP_METHOD.GET) {
            options.data = this._params.body;
        }
        if (this._params.query && this._method === HTTP_METHOD.GET) {
            fullUrl += '?' + this._serializeQueryParams(this._params.query);
        }
        if (this._params.headers && options.headers) {
            options.headers = Object.assign(options.headers, this._params.headers);
        }
        options.url = this._prepareUrl(fullUrl);
        return new Promise((resolve, reject) => {
            axios(options)
                .then((axiosResponse) => {
                    switch (axiosResponse.status) {
                        case HTTP_STATUS_CODE.OK:
                        case HTTP_STATUS_CODE.CREATED:
                            return axiosResponse.data as IGitlabAPIResponse[T];
                        default:
                            throw new GitlabError();
                    }
                })
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    if (err instanceof AxiosError) {
                        if (err.code === 'ECONNREFUSED') {
                            return reject(new GitlabNoConnection());
                        }
                        return reject(new GitlabError(err.response?.statusText));
                    }
                    reject(err);
                });
        });
    }

    public setToken(token?: string) {
        if (!token) {
            token = process.env.GITLAB_TOKEN as string;
        }
        if (!this._params.query) {
            this._params.query = {};
        }
        this._params.query['access_token'] = token;
        return this;
    }

    private _prepareUrl(url: string) {
        if (!this._params.params) {
            return url;
        }
        let urlCopy = url;
        const urlParamsPatterns = urlCopy.match(/:[a-z_]+[\d\w]*/gim);
        if (urlParamsPatterns) {
            urlParamsPatterns.forEach((paramPattern) => {
                const paramName = paramPattern.replace(':', '');
                //@ts-ignore
                if (paramName in this._params.params) {
                    //@ts-ignore
                    urlCopy = urlCopy.replace(paramPattern, this._params.params[paramName]);
                }
            });
        }
        return urlCopy;
    }

    private _serializeQueryParams(params: { [key: string]: string | number | boolean }) {
        if (params === undefined || Object.keys(params).length === 0) return '';
        return Object.keys(params)
            .reduce((result, paramName) => {
                return result + `&${paramName}=${String(params[paramName])}`;
            }, '')
            .slice(1);
    }
}
