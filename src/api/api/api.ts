import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

// 定义基础响应类型
interface BaseResponse<T = any> {
    code: number;
    data: T; // T 是一个类型参数，由使用时的具体类型决定，默认为 any
    msg?: string;
}

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: '/api',
        timeout: 10000,
    });

    // 请求拦截器 - 添加token
    instance.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem('token') || 'I am a token';
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 响应拦截器 - 处理基础响应
    instance.interceptors.response.use(
        (response: AxiosResponse<BaseResponse>) => {
            // 如果是blob响应，直接返回response
            if (response.config.responseType === 'blob') {
                return response;
            }
            // 返回完整的响应数据，包含code、data、msg
            return response.data as any;
        },
        (error) => {
            // 简单错误处理
            const errorMessage = error.response?.data?.message || error.message;
            console.error('请求错误:', errorMessage);
            return Promise.reject(errorMessage);
        }
    );

    return instance;
};

const http = createAxiosInstance();

// 封装通用请求方法
const request = <T>(config: AxiosRequestConfig): Promise<T> => {
    return http.request(config);
};

// 封装常用方法
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return request<T>({ method: 'GET', url, params, ...config });
};

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    // 如果是 FormData，直接传递，不进行 qs.stringify
    const requestData = data instanceof FormData ? data : qs.stringify(data);
    return request<T>({ method: 'POST', url, data: requestData, ...config });
};

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return request<T>({ method: 'PUT', url, data, ...config });
};

export const del = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return request<T>({ method: 'DELETE', url, params, ...config });
};

export default {
    get,
    post,
    put,
    delete: del,
};