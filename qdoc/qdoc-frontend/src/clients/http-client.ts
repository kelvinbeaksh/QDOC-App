import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "../errors/error-response";
import TimeoutError from "../errors/timeout-error";
import TechnicalError from "../errors/technical-error";
import { deserializeError } from "../errors/error-serializer";
import { identity } from "lodash";

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export type RequestParam = {
  [key: string]: any;
};

export const validateStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

const transformErrorResponse = async (error: AxiosError): Promise<any> => {
  return Promise.reject(error);
};

export class HttpClient {
  protected axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      validateStatus,
      timeout: 20000
    });
    this.axiosInstance.interceptors.response.use(
      identity,
      transformErrorResponse
    );
  }

  public get axios(): AxiosInstance {
    return this.axiosInstance;
  }

  public async get<T>(path: string, params?: RequestParam): Promise<ApiResponse<T>> {
    try {
      const result = await this.axiosInstance.get<T>(path, { params });
      return HttpClient.handleResponse(result);
    } catch (e) {
      throw HttpClient.translateAxiosError(e);
    }
  }

  public async post<T, P>(path: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const result = await this.axiosInstance.post<P>(path, payload, config);
      return HttpClient.handleResponse(result);
    } catch (e) {
      throw HttpClient.translateAxiosError(e);
    }
  }

  public async delete(path: string): Promise<void> {
    try {
      await this.axiosInstance.delete<void>(path);
    } catch (e) {
      throw HttpClient.translateAxiosError(e);
    }
  }

  public async put<T, P>(path: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const result = await this.axiosInstance.put<T>(path, payload, config);
      return HttpClient.handleResponse(result);
    } catch (e) {
      throw HttpClient.translateAxiosError(e);
    }
  }

  public async patch<T, P>(path: string, payload: P): Promise<ApiResponse<T>> {
    try {
      const result = await this.axiosInstance.patch<T>(path, payload);
      return HttpClient.handleResponse(result);
    } catch (e) {
      throw HttpClient.translateAxiosError(e);
    }
  }

  private static handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return { data: response.data as T };
  }

  private static translateAxiosError(e: AxiosError): Error {
    const { response } = e;
    if (e.code === "ECONNABORTED") {
      return new TimeoutError(e.message);
    }
    if (response != null) {
      return deserializeError(response.data.error || response.data);
    }
    return new TechnicalError("Unable to contact the server at this time. Please try again later");
  }
}
