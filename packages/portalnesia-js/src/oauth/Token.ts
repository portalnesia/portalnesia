import { TokenResponse } from "./types";

export default class Token {
  private _token: TokenResponse & ({expiredAt: number})

  static createToken(token: TokenResponse) {
    const expiredAt = this.getExpirationDate(token.expires_in)
    return new Token({...token,expiredAt});
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