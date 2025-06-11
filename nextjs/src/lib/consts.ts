/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
export interface IAuthUser {
  id: string;
  email: string;
  createdAt: string;
}
export interface IAuthRequest {
  email: string;
  password: string;
}
export interface IAuthResponse {
  user: IAuthUser;
  token: string;
  expiresIn: string;
}

export interface IGifRecord {
  id: string;
  url: string;
  previewUrl: string;
  title?: string;
  width?: number;
  height?: number;
}


export const CInsecureRandInt = ({ min, max }: { min?: number, max: number }) => {
  return min ?? 0 + Math.random() * max;
};


export class Primero {
  /** [1-100] */
  private static readonly primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  private index: number;

  constructor() {
    this.index = 0;
  }

  public get current(): number {
    return Primero.primes[this.index];
  }
  public next(): number {
    if (this.index + 1 < Primero.primes.length)
      return Primero.primes[this.index++];
    else throw new Error('Primero::src exceeded');
  }
  public reset() {
    this.index = 0;
  }
}
