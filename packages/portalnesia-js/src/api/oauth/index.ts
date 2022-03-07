/**
 * @module
 * Portalnesia OAuth API
 */
import PortalnesiaError from "@src/exception/PortalnesiaException";
import BaseApi,{ACCOUNT_URL,Portalnesia} from "../base";
import {ModuleOptions,AuthorizationCode,ClientCredentials,Token, AccessToken} from 'simple-oauth2'
import pkceChallenge from 'pkce-challenge'
import IdTokenVerifier from 'idtoken-verifier'

export type IScopes = "basic" | "openid" |  "email" |  "blog" |  "comments" |  "chord" | "files" |  "geodata" |  "likes" |  "messages" |  "quiz" |  "toko" |  "twibbon" |  "thread" |  "url-shortener" | "user"

export type IGrantType = "authorization_code" | "client_credentials"


export type AuthorizationOptions = {
    scope?: IScopes[],
    state?: string
    code_challenge?: string
}
export type AuthorizationResponse = {
    code?: string,
    state?: string,
    error?: string
}

export type TokenOptions = {
    grant_type: IGrantType,
    code?: string,
    code_verifier?: string
    scope?: string[]
}
export type RevokeTokenOptions = {refresh_token?:string,access_token?:string}

export type TokenResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    id_token?: string,
    refresh_token: string
}
export type TokenErrorResponse = {
    error: string,
    error_description: string,
    error_uri?: string
}
export type RevokeResponse = {
    revoked: boolean
}

export type TokenType = 'refresh_token'|'access_token'

declare module 'simple-oauth2' {
    export interface AuthorizationTokenConfig {
        [key: string]: string|undefined
    }
    export interface Token extends TokenResponse {
        
    }
}

/**
 * Portalnesia OAuth2 Service
 * @class OAuth
 * @extends {BaseApi}
 */
export default class OAuth extends BaseApi {
    private client_auth: AuthorizationCode
    private client_creds: ClientCredentials

    constructor(portalnesia: Portalnesia) {
        super(portalnesia);
        const config: ModuleOptions = {
            client:{
                id:portalnesia.options.client_id,
                secret:portalnesia.options.client_secret||'',
            },
            auth:{
                tokenHost:ACCOUNT_URL,
                tokenPath:'/oauth/token',
                revokePath:'/oauth/revoke',
                authorizeHost:ACCOUNT_URL,
                authorizePath:'/oauth/authorize'
            }
        }
        this.client_auth = new AuthorizationCode(config);
        this.client_creds = new ClientCredentials(config)
    }

    /**
     * `authorization_code`
     * 
     * Get Portalnesia Authorization URL
     * @param {AuthorizationOptions} options {@link AuthorizationOptions | Authorization Options}
     * @returns {string} Portalnesia Authorization URL
     */
    getAuthorizationUrl(options: AuthorizationOptions): string {
        return this.client_auth.authorizeURL({client_id:this.pn.options.client_id,redirect_uri:this.pn.options.redirect_uri,...options})
    }

    /**
     * `authorization_code`
     * 
     * Generate Code Verifier and Code Challenge
     * @returns {{
     *  code_challenge: string,
     *  code_verifier: string
     * }} {
     *  code_challenge: string,
     *  code_verifier: string
     * }
     * 
     */
    generatePKCE(): {
        code_challenge: string;
        code_verifier: string;
    } {
        return pkceChallenge();
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Set token from previously saved token
     * @param {IGrantType} grantTypes {@link IGrantType | Grant type}
     * @param {TokenResponse} token {@link TokenResponse | Token object}
     */
    setToken(grantTypes: IGrantType,token: Token) {
        let tokens: AccessToken;
        if(grantTypes === 'authorization_code') {
            tokens = this.client_auth.createToken(token);
        } else {
            tokens = this.client_creds.createToken(token);
        }
        this.pn.setToken(tokens)
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Get {@link TokenResponse | Token Object} from Portalnesia OAuth2 Server
     * @param {TokenOptions} options {@link TokenOptions | Token Options}
     * @returns {Promise<TokenResponse>} token {@link TokenResponse | Token Object}
     * @throws {PortalnesiaError} Error {@link PortalnesiaError}
     */
    async getToken(options: TokenOptions): Promise<TokenResponse> {
        const {grant_type,code,scope:scopes,...rest} = options;
        if(grant_type === 'client_credentials' && !this.pn.options.client_secret) throw new PortalnesiaError("Missing `client_secret`","OAuth2")
        const scope = scopes ? scopes.join(" ") : "";

        if(grant_type === 'authorization_code') {
            try {
                const token = await this.client_auth.getToken({code:code||'',client_id:this.pn.options.client_id,redirect_uri:this.pn.options.redirect_uri||'',scope,...rest});
                this.pn.setToken(token);
                return token.token;
            } catch(e: any) {
                if(e?.data?.isResponseError) {
                    const payload = e?.data?.payload;
                    payload.name="OAuth2";
                    throw new PortalnesiaError(payload)
                } else throw new PortalnesiaError(e?.message,"OAuth2")
            }
        } else {
            try {
                const token = await this.client_creds.getToken({client_id:this.pn.options.client_id,redirect_uri:this.pn.options.redirect_uri||'',scope});
                this.pn.setToken(token);
                return token.token;
            } catch(e: any) {
                if(e?.data?.isResponseError) {
                    const payload = e?.data?.payload;
                    payload.name="OAuth2";
                    throw new PortalnesiaError(payload)
                } else throw new PortalnesiaError(e?.message,"OAuth2")
            }
        }
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Refreshes the current access token
     * @returns {Promise<TokenResponse>} token {@link TokenResponse | Token Object}
     * @throws {PortalnesiaError} Error {@link PortalnesiaError}
     */
    async refreshToken(): Promise<TokenResponse> {
        if(!this.pn.token) throw new PortalnesiaError("Missing `token`","OAuth2")
        
        try {
            // @ts-ignore
            const token = await this.pn.token.refresh({client_id:this.pn.options.client_id},{
                headers:{
                    "PN-Client-Id":this.pn.options.client_id
                }
            });
            this.pn.setToken(token);
            return token.token;
        } catch(e: any) {
            if(e?.data?.isResponseError) {
                const payload = e?.data?.payload;
                payload.name="OAuth2";
                throw new PortalnesiaError(payload)
            } else throw new PortalnesiaError(e?.message,"OAuth2")
        }
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Revokes either the access or refresh token or both
     * @param {TokenType} type {@link TokenType | Token Type}
     * @returns {Promise<void>} void
     */
    async revokeToken(type?: TokenType): Promise<void> {
        if(!this.pn.token) throw new PortalnesiaError("Missing `token`","OAuth2");

        try {
            // @ts-ignore
            if(type) await this.pn.token.revoke(type,{
                headers:{
                    "PN-Client-Id":this.pn.options.client_id
                }
            })
            // @ts-ignore
            else await this.pn.token.revokeAll({
                headers:{
                    "PN-Client-Id":this.pn.options.client_id
                }
            });
            return;
        } catch(e) {
            return;
        }
    }

    /**
     * Verify id_token
     * @param {string} idtoken id_token retrieved from `access_token`
     * @returns {object|null} payload object if any, or null 
     */
    verifyIdToken(idtoken: string): Promise<object|null> {
        const verifier = new IdTokenVerifier({
            issuer:'https://portalnesia.com',
            jwksURI:'https://api.portalnesia.com/v1/certs',
            audience:this.pn.options.client_id
        })
        return new Promise<object|null>((res,rej)=>{
            verifier.verify(idtoken,(err,payload)=>{
                if(err) rej(new PortalnesiaError(err?.message,err?.name));
                res(payload);
            })
        })
    }
}