/**
 * @module
 * Portalnesia OAuth API
 */
import PortalnesiaError from "../exception/PortalnesiaException";
import {BaseApi,Portalnesia} from "../base";
//import {ModuleOptions,AuthorizationCode,ClientCredentials,Token, AccessToken} from 'simple-oauth2'
import pkceChallenge from 'pkce-challenge'
import IdTokenVerifier from 'idtoken-verifier'
import type {TokenResponse,AuthorizationOptions,TokenOptions} from './types'
import qs from 'qs'
import Token from './Token'
import fetch from 'isomorphic-unfetch'

export {Token}
export * from './types'
/**
 * Portalnesia OAuth2 Service
 * @class OAuth
 * @extends {BaseApi}
 */
export default class OAuth extends BaseApi {
    private auth = {
        tokenUrl:`${Portalnesia.ACCOUNT_URL}/oauth/token`,
        revokeUrl:`${Portalnesia.ACCOUNT_URL}/oauth/revoke`,
        authorizeUrl:`${Portalnesia.ACCOUNT_URL}/oauth/authorize`
    }

    constructor(portalnesia: Portalnesia) {
        super(portalnesia);
    }

    /**
     * `authorization_code`
     * 
     * Get Portalnesia Authorization URL
     * @param {AuthorizationOptions} options {@link AuthorizationOptions | Authorization Options}
     * @returns {string} Portalnesia Authorization URL
     */
    getAuthorizationUrl(options: AuthorizationOptions): string {
        const query = {
            response_type:'code',
            client_id:this.pn.options.client_id,
            redirect_uri: this.pn.options.redirect_uri,
            state:options.state,
            scope:this.pn.options.scope.join(' '),
            code_challenge:options.code_challenge
        }
        return `${this.auth.authorizeUrl}?${qs.stringify(query)}`;
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
     * @param {TokenResponse} token {@link TokenResponse | Token object}
     * @returns {Token} token {@link Token | Token object}
     */
    setToken(token: TokenResponse): Token {
        const tokens = Token.createToken(token);
        this.pn.setToken(tokens)
        return tokens;
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Get {@link TokenResponse | Token Object} from Portalnesia OAuth2 Server
     * @param {TokenOptions} options {@link TokenOptions | Token Options}
     * @returns {Promise<Token>} token {@link Token | Token Object}
     * @throws {PortalnesiaError} Error {@link PortalnesiaError}
     */
    async getToken(options: TokenOptions): Promise<Token> {
        const {grant_type,code,code_verifier} = options;
        if(grant_type === 'client_credentials' && !this.pn.options.client_secret) throw new PortalnesiaError("Missing `client_secret`","OAuth2")

        if(grant_type === 'authorization_code') {
            try {
                const response = await fetch(this.auth.tokenUrl,{
                    method:"POST",
                    body:qs.stringify({
                        client_id:this.pn.options.client_id,
                        grant_type,
                        code,
                        redirect_uri:this.pn.options.redirect_uri,
                        code_verifier,
                    }),
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        'PN-Client-Id':this.pn.options.client_id,
                        ...(!code_verifier && this.pn.options.client_secret ? {
                            'Authorization':`Basic ${Buffer.from(`${this.pn.options.client_id}:${this.pn.options.client_secret}`).toString('base64')}`
                        } : {})
                    }
                })
                const r = await response.json() as TokenResponse;
                if(!response.ok) {
                    throw new PortalnesiaError((r as any)?.error_description||"Something went wrong","OAuth2");
                }
                const token = Token.createToken(r);
                this.pn.setToken(token);
                return token;
            } catch(e: any) {
                if(e instanceof PortalnesiaError) throw e;
                else throw new PortalnesiaError(e?.message,"OAuth2")
            }
        } else {
            try {
                const response = await fetch(this.auth.tokenUrl,{
                    method:"POST",
                    body:qs.stringify({
                        grant_type,
                        client_id:this.pn.options.client_id,
                        code,
                        redirect_uri:this.pn.options.redirect_uri
                    }),
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        'PN-Client-Id':this.pn.options.client_id,
                        'Authorization':`Basic ${Buffer.from(`${this.pn.options.client_id}:${this.pn.options.client_secret}`).toString('base64')}`
                    }
                })
                const r = await response.json() as TokenResponse;
                if(!response.ok) {
                    throw new PortalnesiaError((r as any)?.error_description||"Something went wrong","OAuth2");
                }
                const token = Token.createToken(r);
                this.pn.setToken(token);
                return token;
            } catch(e: any) {
                if(e instanceof PortalnesiaError) throw e;
                else throw new PortalnesiaError(e?.message,"OAuth2")
            }
        }
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Refreshes the current access token
     * @returns {Promise<Token>} token {@link Token | Token Object}
     * @throws {PortalnesiaError} Error {@link PortalnesiaError}
     */
    async refreshToken(): Promise<Token> {
        if(!this.pn.token) throw new PortalnesiaError("Missing `token`","OAuth2")
        
        try {
            const response = await fetch(this.auth.tokenUrl,{
                method:"POST",
                body:qs.stringify({
                    client_id:this.pn.options.client_id,
                    grant_type:'refresh_token',
                    refresh_token:this.pn.token.token.refresh_token
                }),
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    'PN-Client-Id':this.pn.options.client_id,
                    ...(this.pn.options.client_secret ? {
                        'Authorization':`Basic ${Buffer.from(`${this.pn.options.client_id}:${this.pn.options.client_secret}`).toString('base64')}`
                    } : {})
                }
            })
            const r = await response.json() as TokenResponse;
            if(!response.ok) {
                throw new PortalnesiaError((r as any)?.error_description||"Something went wrong","OAuth2");
            }
            const token = Token.createToken(r);
            this.pn.setToken(token);
            this.pn.emit('token-refresh',token.token);
            return token;
        } catch(e: any) {
            if(e instanceof PortalnesiaError) throw e;
            else throw new PortalnesiaError(e?.message,"OAuth2")
        }
    }

    /**
     * `authorization_code` or `client_credentials`
     * 
     * Revokes either the access or refresh token or both
     * @returns {Promise<void>} void
     */
    async revokeToken(): Promise<void> {
        if(!this.pn.token) throw new PortalnesiaError("Missing `token`","OAuth2");

        try {
            await Promise.all([
                fetch(this.auth.revokeUrl,{
                    method:"POST",
                    body:qs.stringify({
                        token_type_hint:'access_token',
                        token:this.pn.token.token.access_token
                    }),
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        'PN-Client-Id':this.pn.options.client_id,
                        ...(this.pn.options.client_secret ? {
                            'Authorization':`Basic ${Buffer.from(`${this.pn.options.client_id}:${this.pn.options.client_secret}`).toString('base64')}`
                        } : {})
                    }
                }),
                fetch(this.auth.revokeUrl,{
                    method:"POST",
                    body:qs.stringify({
                        token_type_hint:'refresh_token',
                        token:this.pn.token.token.refresh_token
                    }),
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        'PN-Client-Id':this.pn.options.client_id,
                        ...(this.pn.options.client_secret ? {
                            'Authorization':`Basic ${Buffer.from(`${this.pn.options.client_id}:${this.pn.options.client_secret}`).toString('base64')}`
                        } : {})
                    }
                })
            ])
            return Promise.resolve();
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