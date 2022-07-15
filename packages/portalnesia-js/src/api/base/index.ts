import { AxiosRequestConfig } from "axios";
import Portalnesia from '@src/server'

export interface PortalnesiaOptions {
    client_id: string;
    client_secret?: string;
    axios?: AxiosRequestConfig;
    version?: number;
    redirect_uri?: string,
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


export default class BaseApi {
  /**
   * Portalnesia Instance
   * @property {@link Portalnesia | Portalnesia Instance}
   */
  pn: Portalnesia

  /**
   * 
   * @param {Portalnesia} portalnesia {@link Portalnesia | Portalnesia Instance} 
   */
  constructor(portalnesia: Portalnesia) {
    this.pn = portalnesia
  }

  protected getFullUrl(path?: string,type:'api'|'accounts'='api') {
    return this.pn.getFullUrl(path,type)
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
  protected request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,axiosOptions?: AxiosRequestConfig): Promise<D> {
    return this.pn.request(method,url,body,axiosOptions);
  }

  /**
   * 
   * @typeParam D Response Data for type D
   * @param {string} url Portalnesia API URL
   * @param {FormData} body body/url params
   * @param {AxiosRequestConfig} axiosOptions optional axios options
   */
  protected async upload<D=any>(url: string,body?:FormData,axiosOptions?: AxiosRequestConfig): Promise<D> {
    return this.pn.upload(url,body,axiosOptions)
  }
}