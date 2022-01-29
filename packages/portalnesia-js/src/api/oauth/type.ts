export type IScopes = "basic" | "openid" |  "email" |  "blog" |  "comments" |  "chord" | "files" |  "geodata" |  "likes" |  "messages" |  "quiz" |  "toko" |  "twibbon" |  "thread" |  "url-shortener" | "user"

export type IGrantType = "authorization_code" | "refresh_token" | "client_credentials"


export type AuthorizationOptions = {
    scope?: IScopes,
    client_id: string,
    redirect_uri: string,
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
    code: string,
    redirect_uri: string,
    code_verifier?: string
}
export type TokenResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    id_token?: string
}
export type TokenErrorResponse = {
    error: string,
    error_description: string,
    error_uri?: string
}