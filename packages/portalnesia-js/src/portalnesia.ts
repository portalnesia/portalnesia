import axiosStatic,{ AxiosInstance,AxiosError,CancelTokenSource, AxiosRequestConfig } from "axios";
import getAxiosInstance from "@src/axios";
import { PortalnesiaOptions,ResponseData,ApiErrorTypes } from "./type";
import qs from 'qs'
import PortalnesiaError from "./exception/PortalnesiaException";
import { TokenOptions, TokenResponse } from "./api/oauth/type";

class CatchApiError extends Error {
    code?: number|string;
    constructor(dt: ResponseData<any>) {
        let msg="";
        if(typeof dt?.error === 'boolean') {
            msg = dt?.message;
        } else {
            msg = dt?.error?.description
        }
        super(msg);
        if(typeof dt?.error?.code !== 'undefined') {
            this.code=dt?.error?.code;
        }
        this.name=dt?.error?.name;
    }
}

class Portalnesia {
    client_id: string;
    client_secret?: string;
    token?: TokenResponse
    refresh_token?: string;
    version: string;
    axios: AxiosInstance;
    options: PortalnesiaOptions
    cancelToken: CancelTokenSource;

    static API_URL = "https://api.portalnesia.com";
    static ACCOUNT_URL = "https://accounts.portalnesia.com"

    constructor(opt: PortalnesiaOptions) {
        this.options = opt;
        this.client_id = opt.client_id;
        this.client_secret = opt.client_secret
        this.axios = getAxiosInstance(opt.axios);
        this.version = `v${opt.version||1}`;
        const cancelToken=axiosStatic.CancelToken;
        this.cancelToken=cancelToken.source();
    }

    getFullUrl(path?: string,type:'api'|'accounts'='api') {
        if(type === 'accounts') return `https://accounts.portalnesia.com${path}`
        return `https://api.portalnesia.com/${this.version}${path}`
    }

    /**
     * Send request to Portalnesia
     * @param method HTTP method
     * @param url Portalnesia API URL
     * @param body body/url params
     * @param axiosOptions optional axios options
     * @template D Response Data for type D
     */
    request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,axiosOptions?: AxiosRequestConfig): Promise<D> {
        this.validateToken();
        if(typeof this[method] !== 'function') throw new Error();
        return this[method]<D>(url,body,axiosOptions);
    }

    /**
     * 
     * @param url 
     * @param method HTTP method
     * @param url Portalnesia API URL
     * @param body body/url params
     * @param axiosOptions optional axios options
     * @template D Response Data for type D
     */
    async upload<D=any>(url: string,body?:FormData,axiosOptions?: AxiosRequestConfig): Promise<D> {
        this.validateToken();
        try {
            const r = await this.axios.post<ResponseData<D>>(url,body,this.getAxiosOpts(axiosOptions,true))
            if(r?.data?.error) {
                throw new CatchApiError(r?.data)
            }
            return r.data.data;
        } catch(e) {
            return this.catchError(e) as unknown as D
        }
    }
    private validateToken() {
        if(!this.token) throw new PortalnesiaError("Missing token");
    }
    catchError(err: any) {
        if(err instanceof CatchApiError) {
            throw new PortalnesiaError(err.message,err.name,err.code)
        } else {
            const e = err as AxiosError;
            if(axiosStatic.isCancel(e)) {
                throw new PortalnesiaError("Request canceled")
            } else if(e?.code === 'ECONNABORTED') {
                throw new PortalnesiaError("Connection timeout")
            } else {
                if(e?.response?.data?.error) {
                    if(e?.response?.data?.error_description) {
                        throw new PortalnesiaError(e?.response?.data?.error_description,e?.response?.data?.error)
                    }
                    const err = e?.response?.data?.error as ApiErrorTypes;
                    throw new PortalnesiaError(err.description,err.name,err.code);
                }
                throw new PortalnesiaError("Someting went wrong")
            }
        }
    }
    private getAxiosOpts(options?: AxiosRequestConfig,withUpload?:boolean) {
        const token = this.token as TokenResponse
        const config: AxiosRequestConfig = {
            ...options,
            headers:{
                ...options?.headers,
                ...(withUpload ? {
                    'Content-Type':'multipart/form-data'
                } : {}),
                'Authentication': `Bearer ${token.access_token}`,
                'PN-Client-Id': this.client_id
            },
            cancelToken:this.cancelToken.token,
        }
        return config;
    }
    private async get<D>(url: string,body?:any,axiosOptions?: AxiosRequestConfig) {
        const fullUrl = `${url}${body ? qs.stringify(body) : ''}`
        try {
            const r = await this.axios.get<ResponseData<D>>(fullUrl,this.getAxiosOpts(axiosOptions))
            if(r?.data?.error) {
                throw new CatchApiError(r?.data)
            }
            return r.data.data;
        } catch(e) {
            return this.catchError(e) as unknown as D
        }
    }
    private async delete<D>(url: string,body?:any,axiosOptions?: AxiosRequestConfig) {
        const fullUrl = `${url}${body ? qs.stringify(body) : ''}`
        try {
            const r = await this.axios.delete<ResponseData<D>>(fullUrl,this.getAxiosOpts(axiosOptions));
            if(r?.data?.error) {
                throw new CatchApiError(r?.data)
            }
            return r.data.data;
        } catch(e) {
            return this.catchError(e) as unknown as D
        }
    }
    private async put<D>(url: string,body?:any,axiosOptions?: AxiosRequestConfig) {
        try {
            const r = await this.axios.put<ResponseData<D>>(url,body,this.getAxiosOpts(axiosOptions));
            if(r?.data?.error) {
                throw new CatchApiError(r?.data)
            }
            return r.data.data;
        } catch(e) {
            return this.catchError(e) as unknown as D
        }
    }
    private async post<D>(url: string,body?:any,axiosOptions?: AxiosRequestConfig) {
        try {
            const r = await this.axios.post<ResponseData<D>>(url,body,this.getAxiosOpts(axiosOptions));
            if(r?.data?.error) {
                throw new CatchApiError(r?.data)
            }
            return r.data.data;
        } catch(e) {
            return this.catchError(e) as unknown as D
        }
    }
}

export default Portalnesia;