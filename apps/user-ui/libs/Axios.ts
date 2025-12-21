"use client";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { clientToken } from "./utils/client-tokens";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  withCredentials: true,
  timeout: 30000,
});

let isRefreshing = false;
let queue: {
  resolve: (t: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const flush = (error: any, token: string | null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  queue = [];
};

// REQUEST
api.interceptors.request.use(async (config) => {
  const token = clientToken.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response) return Promise.reject(error);

    if (error.response.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      isRefreshing = true;
      original._retry = true;

      try {
        const refresh = clientToken.getRefresh();
        if (!refresh) throw new Error("Missing refresh token");

        const { data } = await api.post<any, AxiosResponse<{ access: string }>>(
          "/auth/refresh-token",
          { refresh },
        );

        const newToken = data.access;

        // clientToken.setAccess(newToken);

        flush(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        flush(err, null);
        clientToken.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
