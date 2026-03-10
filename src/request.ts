import type { AxiosRequestConfig } from 'axios'
import myAxios from './lib/axios'

type RequestConfig = AxiosRequestConfig & { url?: string }

export default function request<T = unknown>(
  url: string,
  config: RequestConfig = {},
): Promise<T> {
  return myAxios({
    url,
    ...config,
  }).then((response) => response.data as T)
}
