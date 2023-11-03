/* eslint-disable @typescript-eslint/no-explicit-any */
export const TOKEN_KEY = "darwin_token";

class AuthToken {
  private _authToken: string | null = null;
  constructor() {
    this._authToken = this._getTokenFromStorage();
  }

  private _getTokenFromStorage = () => sessionStorage.getItem(TOKEN_KEY);
  private _setTokenToStorage = () =>
    sessionStorage.setItem(TOKEN_KEY, this._authToken || "");

  public getToken() {
    return this._authToken;
  }

  public setToken(value: null | string) {
    this._authToken = value;
    if (window) {
      (window as any).authToken = value;
    }
    this._setTokenToStorage();
  }
}

export const authToken = new AuthToken();
