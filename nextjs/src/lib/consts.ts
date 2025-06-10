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


export const CInsecureRandInt = ({ min, max }: { min?: number, max: number }) => {
  return min ?? 0 + Math.random() * max;
};
