import axios, {
  type AxiosRequestTransformer,
  type AxiosResponseTransformer,
  type RawAxiosRequestHeaders,
  type RawAxiosResponseHeaders,
} from 'axios'
import JSONBig from 'json-bigint'
import { message } from 'antd'

const JSONBigString = JSONBig({ storeAsString: true })

const isPlainJsonPayload = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value !== 'object') {
    return false
  }
  if (value instanceof ArrayBuffer) {
    return false
  }
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return false
  }
  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return false
  }
  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    return false
  }
  return true
}

const normalizeContentType = (headers?: RawAxiosRequestHeaders) => {
  if (!headers) {
    return
  }
  const contentTypeKey =
    Object.keys(headers).find((key) => key.toLowerCase() === 'content-type') ?? 'Content-Type'
  if (!headers[contentTypeKey]) {
    headers[contentTypeKey] = 'application/json'
  }
}

const defaultRequestTransforms = axios.defaults.transformRequest ?? []
const normalizedRequestTransforms: AxiosRequestTransformer[] = Array.isArray(defaultRequestTransforms)
  ? (defaultRequestTransforms as AxiosRequestTransformer[])
  : [defaultRequestTransforms as AxiosRequestTransformer]

const requestTransforms: AxiosRequestTransformer[] = [
  (data, headers) => {
    if (!isPlainJsonPayload(data)) {
      return data
    }
    normalizeContentType(headers)
    try {
      return JSONBigString.stringify(data)
    } catch {
      return JSON.stringify(data)
    }
  },
  ...normalizedRequestTransforms,
]

const parseJsonLikeResponse: AxiosResponseTransformer = (data, headers?: RawAxiosResponseHeaders) => {
  if (typeof data !== 'string' || data.trim().length === 0) {
    return data
  }
  const rawContentType = headers?.['content-type'] ?? headers?.['Content-Type']
  const contentType = typeof rawContentType === 'string' ? rawContentType : undefined
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return data
  }
  try {
    return JSONBigString.parse(data)
  } catch {
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
}

const defaultResponseTransforms = axios.defaults.transformResponse ?? []
const normalizedResponseTransforms: AxiosResponseTransformer[] = Array.isArray(defaultResponseTransforms)
  ? (defaultResponseTransforms as AxiosResponseTransformer[])
  : [defaultResponseTransforms as AxiosResponseTransformer]

const responseTransforms: AxiosResponseTransformer[] = [parseJsonLikeResponse, ...normalizedResponseTransforms]

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL
const myAxios = axios.create({
  baseURL: (rawBaseUrl && rawBaseUrl.trim().length > 0 ? rawBaseUrl : 'http://localhost:8123/api').replace(
    /\/$/,
    '',
  ),
  timeout: 60000,
  withCredentials: true,
  transformRequest: requestTransforms,
  transformResponse: responseTransforms,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default myAxios
