"use client";

import {
  getCookie,
  setCookie,
  deleteCookie,
  OptionsType,
} from "cookies-next/client";

const ACCESS_TOKEN_KEY = "access_token_user";
const REFRESH_TOKEN_KEY = "refresh_token_user";

const DEFAULT_OPTIONS: OptionsType = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

export const clientToken = {
  getAccess: () => getCookie(ACCESS_TOKEN_KEY) as string | undefined,
  getRefresh: () => getCookie(REFRESH_TOKEN_KEY) as string | undefined,

  setAccess: (token: string) =>
    setCookie(ACCESS_TOKEN_KEY, token, { ...DEFAULT_OPTIONS }),

  setRefresh: (token: string) =>
    setCookie(REFRESH_TOKEN_KEY, token, {
      ...DEFAULT_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    }),

  clear: () => {
    deleteCookie(ACCESS_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
  },
};
