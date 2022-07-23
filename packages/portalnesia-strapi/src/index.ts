// Module dependencies & types
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import qs from "qs";
import Cookies,{CookieAttributes} from "js-cookie";
import dayjs from "dayjs";

export interface StoreConfig {
  /**
   * Cookie key
   * @default portalnesia_jwt
   */
  key: string;
  /**
   * Cookie Options from js-cookie
   */
  cookieOptions?: CookieAttributes;
}
/**
* Portalnesia User Interface
*/
export interface PortalnesiaUser {
  id: number;
  name: string;
  username: string;
  picture: string;
  email: string;
  telephone?: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface PortalnesiaOptions {
  /**
   * Base Strapi Server URL
   * @default http://localhost:1337
   */
  url: string;
  /**
   * API prefix
   * @default /api
   */
  prefix?: string;
  store?: StoreConfig;
  axiosOptions?: AxiosRequestConfig;
}
/**
* Strapi Error Interface
* @typeParam E Custom Error Details
*/
export interface StrapiError<E = any> {
  data: null;
  error: {
      status: number;
      name: string;
      message: string;
      details: E;
  };
}

export type MetaPagination<Pagination extends boolean = false> = Pagination extends true ? {
  pagination: {
      /**
       * Current page
       */
      page: number;
      /**
       * Total data in 1 page
       */
      pageSize: number;
      /**
       * Total pages
       */
      pageCount: number;
      /**
       * Total data
       */
      total: number;
  };
} : {};

/**
 * @typeParam T Data
 * @typeParam Pagination if true, {@link MetaPagination | Pagination}
 * @typeParam E Error Details
 */
 export interface StrapiResponse<T, Pagination extends boolean, E = any> {
  data: Pagination extends true ? T[] : T;
  meta: MetaPagination<Pagination>;
  error?: StrapiError<E>['error'];
}

export interface StrapiAuthenticationResponse {
  user: PortalnesiaUser;
  /**
   * Refresh token
   */
  refresh: string;
  /**
   * JWT token
   */
  jwt: string;
  /**
   * JWT expired in unix
   */
  expired: number;
}

const defaults: Required<PortalnesiaOptions> = {
  url: "http://localhost:1337",
  prefix: "/api",
  store: {
    key: "portalnesia_jwt",
    cookieOptions: { path: "/",secure: process.env.NODE_ENV === 'production',sameSite:'lax',expires:7 },
  },
  axiosOptions: {},
};

/**
 * Portalnesia Strapi Javascript SDK
 */
 class Portalnesia {
  /**
   * Portalnesia Options
   */
  options: Required<PortalnesiaOptions>;
  /**
   * @private
   */
  axios: AxiosInstance;
  /**
   * @private
   */
  _user?: PortalnesiaUser;
  /**
   * @private
   */
  _url: string;

constructor(options: PortalnesiaOptions) {
    this.options = {
      ...defaults,
      ...(options || {}),
      store: {
        ...defaults.store,
        ...(options?.store || {}),
        cookieOptions: {
          ...defaults.store.cookieOptions,
          ...(options?.store?.cookieOptions)
        }
      }
    };
    this._url = new URL(this.options.prefix || '', this.options.url).href;
    this.axios = axios.create({
      baseURL: this._url,
      paramsSerializer: qs.stringify,
      ...this.options.axiosOptions,
    });
    this.axios.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token.jwt}`,
        };
      }
      return config;
    });
  }
  /**
   * API URL for strapi
   */
  get url() {
    return this._url;
  }
  /**
   * Current user object
   */
  get user() {
    return this._user;
  }
  /**
   * Get saved token from cookie
   * @param {string?} cookie Cookie values, if server side
   * @returns {StrapiAuthenticationResponse|undefined} Token or Undefined
   */
  getToken(cookie?: string): StrapiAuthenticationResponse | undefined {
    const { key } = this.options.store;
    const token = typeof window !== 'undefined' ? Cookies.get(key) : cookie ? cookie : undefined;
    if (!token) return undefined;
    const tokenObj = JSON.parse(token);
    this._user = tokenObj.user;
    return tokenObj;
  }
  /**
   * Save token to cookies.
   *
   * The {@link login | login} and {@link refreshToken | refreshToken} method already handle this
   * @param {StrapiAuthenticationResponse} token Response token
   */
  setToken(token: StrapiAuthenticationResponse) {
    const { key, cookieOptions } = this.options.store;
    const tokenObj = JSON.stringify(token);
    this._user = token.user;
    Cookies.set(key, tokenObj, cookieOptions);
  }
  /**
   * Remove token from cookies
   * The {@link logout | logout} method already handle this
   */
  removeToken() {
    const { key } = this.options.store;
    this._user = undefined;
    Cookies.remove(key);
  }
  /**
   * Logout user and remove token
   */
  logout() {
    this._user = undefined;
    this.removeToken();
  }
  /**
   * Get Portalnesia Authorization URL
   * @returns {string} Authorization URL
   */
  getAuthUrl(): string {
    return `${this._url}/connect/portalnesia`;
  }
  /**
   * Login user with access token returned from authentication server
   * @param {string} access_token
   * @returns {Promise<StrapiAuthenticationResponse>} Token
   * @throws {@link StrapiError}
   */
  async login(access_token?: string): Promise<StrapiAuthenticationResponse> {
    this.removeToken();
    const params = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
    });
    const { user, ...rest } = await this.authRequest("get", `/auth/portalnesia/callback`, {
      params,
    });
    this.setToken({ user, ...rest });
    this._user = user;
    return { user, ...rest };
  }
  /**
   * @private
   * @internal
   */
  async refreshToken(refresh: string) {
    this.removeToken();
    const { user, ...rest } = await this.authRequest<StrapiAuthenticationResponse>("post", `/auth/refresh`, {
      data: {
        refresh
      }
    });
    this.setToken({ user, ...rest });
    this._user = user;
    return { user, ...rest };
  }
  /**
   * @private
   * @internal
   */
  async authRequest<T = any>(method: Method, url: string, axiosConfig?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axios.request<T>({
        method,
        url,
        ...axiosConfig,
      });
      return response.data;
    }
    catch (error) {
      const e = error as AxiosError;
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
      }
      else {
        throw e.response.data;
      }
    }
  }
  /**
   * Run Endpoint request
   * @typeParam T - Response Data
   * @typeParam Pagination - if true, {@link MetaPagination | Pagination}
   * @typeParam E - Custom error details
   * @param {Method} method
   * @param {string} url URL after prefix
   * @param {AxiosRequestConfig} axiosConfig
   * @returns {Promise<StrapiResponse<T,Pagination,E>>} Responses
   * @throws {@link StrapiError}
   */
  async request<T = any, Pagination extends boolean = false, E = any>(method: Method, url: string, axiosConfig?: AxiosRequestConfig): Promise<StrapiResponse<T, Pagination, E>> {
    try {
      if (this._user) {
        const token = this.getToken();
        if (token) {
          if (dayjs.unix(token.expired).diff(dayjs(), 'hour') <= 5) {
            await this.refreshToken(token.refresh);
          }
        }
      }
      const response = await this.axios.request({
        method,
        url,
        ...axiosConfig,
      });
      const data = response.data;
      if (data.error) throw { response: { data } };
      return response.data;
    }
    catch (error) {
      const e = error as AxiosError
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
      }
      else {
        throw e.response.data;
      }
    }
  }
}

export default Portalnesia;
