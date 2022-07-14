import { TokenResponse } from "./types";

export default class Token {
  private _token: TokenResponse & ({expiredAt: number})

  static createToken(token: TokenResponse & ({expiredAt?: number})) {
    if(typeof token.expiredAt === 'number') {
      const new_token = token as TokenResponse & ({expiredAt: number})
      return new Token(new_token);
    } else {
      const expiredAt = Token.getExpirationDate(token.expires_in)
      return new Token({...token,expiredAt});
    }
  }

  constructor(data:TokenResponse & ({expiredAt: number})) {
    this._token = data;
  }

  get token() {
    return this._token;
  }

  static getExpirationDate(expiresIn: number) {
    const now = Math.floor(new Date().getTime()/1000);
    return now + expiresIn;
  }

  isExpired() {
    const now = Math.floor(new Date().getTime()/1000);
    return (this._token.expiredAt <= now);
  }
}