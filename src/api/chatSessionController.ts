// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 此处后端没有提供注释 POST /chatSession/add */
export async function addChatSession(
  body: API.ChatSessionAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>('/chatSession/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chatSession/delete */
export async function deleteChatSession(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/chatSession/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chatSession/list/page/vo */
export async function listChatSessionVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChatSessionVO>('/chatSession/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chatSession/update */
export async function updateChatSession(
  body: API.ChatSessionUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/chatSession/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
