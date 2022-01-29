import PortalnesiaError from "@src/exception/PortalnesiaException";
import Portalnesia from "@src/portalnesia";
import { AxiosError } from "axios";
import qs from "qs";
import { AuthorizationOptions, TokenErrorResponse, TokenOptions, TokenResponse } from "./type";

/**
 * Get Portalnesia Authorization URL
 * @param options {@link AuthorizationOptions | Authorization Options}
 * @returns string Portalnesia Authorization URL
 */
export function getAuthorizationUrl(options: AuthorizationOptions): string {
    return `${Portalnesia.ACCOUNT_URL}/oauth/authorization?${qs.stringify(options)}`;
}

/**
 * Get Portalnesia Token
 * @param options {@link TokenOptions | Token Options}
 */
export async function getToken(client: Portalnesia,options: TokenOptions) {
    if(!client) throw new PortalnesiaError("Missing Portalnesia instance");
    try {
        const r = await client.axios.post<TokenResponse|TokenErrorResponse>(client.getFullUrl('/oauth/token','accounts'),options,{
            headers:{
                'PN-Client-Id':client.client_id,
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
        const e = err as AxiosError
        if(e.response?.data?.error) {
            throw new PortalnesiaError(e.response?.data?.error.error_description,e.response?.data?.error.error);
        }
        throw err;
    }
}