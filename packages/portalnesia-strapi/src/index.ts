import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import axios from 'axios'
import type { CookieAttributes } from "js-cookie";
import qs from "qs";
import Cookies from 'js-cookie'

export interface StoreConfig {
  key: string;
  cookieOptions?: CookieAttributes;
}

export interface PortalnesiaUser {
  id: number;
  name: string
  username: string;
  picture: string
  email: string;
  telephone?: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortalnesiaOptions {
  url: string;
  prefix?: string;
  store?: StoreConfig;
  axiosOptions?: AxiosRequestConfig;
}

const defaults: Required<PortalnesiaOptions> = {
  url: "http://localhost:1337",
  prefix: "/api",
  store: {
    key: "portalnesia_jwt",
    cookieOptions: { path: "/",sameSite:'lax',expires:14,secure: process.env.NODE_ENV === 'production' },
  },
  axiosOptions: {},
};

export interface StrapiError<E=any> {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: E;
  };
}

type MetaPagination<Pagination extends boolean = false> = Pagination extends true ? {
  pagination:{
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
} : {}

export interface StrapiResponse<T,Pagination extends boolean,E=any> {
  data: Pagination extends true ? T[] : T;
  meta: MetaPagination<Pagination>;
  error?: StrapiError<E>['error']
}

export interface StrapiAuthenticationResponse {
  user: PortalnesiaUser;
  refresh: string,
  jwt: string;
  expired: number
}


export default class Portalnesia {
  options: Required<PortalnesiaOptions>
  private axios: AxiosInstance
  private _user?: PortalnesiaUser
  _url: string

  constructor(options?: PortalnesiaOptions) {
    this.options = {
      ...defaults,
      ...(options||{}),
      store:{
        ...defaults.store,
        ...(options?.store||{}),
        cookieOptions:{
          ...defaults.store.cookieOptions,
          ...(options?.store?.cookieOptions)
        }
      }
    };

    this._url = new URL(this.options.prefix||'', this.options.url).href
    this.axios = axios.create({
      baseURL: this._url,
      paramsSerializer: qs.stringify,
      ...this.options.axiosOptions,
    });
  }

  get url() {
    return this._url
  }

  get user() {
    return this._user
  }

  public getToken(cookie?: string): StrapiAuthenticationResponse | undefined {
    const { key } = this.options.store;
    const token = typeof window !== 'undefined' ? Cookies.get(key) : cookie ? cookie : undefined
    if(!token) return undefined;
    const tokenObj = JSON.parse(token) as StrapiAuthenticationResponse;
    this._user = tokenObj.user
    return tokenObj;
  }

  public setToken(token: StrapiAuthenticationResponse): void {
    const { key, cookieOptions } = this.options.store;
    const tokenObj = JSON.stringify(token)
    this._user = token.user
    Cookies.set(key, tokenObj, cookieOptions);
  }

  public removeToken(): void {
    const { key } = this.options.store;
    this._user = undefined;
    Cookies.remove(key);
  }

  public logout(): void {
    this._user = undefined;
    this.removeToken();
  }

  public getAuthUrl() {
    return `${this._url}/connect/portalnesia`
  }

  public async login(
    access_token?: string
  ): Promise<StrapiAuthenticationResponse> {
    this.removeToken();
    const params = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    if (params.access_token) access_token = params.access_token as string;
    // @ts-ignore
    const { user, ...rest }: StrapiAuthenticationResponse = await this.request(
      "get",
      `/auth/portalnesia/callback`,
      {
        params: { access_token },
      }
    );
    this.setToken({user,...rest});
    this._user = user;
    return { user,...rest};
  }

  public async request<T=any,Pagination extends boolean = false>(
    method: Method,
    url: string,
    axiosConfig?: AxiosRequestConfig
  ): Promise<StrapiResponse<T,Pagination>> {
    try {
      const response: AxiosResponse<StrapiResponse<T,Pagination>> = await this.axios.request<StrapiResponse<T,Pagination>>({
        method,
        url,
        ...axiosConfig,
      });
      const data = response.data;
      if(data.error) throw {response:{data}};
      return response.data;
    } catch (error) {
      const e = error as AxiosError<StrapiError>;

      if (!e.response) {
        throw {
          data: null,
          error: {
            status: 500,
            name: "UnknownError",
            message: e.message,
            details: e,
          },
        };
      } else {
        throw e.response.data;
      }
    }
  }
}