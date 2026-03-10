// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 此处后端没有提供注释 GET /ai/chat */
export async function chat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chatParams,
  options?: { [key: string]: any },
) {
  return request<string>('/ai/chat', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /ai/stream */
export async function chatWithSse(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chatWithSseParams,
  options?: { [key: string]: any },
) {
  return request<API.ServerSentEventString[]>('/ai/stream', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /ai/stream/memory */
export async function chatWithMemory(
  body: API.ChatMemoryRequest,
  options?: { [key: string]: any },
) {
  return request<API.ServerSentEventString[]>('/ai/stream/memory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
