// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 此处后端没有提供注释 POST /chat/history/admin/list/page */
export async function listHistoryByPage(
  body: API.ChatHistoryQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChatHistoryVO>('/chat/history/admin/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /chat/history/cursor */
export async function listByCursor(
  body: API.ChatHistoryCursorRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChatHistoryCursorResponse>('/chat/history/cursor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
