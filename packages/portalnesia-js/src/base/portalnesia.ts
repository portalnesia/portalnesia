import EventEmitter from 'events'
import Token from '../oauth/Token'
import PortalnesiaError from "../exception/PortalnesiaException";
import qs from 'qs'
import {version} from '../version';
import OAuth from '../oauth';
import fetch from 'isomorphic-unfetch'
import { IScopes } from '../oauth/types';

export interface PortalnesiaOptions {
  client_id: string;
  client_secret?: string;
  version?: number;
  redirect_uri?: string,
  request?:{
    headers?: Record<string,string>
  },
  scope: IScopes[]
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

  static API_URL = "https://api.portalnesia.com";
  static ACCOUNT_URL = "https://accounts.portalnesia.com"

  constructor(options: PortalnesiaOptions) {
    super();
    this.options = options;
    this.version = `v${options.version||1}`;
    this.oauth = new OAuth(this);
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
  * 
  * @internal 
  * @returns {string} string
  */
  getFullUrl(path?: string,type:'api'|'accounts'='api'): string {
    if(type === 'accounts') return `${Portalnesia.ACCOUNT_URL}${path}`
    return `${Portalnesia.API_URL}/${this.version}${path}`
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
  * @param {AxiosRequestConfig} axiosOptions optional axios options
  * @returns {Promise<D>} Promise of D
  */
  async request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,headers?: HeadersInit,force?:boolean): Promise<D> {
    await this.validateToken(force);
    if(typeof this[method] !== 'function') throw new Error();
    return await this[method]<D>(`${Portalnesia.API_URL}/${this.version}${url}`,body,headers);
  }
 
  /**
  * 
  * @template D Response Data for type D
  * @param {string} url Portalnesia API URL
  * @param {FormData} body body/url params
  * @param {HeadersInit} headers Additional headers
  */
  async upload<D=any>(url: string,body?:FormData,headers?: HeadersInit): Promise<D> {
    try {
      await this.validateToken();
      const response = await fetch(`${Portalnesia.API_URL}/${this.version}${url}`,{
        method:"POST",
        body,
        headers:this.getFetchOpts(true,headers),
        mode:'cors'
      })
      const r = await response.json() as ResponseData<D>;
      if(!response.ok) {
        throw new PortalnesiaError(r)
      }
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
 
  private async validateToken(force?:boolean) {
    if(!this.tokens) {
      if(!force) throw new PortalnesiaError("Missing token");
    } else {
      if(this.tokens.isExpired()) {
        await this.oauth.refreshToken();
      }
    }
  }

  private catchError(e: any) {
    if(e instanceof PortalnesiaError) return e;
    if(e?.data?.isResponseError) {
        const payload = e?.data?.payload;
        payload.name="OAuth2";
        return new PortalnesiaError(payload)
    } else return new PortalnesiaError(e?.message,"Token error")
  }
 
  private getFetchOpts(withUpload?:boolean,options?: HeadersInit) {
    if(!this.tokens || this.tokens.isExpired()) throw new PortalnesiaError("Missing token");
    const token = this.tokens
    const config: HeadersInit = {
      ...(this.options.request?.headers ? {...this.options.request.headers} : {}),
      ...options,
      ...(withUpload ? {
          'Content-Type':'multipart/form-data'
      } : {}),
      'Accept-Encoding':'gzip,deflate,br',
      'Accept':'application/json',
      'User-Agent':`Portalnesia JS v${version}`,
      'Authorization': `Bearer ${token.token.access_token}`,
      'PN-Client-Id': this.options.client_id,
    }
    return config;
  }
  private async get<D>(url: string,body?:any,headers?: HeadersInit) {
    try {
      const fullUrl = `${url}${body ? `?${qs.stringify(body)}` : ''}`
      const header = this.getFetchOpts(false,headers);
      const response = await fetch(fullUrl,{
        method:"GET",
        headers:header,
        mode:'cors'
      })
      const r = await response.json() as ResponseData<D>;
      if(!response.ok) {
        throw new PortalnesiaError(r)
      }
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async delete<D>(url: string,body?:any,headers?: HeadersInit) {
    try {
      const fullUrl = `${url}${body ? `?${qs.stringify(body)}` : ''}`
      const header = this.getFetchOpts(false,headers);
      const response = await fetch(fullUrl,{
        method:"DELETE",
        headers:header,
        mode:'cors'
      })
      const r = await response.json() as ResponseData<D>;
      if(!response.ok) {
        throw new PortalnesiaError(r)
      }
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async put<D>(url: string,body?:Record<string,any>,headers?: HeadersInit) {
    try {
      const header = this.getFetchOpts(false,headers);
      const response = await fetch(url,{
        method:"PUT",
        headers:header,
        ...(body ? {body:JSON.stringify(body)} : {}),
        mode:'cors'
      })
      const r = await response.json() as ResponseData<D>;
      if(!response.ok) {
        throw new PortalnesiaError(r)
      }
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
  private async post<D>(url: string,body?:any,headers?: HeadersInit) {
    try {
      const header = this.getFetchOpts(false,headers);
      const response = await fetch(url,{
        method:"POST",
        headers:header,
        ...(body ? {body:JSON.stringify(body)} : {}),
        mode:'cors'
      })
      const r = await response.json() as ResponseData<D>;
      if(!response.ok) {
        throw new PortalnesiaError(r)
      }
      return r.data;
    } catch(e) {
      const err = this.catchError(e);
      throw err;
    }
  }
}