/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { IAuthResponse } from "../consts";


export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export class TokenManager {
  private static KEY = 'tkn';
  private _storage?: Storage;
  private _token: string | null;

  constructor(storage?: Storage) {
    this._storage = storage;
    this._token = null;
  }

  public initStorage(storage: Storage) {
    this._storage = storage;
  }

  private get _parseStorageItem(): IAuthResponse | null {
    if (!this._storage) throw new TokenError('Manger::storage not set');
    try {
      const authData = JSON.parse(this._storage.getItem(TokenManager.KEY)!) as IAuthResponse;
      return authData;
    } catch (err) { }
    return null;
  }

  public set token(res: IAuthResponse) {
    if (!this._storage) throw new TokenError('Manger::storage not set');
    this._token = res.token;
    this._storage.setItem(TokenManager.KEY, JSON.stringify(res));
  }
  public get token(): string | null {
    if (!this._token) {
      const authData = this._parseStorageItem;
      this._token = authData?.token ?? null;
    }
    return this._token;
  }

  public resetToken(newToken: string) {
    if (!this._storage) throw new TokenError('Manger::storage not set');
    const authData = this._parseStorageItem;
    if (!authData) throw new TokenError('Manager::reset error');
    authData.token = newToken;
    this._token = newToken;
    this._storage.setItem(TokenManager.KEY, JSON.stringify(authData));
  }

  public invalidateToken(): boolean {
    this._token = null;
    if (this._storage) {
      this._storage.removeItem(TokenManager.KEY);
      return true;
    } else return false;
  }
}
