import Portalnesia from './portalnesia'

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

  /**
   * Send request to Portalnesia
   * @template D Response Data for type D
   * @template B Body request
   * @param {string} method HTTP method
   * @param {string} url Portalnesia API URL
   * @param {B} body body/url params
   * @param {HeadersInit} headers optional headers options
   * @returns {Promise<D>} Promise of D
   */
  protected request<D=any,B=any>(method: 'post'|'get'|'delete'|'put',url: string,body?:B,headers?: HeadersInit): Promise<D> {
    return this.pn.request(method,url,body,headers);
  }

  /**
   * 
   * @template D Response Data for type D
   * @param {string} url Portalnesia API URL
   * @param {FormData} body body/url params
   * @param {HeadersInit} headers optional headers options
   */
  protected async upload<D=any>(url: string,body?:FormData,headers?: HeadersInit): Promise<D> {
    return this.pn.upload(url,body,headers)
  }
}

export const API_URL = "https://api.portalnesia.com";
export const ACCOUNT_URL = "https://accounts.portalnesia.com"