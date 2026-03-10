import { create } from 'zustand';
import {
  getLoginUser,
  updatePassword,
  updateUserVo,
  userLogin,
  userLogout,
  userRegister,
} from '@/api/campusUserController';

type AuthState = {
  user: API.LoginUserVO | null;
  loading: boolean;
  initialized: boolean;
  error?: string;
};

type AuthActions = {
  setUser: (user: API.LoginUserVO | null) => void;
  fetchCurrentUser: () => Promise<API.LoginUserVO | null>;
  login: (payload: API.UserLoginRequest) => Promise<API.LoginUserVO>;
  register: (payload: API.UserRegisterRequest) => Promise<API.LoginUserVO>;
  updateProfile: (payload: API.UserUpdateRequest) => Promise<API.LoginUserVO>;
  changePassword: (payload: API.UserPasswordUpdateRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const resolveErrorMessage = (message?: string, fallback = '操作失败') =>
  message && message.trim().length > 0 ? message : fallback;

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: undefined,
  setUser: (user) => set({ user, error: undefined }),
  fetchCurrentUser: async () => {
    const { loading, initialized } = get();
    if (loading || initialized) {
      return get().user;
    }
    set({ loading: true });
    try {
      const response = await getLoginUser();
      if (response.code === 0) {
        const nextUser = response.data ?? null;
        set({ user: nextUser, error: undefined });
        return nextUser;
      }
      const errorMessage = resolveErrorMessage(response.message, '未登录或会话失效');
      set({ user: null, error: errorMessage });
      return null;
    } catch (error) {
      set({
        user: null,
        error: error instanceof Error ? error.message : '系统错误',
      });
      return null;
    } finally {
      set({ loading: false, initialized: true });
    }
  },
  login: async (payload) => {
    const response = await userLogin(payload);
    if (response.code === 0 && response.data) {
      set({ user: response.data, initialized: true, error: undefined });
      return response.data;
    }
    throw new Error(resolveErrorMessage(response.message, '登录失败'));
  },
  register: async (payload) => {
    const response = await userRegister(payload);
    if (response.code === 0 && response.data) {
      set({ user: response.data, initialized: true, error: undefined });
      return response.data;
    }
    throw new Error(resolveErrorMessage(response.message, '注册失败'));
  },
  updateProfile: async (payload) => {
    const response = await updateUserVo(payload);
    if (response.code === 0 && response.data) {
      set({ user: response.data, error: undefined });
      return response.data;
    }
    throw new Error(resolveErrorMessage(response.message, '更新失败'));
  },
  changePassword: async (payload) => {
    const response = await updatePassword(payload);
    if (response.code === 0) {
      return;
    }
    throw new Error(resolveErrorMessage(response.message, '修改密码失败'));
  },
  logout: async () => {
    try {
      await userLogout();
    } finally {
      set({ user: null });
    }
  },
}));

export type { AuthState };
