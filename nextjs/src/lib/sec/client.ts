/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { IAuthResponse, IAuthUser } from "../consts";


export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export class SessionManager {
  private static KEY_TOKEN = 'tkn';
  private static KEY_DRAFT = 'dft';
  private _storage?: Storage;
  private _token: string | null;

  constructor(storage?: Storage) {
    this._storage = storage;
    this._token = null;
  }

  public initStorage(storage: Storage) {
    this._storage = storage;
  }

  public forget(): boolean {
    this._token = null;
    if (this._storage) {
      this._storage.removeItem(SessionManager.KEY_TOKEN);
      return true;
    } else return false;
  }

// TOKEN
  private get _parseStorageToken(): IAuthResponse | null {
    if (!this._storage) throw new SessionError('Manger::storage not set');
    try {
      const authData = JSON.parse(this._storage.getItem(SessionManager.KEY_TOKEN)!) as IAuthResponse;
      return authData;
    } catch (err) { }
    return null;
  }

  public set token(res: IAuthResponse) {
    if (!this._storage) throw new SessionError('Manger::storage not set');
    this._token = res.token;
    this._storage.setItem(SessionManager.KEY_TOKEN, JSON.stringify(res));
  }
  public get token(): string | null {
    if (!this._token) {
      const authData = this._parseStorageToken;
      this._token = authData?.token ?? null;
    }
    return this._token;
  }

  public get user(): IAuthUser | null {
    const authData = this._parseStorageToken;
    return authData?.user ?? null;
  }

  public resetToken(newToken: string) {
    if (!this._storage) throw new SessionError('Manger::storage not set');
    const authData = this._parseStorageToken;
    if (!authData) throw new SessionError('Manager::reset error');
    authData.token = newToken;
    this._token = newToken;
    this._storage.setItem(SessionManager.KEY_TOKEN, JSON.stringify(authData));
  }

  public get isTokenMaybeValid(): boolean {
    return !this._token || this._token.length < 9;
  }
  public invalidateToken(): boolean {
    this._token = null;
    if (this._storage) {
      try {
        this.resetToken("");
        return true;
      } catch (err) { }
    }
    return false;
  }

// DRAFT
  public get messageDraft(): string | null {
    if (!this._storage) throw new SessionError('Manger::storage not set');
    const _draft = this._storage.getItem(SessionManager.KEY_DRAFT);
    this._storage.removeItem(SessionManager.KEY_DRAFT);
    return _draft;
  }
  public set messageDraft(draft:string) {
    if (!this._storage) throw new SessionError('Manger::storage not set');
    this._storage.setItem(SessionManager.KEY_DRAFT,draft);
  }
}
