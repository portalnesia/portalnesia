import { PortalnesiaOptions,ResponseData,ApiErrorTypes } from "@src/api/base";
import axiosStatic,{ AxiosInstance,AxiosError,CancelTokenSource, AxiosRequestConfig } from "axios";
import getAxiosInstance from "@api/base/axios";
import qs from 'qs'
import OAuth from "./api/oauth";
import PortalnesiaError from "@src/exception/PortalnesiaException";
import CatchApiError from '@src/exception/ApiException'
import { AccessToken } from "simple-oauth2";

export * from '@api/base'
export * from './api/oauth'

/**
 * Portalnesia Client Instance
 * @class Portalnesia
 */
class Portalnesia {
  /**
  * Token
  * @property {@link AccessToken}
  * @private
  */
  private tokens?: AccessToken
  
  /**
  * API Version
  * @property string
  * @readonly
  */
  readonly version: string;
  
  /**
  * Axios instance
  * @property object {@link AxiosInstance}
  * @private
  */
  private axios: AxiosInstance;
  
  /**
  * Portalnesia Options
  * @property object {@link PortalnesiaOptions}
  * @readonly
  */
  readonly options: PortalnesiaOptions
  
  private cancelToken: CancelTokenSource;
  readonly oauth: OAuth

  static API_URL = "https://api.portalnesia.com";
  static ACCOUNT_URL = "https://accounts.portalnesia.com"

  /**
 * @constructor
 * @param options {@link PortalnesiaOptions | Portalnesia Options}
 */
  constructor(options: PortalnesiaOptions) {
    this.options = options;
    this.axios = getAxiosInstance(options.axios);
    this.version = `v${options.version||1}`;
    const cancelToken=axiosStatic.CancelToken;
    this.cancelToken=cancelToken.source();
    this.oauth = new OAuth(this as any)
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
   * @param {AccessToken} token 
   */
  setToken(token: AccessToken) {
    this.tokens = token;
  }

  /**
   * Send request to Portalnesia
   * @typeParam D Response Data for type D
   * @typeParam B Body request
   * @param {string} method HTTP method
   * @param {string} url Portalnesia API URL
   * @param {B} body body/url params
   * @param {AxiosRequestConfig} axiosOptions optional axios options
   * @returns {Promise<D>} Promise of D
   */
  request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,axiosOptions?: AxiosRequestConfig): Promise<D> {
    this.validateToken();
    if(typeof this[method] !== 'function') throw new Error();
    return this[method]<D>(url,body,axiosOptions);
  }

  /**
   * 
   * @template D Response Data for type D
   * @param {string} url Portalnesia API URL
   * @param {FormData} body body/url params
   * @param {AxiosRequestConfig} axiosOptions optional axios options
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
    if(!this.tokens || this.tokens.expired()) throw new PortalnesiaError("Missing token");
  }

  private catchError(err: any) {
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
    const token = this.tokens as AccessToken
    const config: AxiosRequestConfig = {
      ...options,
      headers:{
          ...options?.headers,
          ...(withUpload ? {
              'Content-Type':'multipart/form-data'
          } : {}),
          'Authentication': `Bearer ${token.token.access_token}`,
          'PN-Client-Id': this.options.client_id
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

export {OAuth}
export default Portalnesia;