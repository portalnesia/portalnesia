export type IScopes = "basic" | "openid" |  "email" | 
"blog" | "blog-write" | 
"comments" | "comments-write" | 
"chord" | "chord-write" | 
"files" | "files-write" | "geodata" | 
"likes" | "likes-write" |
"messages" | "messages-write" | "quiz" |
"twibbon" | "twibbon-write" | "thread" |
"url-shortener" | "url-shortener-write" |
"user" | "user-write"

export type IGrantType = "authorization_code" | "client_credentials"


export type AuthorizationOptions = {
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