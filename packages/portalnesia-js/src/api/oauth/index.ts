import PortalnesiaError from "@src/exception/PortalnesiaException";
import Portalnesia from "@src/portalnesia";
import qs from "qs";
import { AuthorizationOptions, TokenErrorResponse, TokenOptions, TokenResponse,RevokeTokenOptions,RevokeResponse } from "./type";

/**
 * Get Portalnesia Authorization URL
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param options {@link AuthorizationOptions | Authorization Options}
 * @returns string Portalnesia Authorization URL
 */
export function getAuthorizationUrl(options: AuthorizationOptions): string {
    return `${Portalnesia.ACCOUNT_URL}/oauth/authorization?${qs.stringify(options)}`;
}

/**
 * Get {@link TokenResponse | Token Object}
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param options {@link TokenOptions | Token Options}
 * @returns object {@link TokenResponse | Token Response}
 * @throws Error {@link PortalnesiaError}
 */
export async function getToken(client: Portalnesia,options: TokenOptions): Promise<TokenResponse> {
    if(!client) throw new PortalnesiaError("Missing Portalnesia instance");
    if(!client.client_secret && options.grant_type === 'client_credentials') throw new PortalnesiaError("Missing `client_secret`")
    try {
        const r = await client.axios.post<TokenResponse|TokenErrorResponse>(client.getFullUrl('/oauth/token','accounts'),qs.stringify({...options,redirect_uri:client.options.redirect_uri}),{
            headers:{
                'PN-Client-Id':client.client_id,
                'Content-Type':'application/x-www-form-urlencoded',
                ...(options.code_verifier ? {} : {
                    'Authorization':Buffer.from(`${client.client_id}:${client.client_secret}`).toString('base64')
                })
            }
        })
        if(typeof (r.data as TokenErrorResponse)?.error !== 'undefined') {
            const err = r.data as TokenErrorResponse;
            throw new PortalnesiaError(err.error_description,err.error);
        }
        const token = r.data as TokenResponse;
        client.token = token;
        return token;
    } catch(err: any) {
        return client.catchError(err) as unknown as TokenResponse;
    }
}

/**
 * Refresh current {@link Portalnesia.token | Portalnesia Token}
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param refresh_token {@link TokenResponse.refresh_token | string} from your current {@link Portalnesia.token | Portalnesia Token}
 * @returns object {@link TokenResponse | Token Response}
 * @throws Error {@link PortalnesiaError}
 */
export async function refreshToken(client: Portalnesia,refresh_token: string): Promise<TokenResponse> {
    try {
        const r = await client.axios.post<TokenResponse|TokenErrorResponse>(client.getFullUrl('/oauth/token','accounts'),qs.stringify({refresh_token,grant_type:'refresh_token',redirect_uri:client.options.redirect_uri}),{
            headers:{
                'PN-Client-Id':client.client_id,
                'Authorization':`Bearer ${client.token?.access_token}`,
                'Content-Type':'application/x-www-form-urlencoded'
            }
        })
        if(typeof (r.data as TokenErrorResponse)?.error !== 'undefined') {
            const err = r.data as TokenErrorResponse;
            throw new PortalnesiaError(err.error_description,err.error);
        }
        const token = r.data as TokenResponse;
        client.token = token;
        return token;
    } catch(err: any) {
        return client.catchError(err) as unknown as TokenResponse;
    }
}

/**
 * Revoke current refresh_token or access_token
 * @param client {@link Portalnesia | Portalnesia Instance}
 * @param options {@link RevokeTokenOptions | Revoke Token Options}
 * @returns object {@link RevokeResponse | Revoke Response}
 * @throws Error {@link PortalnesiaError}
 */
export async function revokeToken(client: Portalnesia,options:RevokeTokenOptions): Promise<RevokeResponse> {
    if(!client) throw new PortalnesiaError("Missing Portalnesia instance");
    try {
        const r = await client.axios.post<RevokeResponse|TokenErrorResponse>(client.getFullUrl('/oauth/revoke','accounts'),qs.stringify({...options,redirect_uri:client.options.redirect_uri}),{
            headers:{
                'PN-Client-Id':client.client_id,
                'Authorization':`Bearer ${client.token?.access_token}`,
                'Content-Type':'application/x-www-form-urlencoded'
            }
        })
        if(typeof (r.data as TokenErrorResponse)?.error !== 'undefined') {
            const err = r.data as TokenErrorResponse;
            throw new PortalnesiaError(err.error_description,err.error);
        }
        const token = r.data as RevokeResponse;
        if(token.revoked) client.token = undefined;
        return token;
    } catch(err: any) {
        return client.catchError(err) as unknown as RevokeResponse;
    }
}