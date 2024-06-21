import EventEmitter from 'events'
import Token from '../oauth/Token'
import PortalnesiaError from "../exception/PortalnesiaException";
import {version} from '../version';
import OAuth from '../oauth';
import { IScopes } from '../oauth/types';
import axios,{AxiosRequestConfig,AxiosInstance, AxiosError} from 'axios'; 

export interface PortalnesiaOptions {
  client_id: string;
  client_secret?: string;
  version?: number;
  redirect_uri?: string,
  request?:{
    headers?: Record<string,string>
  },
  scope: IScopes[],
  axios?: AxiosRequestConfig
}

export type ISeen = {
  number: number,
  format: string
}

export type IDate = {
  format:string,
  timestamp: number
} | null

export type ApiErrorTypes = {
  name: string,
  code: number,
  description: string
}

export interface ResponseData<R> {
  error: ApiErrorTypes,
  data: R;
  message: string;
}

export type ResponsePagination<D> = {
  page: number,
  total_page: number,
  can_load:boolean,
  total: number,
  data: D[]
}

type IReequest = {
  force?: boolean,
  autoRefreshToken?: boolean
}

export default class Portalnesia extends EventEmitter {
  /**
   * Token
   * @property {@link AccessToken}
   * @protected
   */
  protected tokens?: Token
  
  /**
  * API Version
  * @property string
  * @readonly
  */
  readonly version: string;
   
  /**
  * Portalnesia Options
  * @property object {@link PortalnesiaOptions}
  * @readonly
  */
  readonly options: PortalnesiaOptions

  oauth: OAuth
  private axios: AxiosInstance;

  static API_URL = "https://api.portalnesia.com";
  static ACCOUNT_URL = "https://accounts.portalnesia.com"

  constructor(options: PortalnesiaOptions) {
    super();
    this.options = options;
    this.version = `v${options.version||1}`;
    this.oauth = new OAuth(this);
    this.axios = axios.create(options.axios);
  }

  /**
   * Token
   * @property {@link AccessToken}
   * @readonly
  */
   get token() {
    return this.tokens;
  }
 
  /**
  * Internal function. If you want to set token, go to {@link OAuth.setToken | OAuth} instead
  * @internal
  * @param {Token} token 
  */
   setToken(token: Token) {
     this.tokens = token;
   }

  /**
  * Send request to Portalnesia
  * @template D Response Data for type D
  * @template B Body request
  * @param {string} method HTTP method
  * @param {string} url Portalnesia API URL
  * @param {B} body body/url params
  * @param {AxiosRequestConfig} axios optional axios options
  * @returns {Promise<D>} Promise of D
  */
  async request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,axios?: AxiosRequestConfig,options?:IReequest): Promise<D> {
    if(typeof this[method] !== 'function') throw new Error();
    await this.validateToken(options?.force,options?.autoRefreshToken);
    return await this[method]<D>(`${Portalnesia.API_URL}/${this.version}${url}`,body,axios);
  }
 
  /**
  * 
  * @template D Response Data for type D
  * @param {string} url Portalnesia API URL
  * @param {FormData} body body/url params
  * @param {AxiosRequestConfig} axios Axios options
  */
  async upload<D=any>(url: string,body?:FormData,axios?: AxiosRequestConfig): Promise<D> {
    try {
      await this.validateToken();
      const opt = this.getAxiosOpts(true,axios);
      const response = await this.axios.post<ResponseData<D>>(`${Portalnesia.API_URL}/${this.version}${url}`,body,opt);

      const r = response.data;
      if(r.error) throw new PortalnesiaError(r);
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
 
  private async validateToken(force?:boolean,autoRefreshToken=true) {
    if(!this.tokens) {
      if(!force) throw new PortalnesiaError("Missing token");
    } else {
      if(this.tokens.isExpired() && autoRefreshToken) {
        const token = await this.oauth.refreshToken();
        this.setToken(token);
      }
    }
    return Promise.resolve();
  }

  /**
   * @private
   * @internal
   * @param {any} e Error
   * @returns {PortalnesiaError} PortalnesiaError
   */
  catchError<D>(e: any): PortalnesiaError {
    if(e instanceof PortalnesiaError) return e;
    if(e?.response) {
      const err = e as AxiosError<ResponseData<D>>;
      if(axios.isCancel(err)) {
        return new PortalnesiaError("Canceled")
      }
      if(err?.code === 'ECONNABORTED') {
        return new PortalnesiaError("Connection timeout")
      }
      if(err.response?.data) {
        return new PortalnesiaError(err.response.data,undefined,undefined,err.response.status);
      }
    }
    return new PortalnesiaError(e?.message,"Token error")
  }
 
  private getAxiosOpts(withUpload?:boolean,axios?: AxiosRequestConfig) {
    const token = this.tokens
    const config: AxiosRequestConfig = {
      ...axios,
      headers:{
        ...axios?.headers,
        ...(withUpload ? {
          'Content-type':'multipart/form-data'
        } : {}),
        'Accept':'application/json',
        'X-SDK-Version':`Portalnesia JS v${version}`,
        ...(token ? {'Authorization': `Bearer ${token.token.access_token}`} : {}),
        'PN-Client-Id': this.options.client_id,
      }
    }
    return config;
  }
  private async get<D>(url: string,body?:any,axios?: AxiosRequestConfig) {
    try {
      const opt = this.getAxiosOpts(false,axios);
      const response = await this.axios.get<ResponseData<D>>(url,opt);

      const r = response.data;
      if(r.error) throw new PortalnesiaError(r);
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async delete<D>(url: string,body?:any,axios?: AxiosRequestConfig) {
    try {
      const opt = this.getAxiosOpts(false,axios);
      const response = await this.axios.delete<ResponseData<D>>(url,opt);

      const r = response.data;
      if(r.error) throw new PortalnesiaError(r);
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async put<D>(url: string,body?:Record<string,any>,axios?: AxiosRequestConfig) {
    try {
      const opt = this.getAxiosOpts(false,axios);
      const response = await this.axios.put<ResponseData<D>>(url,body,opt);

      const r = response.data;
      if(r.error) throw new PortalnesiaError(r);
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async post<D>(url: string,body?:any,axios?: AxiosRequestConfig) {
    try {
      const opt = this.getAxiosOpts(false,axios);
      const response = await this.axios.post<ResponseData<D>>(url,body,opt);

      const r = response.data;
      if(r.error) throw new PortalnesiaError(r);
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
}