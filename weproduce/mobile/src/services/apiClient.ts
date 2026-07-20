import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { tokenStorage } from "./tokenStorage";
import type { ApiErrorBody, ApiSuccessBody } from "@/types/domain";

const API_URL: string = Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Thin typed wrapper — every endpoint returns the { success, data } envelope. */
export class ApiRequestError extends Error {
  constructor(public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const res = await apiClient.get<ApiSuccessBody<T>>(url, { params });
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  try {
    const res = await apiClient.post<ApiSuccessBody<T>>(url, body);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  try {
    const res = await apiClient.put<ApiSuccessBody<T>>(url, body);
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
}

function toApiError(err: unknown): ApiRequestError {
  if (axios.isAxiosError(err) && err.response?.data) {
    const body = err.response.data as ApiErrorBody;
    if (body?.error) {
      return new ApiRequestError(body.error.code, body.error.message, body.error.details);
    }
  }
  return new ApiRequestError("NETWORK_ERROR", "Couldn't reach WeProduce. Check your connection.");
}
