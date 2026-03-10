import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonFilled,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  SunOutlined,
} from '@ant-design/icons';
import {
  App as AntdApp,
  Avatar,
  Button,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import {
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import markupLang from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import clikeLang from 'react-syntax-highlighter/dist/esm/languages/prism/clike';
import jsLang from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import tsLang from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsxLang from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsxLang from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import jsonLang from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import javaLang from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import pythonLang from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bashLang from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sqlLang from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import markdownLang from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import emptyStateIllustration from '@/assets/empty-state.svg';
import { listChatSessionVoByPage } from '@/api/chatSessionController';
import { listByCursor } from '@/api/chatHistoryController';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/stores/authStore';
import JSONBig from 'json-bigint';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

type SessionItem = {
  id: string;
  title: string;
  updateLabel: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  status?: 'pending' | 'error' | 'sent';
};

type ProfileFormValues = Pick<
  API.UserUpdateRequest,
  'userName' | 'userAvatar' | 'major' | 'college' | 'gradeYear' | 'phone' | 'email'
>;

type PasswordFormValues = Required<Pick<API.UserPasswordUpdateRequest, 'oldPassword' | 'newPassword' | 'confirmPassword'>>;

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (RAW_API_BASE_URL && RAW_API_BASE_URL.trim().length > 0
  ? RAW_API_BASE_URL
  : 'http://localhost:8123/api'
).replace(/\/$/, '');
const CHAT_STREAM_ENDPOINT = `${API_BASE_URL}/ai/stream/memory`;
const SSE_JSON_BIG = JSONBig({ storeAsString: true });
const SESSION_PAGE_SIZE = 8;

SyntaxHighlighter.registerLanguage('markup', markupLang);
SyntaxHighlighter.registerLanguage('html', markupLang);
SyntaxHighlighter.registerLanguage('clike', clikeLang);
SyntaxHighlighter.registerLanguage('javascript', jsLang);
SyntaxHighlighter.registerLanguage('typescript', tsLang);
SyntaxHighlighter.registerLanguage('tsx', tsxLang);
SyntaxHighlighter.registerLanguage('jsx', jsxLang);
SyntaxHighlighter.registerLanguage('json', jsonLang);
SyntaxHighlighter.registerLanguage('java', javaLang);
SyntaxHighlighter.registerLanguage('python', pythonLang);
SyntaxHighlighter.registerLanguage('bash', bashLang);
SyntaxHighlighter.registerLanguage('shell', bashLang);
SyntaxHighlighter.registerLanguage('sql', sqlLang);
SyntaxHighlighter.registerLanguage('markdown', markdownLang);

type StreamEventPayload = {
  t?: string;
  d?: string;
  sessionId?: number | string;
};

const InlineCode = ({ children }: { children?: ReactNode }) => (
  <code
    style={{
      background: 'rgba(15,23,42,0.08)',
      borderRadius: 6,
      padding: '0 6px',
      fontSize: '0.9em',
      fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }}
  >
    {children}
  </code>
);

const CodeBlock = ({ className, children }: { className?: string; children?: ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const textContent = String(children ?? '').replace(/\n$/, '');
  const { langKey, label } = useMemo(() => {
    const normalized = className?.replace('language-', '').trim().toLowerCase() ?? '';
    const map: Record<string, { langKey: string; label: string }> = {
      ts: { langKey: 'typescript', label: 'TypeScript' },
      typescript: { langKey: 'typescript', label: 'TypeScript' },
      tsx: { langKey: 'tsx', label: 'TSX' },
      js: { langKey: 'javascript', label: 'JavaScript' },
      javascript: { langKey: 'javascript', label: 'JavaScript' },
      jsx: { langKey: 'jsx', label: 'JSX' },
      json: { langKey: 'json', label: 'JSON' },
      java: { langKey: 'java', label: 'Java' },
      py: { langKey: 'python', label: 'Python' },
      python: { langKey: 'python', label: 'Python' },
      sh: { langKey: 'bash', label: 'Shell' },
      bash: { langKey: 'bash', label: 'Shell' },
      shell: { langKey: 'bash', label: 'Shell' },
      sql: { langKey: 'sql', label: 'SQL' },
      md: { langKey: 'markdown', label: 'Markdown' },
      markdown: { langKey: 'markdown', label: 'Markdown' },
      html: { langKey: 'markup', label: 'HTML' },
      markup: { langKey: 'markup', label: 'HTML' },
    };
    return map[normalized] ?? { langKey: 'text', label: (normalized || 'text').toUpperCase() };
  }, [className]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textContent);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: 18,
        margin: '12px 0',
        background: '#0f172a',
        border: '1px solid rgba(148,163,184,0.3)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: 'rgba(15,23,42,0.8)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: '#94a3b8',
        }}
      >
        <span>{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            border: 'none',
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
            color: copied ? '#22c55e' : '#e2e8f0',
            borderRadius: 999,
            padding: '3px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        language={langKey === 'text' ? undefined : langKey}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '14px 16px',
          background: 'transparent',
          overflowX: 'auto',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.9rem',
            lineHeight: 1.7,
            fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
        }}
      >
        {textContent}
      </SyntaxHighlighter>
    </div>
  );
};

const DISPLAYABLE_HISTORY_TYPES = new Set(['USER', 'AI']);
const MARKDOWN_PLUGINS = [remarkGfm, remarkBreaks];
const markdownComponents: Components = {
  a: ({ ...props }) => (
    <a {...props} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }} />
  ),
  code: ({ className, children }) => {
    if (!className) {
      return <InlineCode>{children}</InlineCode>;
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  ul: ({ ...props }) => (
    <ul
      style={{
        paddingLeft: 24,
        margin: '8px 0',
        listStyle: 'disc',
      }}
      {...props}
    />
  ),
  ol: ({ ...props }) => (
    <ol
      style={{
        paddingLeft: 24,
        margin: '8px 0',
      }}
      {...props}
    />
  ),
  p: ({ ...props }) => (
    <p
      style={{
        margin: '10px 0',
      }}
      {...props}
    />
  ),
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toSafeId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return null;
};

const sanitizeModelOutput = (value: string) => {
  if (!value) {
    return '';
  }
  let sanitized = value;
  const startToken = '<think>';
  const endToken = '</think>';
  while (sanitized.includes(startToken)) {
    const start = sanitized.indexOf(startToken);
    const end = sanitized.indexOf(endToken, start + startToken.length);
    if (end === -1) {
      sanitized = sanitized.slice(0, start);
      break;
    }
    sanitized = sanitized.slice(0, start) + sanitized.slice(end + endToken.length);
  }
  return sanitized.trim();
};

const extractTextFromPayload = (payload: unknown): string => {
  if (!payload) {
    return '';
  }
  if (typeof payload === 'string') {
    return payload;
  }
  if (!isRecord(payload)) {
    return '';
  }
  const primaryKeys: Array<keyof typeof payload> = ['text', 'content', 'message', 'result'];
  for (const key of primaryKeys) {
    const candidate = payload[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
  }
  const contents = payload.contents;
  if (Array.isArray(contents)) {
    const textParts = contents
      .map((item) => (isRecord(item) && typeof item.text === 'string' ? item.text : ''))
      .filter((text) => text);
    if (textParts.length > 0) {
      return textParts.join('\n');
    }
  }
  return '';
};

const parseHistoryPayload = (rawMessage?: string) => {
  if (!rawMessage) {
    return '';
  }
  try {
    return JSON.parse(rawMessage);
  } catch {
    return rawMessage;
  }
};

const parseSsePayload = (rawEvent: string): StreamEventPayload | null => {
  const lines = rawEvent.split('\n');
  const dataLines: string[] = [];
  lines.forEach((lineRaw) => {
    const line = lineRaw.trim();
    if (!line || line.startsWith(':')) {
      return;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  });
  if (dataLines.length === 0) {
    return null;
  }
  const dataString = dataLines.join('\n');
  try {
    return SSE_JSON_BIG.parse(dataString) as StreamEventPayload;
  } catch {
    return null;
  }
};

const streamChatWithMemoryRequest = async (
  body: API.ChatMemoryRequest,
  onEvent: (payload: StreamEventPayload) => void,
) => {
  const response = await fetch(CHAT_STREAM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const messageText = await response.text();
    throw new Error(messageText || '对话请求失败，请稍后再试');
  }
  if (!response.body) {
    throw new Error('服务器暂不支持流式响应');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const flushBuffer = (isEnd = false) => {
    buffer = buffer.replace(/\r/g, '');
    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const rawEvent = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      if (rawEvent) {
        const payload = parseSsePayload(rawEvent);
        if (payload) {
          onEvent(payload);
        }
      }
      boundary = buffer.indexOf('\n\n');
    }
    if (isEnd) {
      const remainder = buffer.trim();
      if (remainder) {
        const payload = parseSsePayload(remainder);
        if (payload) {
          onEvent(payload);
        }
      }
      buffer = '';
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      flushBuffer(true);
      break;
    }
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      flushBuffer();
    }
  }
};

const formatDate = (value?: string) => {
  if (!value) {
    return '刚刚';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeSession = (session: API.ChatSessionVO): SessionItem | null => {
  const sessionId = toSafeId(session.id);
  if (!sessionId) {
    return null;
  }
  return {
    id: sessionId,
    title: session.title?.trim() || '未命名会话',
    updateLabel: formatDate(session.updateTime ?? session.editTime ?? session.createTime),
  };
};

const normalizeMessage = (message: API.ChatHistoryVO): ChatMessage | null => {
  const recordId = toSafeId(message.id);
  if (!recordId) {
    return null;
  }
  const messageType = message.messageType?.toUpperCase() ?? '';
  if (!DISPLAYABLE_HISTORY_TYPES.has(messageType)) {
    return null;
  }
  const payload = parseHistoryPayload(message.message);
  const rawCandidate =
    typeof message.rawMessage === 'string' && message.rawMessage.trim().length > 0
      ? message.rawMessage
      : '';
  let text = sanitizeModelOutput(extractTextFromPayload(payload));
  if (messageType === 'USER' && rawCandidate) {
    text = sanitizeModelOutput(rawCandidate);
  }
  if (!text) {
    return null;
  }
  return {
    id: recordId,
    role: messageType === 'USER' ? 'user' : 'assistant',
    content: text,
    createdAt: message.createTime ?? new Date().toISOString(),
    status: 'sent',
  };
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionPageNum, setSessionPageNum] = useState(1);
  const [sessionTotalCount, setSessionTotalCount] = useState(0);
  const [sessionRefreshToken, setSessionRefreshToken] = useState(0);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messageInputRef = useRef<TextAreaRef>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);

  const displayName = user?.userName || user?.studentNo || '同学';
  const userInitial = displayName.charAt(0).toUpperCase();
  const sessionTotalPages = sessionTotalCount > 0 ? Math.ceil(sessionTotalCount / SESSION_PAGE_SIZE) : 1;
  const sessionPageDisplay = sessionTotalCount > 0 ? sessionPageNum : 1;
  const sessionPageDisplayTotal = sessionTotalCount > 0 ? sessionTotalPages : 1;
  const sessionHasData = sessionTotalCount > 0;
  const canGoPrevSessionPage = sessionHasData && sessionPageNum > 1;
  const canGoNextSessionPage = sessionHasData && sessionPageNum < sessionTotalPages;
  const sessionSearchHasKeyword = sessionSearch.trim().length > 0;
  const sessionEmptyDescription = sessionSearchHasKeyword ? '未找到相关会话' : '暂无会话';
  const visibleSessions = useMemo(() => {
    const keyword = sessionSearch.trim().toLowerCase();
    if (!keyword) {
      return sessions;
    }
    return sessions.filter((session) => session.title.toLowerCase().includes(keyword));
  }, [sessions, sessionSearch]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDark.matches);
    const handleSchemeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };
    if (typeof prefersDark.addEventListener === 'function') {
      prefersDark.addEventListener('change', handleSchemeChange);
      return () => {
        prefersDark.removeEventListener('change', handleSchemeChange);
      };
    }
    prefersDark.addListener(handleSchemeChange);
    return () => {
      prefersDark.removeListener(handleSchemeChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const themeTokens = useMemo(() => {
    if (isDarkMode) {
      return {
        // layoutBg: '#050B17',
        layoutBg: 'linear-gradient(to top, #050B17 50%, #0c1841ff 100%)',
        surfaceBg: 'rgba(13,18,30,0.92)',
        textPrimary: '#f8fafc',
        textMuted: '#9aa4bf',
        paginationText: '#cbd5f5',
        paginationDisabled: 'rgba(148,163,184,0.5)',
        sessionBorder: '1px solid rgba(148,163,184,0.25)',
        sessionBg: 'rgba(16,24,40,0.9)',
        sessionSelectedBg: 'rgba(21, 83, 128, 0.25)',
        assistantBubbleBg: 'rgba(15, 23, 42, 0.04)',
        userBubbleBg: '#37677f50',
        bubbleBorder: '1px solid rgba(148,163,184,0.3)',
        userBubbleShadow: '0 10px 30px rgba(0, 0, 0, 0)',
        timestampColor: '#9aa4bf',
        sidebarBorder: '1px solid rgba(148,163,184,0.25)',
        composerOuterBg: 'rgba(5,11,23,0.95)',
        composerInnerBg: 'rgba(15,23,42,0.75)',
        composerInnerBorder: '1px solid rgba(148,163,184,0.25)',
        composerShadow: '0 20px 60px rgba(0,0,0,0.55)',
        headingColor: '#f1f5f9',
        tagBg: 'rgba(245,165,36,0.2)',
        tagColor: '#fcd34d',
        searchInputBg: 'rgba(15,23,42,0.65)',
        searchInputBorder: 'rgba(148,163,184,0.35)',
        searchInputColor: '#f8fafc',
        searchInputPlaceholder: 'rgba(203,213,225,0.8)',
        composerTextColor: '#f8fafc',
        composerPlaceholderColor: 'rgba(203,213,225,0.75)',
        sendButtonBg: '#32a9f8ff',
        sendButtonBgHover: '#3c59fbff',
        sendButtonColor: '#fff',
        sendButtonDisabledBg: 'rgba(249,115,22,0.3)',
        sendButtonDisabledColor: 'rgba(255,255,255,0.7)',
        sidebarButtonBg: 'linear-gradient(to left, #0acffe 0%, #495aff 100%)',
        sidebarButtonBgHover: 'linear-gradient(to left, #0acffe 0%, #498fffff 100%)',
        sidebarButtonColor: '#052e16',
        sidebarToggleBg: 'rgba(15,23,42,0.8)',
        sidebarToggleHoverBg: 'rgba(30,41,59,0.95)',
        sidebarToggleBorder: '1px solid rgba(148,163,184,0.5)',
        sidebarToggleColor: '#f8fafc',
      };
    }
    return {
      layoutBg: 'linear-gradient(to top, #fdfbfb 50%, #fcfdf6ff 100%)',
      surfaceBg: '#fff',
      textPrimary: '#0f172a',
      textMuted: '#9da4b2',
      paginationText: '#475569',
      paginationDisabled: '#cbd5e1',
      sessionBorder: '1px solid #f0f0f0',
      sessionBg: '#fff',
      sessionSelectedBg: '#F0FDF4',
      assistantBubbleBg: '#f5f7fb09',
      userBubbleBg: '#7ad5f932',
      bubbleBorder: '1px solid rgba(15,23,42,0.08)',
      userBubbleShadow: '0 10px 25px rgba(15, 23, 42, 0.03)',
      timestampColor: '#9ca3af',
      sidebarBorder: '1px solid #f0f0f0',
      composerOuterBg: 'rgba(255,255,255,0.95)',
      composerInnerBg: '#FAFAFA',
      composerInnerBorder: '1px solid #ededed',
      composerShadow: '0 16px 40px rgba(15,23,42,0.08)',
      headingColor: '#0f172a',
      tagBg: '#FEF9C3',
      tagColor: '#92400e',
      searchInputBg: '#fff',
      searchInputBorder: '#f0f0f0',
      searchInputColor: '#0f172a',
      searchInputPlaceholder: '#9da4b2',
      composerTextColor: '#0f172a',
      composerPlaceholderColor: '#9da4b2',
      sendButtonBg: '#76e37dff',
      sendButtonBgHover: '#39cc40ff',
      sendButtonColor: '#fff',
      sendButtonDisabledBg: '#d7e9d8',
      sendButtonDisabledColor: '#94a3b8',
      // sidebarButtonBg: 'linear-gradient(135deg, #22c55e, #3ed776ff)',
      sidebarButtonBg: 'linear-gradient(to right, #96fbc4 0%, #f9f586 100%)',
      // sidebarButtonBgHover: 'linear-gradient(135deg, #15803d, #3ed776ff)',
      sidebarButtonBgHover: 'linear-gradient(to right, #96fbc4 0%, #f9f586 100%)',
      sidebarButtonColor: '#37a967ff',
      // sidebarButtonColor: 'linear-gradient(to left, #f0f2ebff 0%, #96e6a1 100%);',
      sidebarToggleBg: '#ffffff',
      sidebarToggleHoverBg: '#f1f5f9',
      sidebarToggleBorder: '1px solid rgba(15,23,42,0.1)',
      sidebarToggleColor: '#0f172a',
    };
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const searchInputStyle = useMemo(
    () =>
      ({
        '--chat-search-bg': themeTokens.searchInputBg,
        '--chat-search-border': themeTokens.searchInputBorder,
        '--chat-search-color': themeTokens.searchInputColor,
        '--chat-search-placeholder': themeTokens.searchInputPlaceholder,
      }) as CSSProperties,
    [themeTokens],
  );

  const messageInputStyle = useMemo(
    () =>
      ({
        background: 'transparent',
        padding: 0,
        lineHeight: 1.5,
        color: themeTokens.composerTextColor,
        fontSize: '1.05rem',
        minHeight: 48,
        '--chat-message-placeholder': themeTokens.composerPlaceholderColor,
      }) as CSSProperties,
    [themeTokens],
  );

  const renderEmptyDescription = useCallback(
    (text: string) => <span style={{ color: themeTokens.textMuted }}>{text}</span>,
    [themeTokens.textMuted],
  );

  const sendButtonStyle = useMemo(
    () =>
      ({
        '--chat-send-bg': themeTokens.sendButtonBg,
        '--chat-send-bg-hover': themeTokens.sendButtonBgHover,
        '--chat-send-color': themeTokens.sendButtonColor,
        '--chat-send-disabled-bg': themeTokens.sendButtonDisabledBg,
        '--chat-send-disabled-color': themeTokens.sendButtonDisabledColor,
      }) as CSSProperties,
    [themeTokens],
  );

  const handleComposerMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.chat-send-button') || target?.tagName === 'TEXTAREA') {
        return;
      }
      event.preventDefault();
      messageInputRef.current?.focus();
    },
    [messageInputRef],
  );

  const sidebarButtonStyle = useMemo(
    () =>
      ({
        '--chat-sidebar-btn-bg': themeTokens.sidebarButtonBg,
        '--chat-sidebar-btn-bg-hover': themeTokens.sidebarButtonBgHover,
        '--chat-sidebar-btn-color': themeTokens.sidebarButtonColor,
      }) as CSSProperties,
    [themeTokens],
  );

  const sidebarToggleStyle = useMemo(
    () =>
      ({
        '--chat-toggle-bg': themeTokens.sidebarToggleBg,
        '--chat-toggle-hover-bg': themeTokens.sidebarToggleHoverBg,
        '--chat-toggle-border': themeTokens.sidebarToggleBorder,
        '--chat-toggle-color': themeTokens.sidebarToggleColor,
      }) as CSSProperties,
    [themeTokens],
  );

  const triggerSessionRefresh = useCallback((options?: { gotoFirstPage?: boolean }) => {
    if (options?.gotoFirstPage) {
      setSessionPageNum(1);
    }
    setSessionRefreshToken((token) => token + 1);
  }, []);

  const fetchMessages = useCallback(
    async (sessionId: string) => {
      setMessageLoading(true);
      try {
        const response = await listByCursor({
          sessionId,
          pageSize: 30,
        });
        if (response.code !== 0) {
          message.error(response.message || '无法加载聊天记录');
          setMessages([]);
          return;
        }
        const records = response.data?.records ?? [];
        const normalized = records
          .map(normalizeMessage)
          .filter((item): item is ChatMessage => !!item)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(normalized);
      } catch (error) {
        message.error(error instanceof Error ? error.message : '聊天记录加载失败');
        setMessages([]);
      } finally {
        setMessageLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    let cancelled = false;
    const fetchSessionPage = async () => {
      setSessionLoading(true);
      try {
        const response = await listChatSessionVoByPage({
          pageNum: sessionPageNum,
          pageSize: SESSION_PAGE_SIZE,
          sortField: 'updateTime',
          sortOrder: 'descend',
        });
        if (cancelled) {
          return;
        }
        if (response.code !== 0) {
          message.error(response.message || '无法获取会话列表');
          setSessions([]);
          setSessionTotalCount(0);
          setSelectedSessionId(() => null);
          return;
        }
        const totalCount = response.data?.total ?? 0;
        setSessionTotalCount(totalCount);
        if (totalCount === 0) {
          setSessions([]);
          setSelectedSessionId(() => null);
          if (sessionPageNum !== 1) {
            setSessionPageNum(1);
          }
          return;
        }
        const totalPages = Math.ceil(totalCount / SESSION_PAGE_SIZE);
        if (sessionPageNum > totalPages) {
          setSessionPageNum(totalPages);
          return;
        }
        const records = response.data?.records ?? [];
        const normalized = records.map(normalizeSession).filter((item): item is SessionItem => !!item);
        setSessions(normalized);
        setSelectedSessionId((current) => {
          if (normalized.length === 0) {
            return null;
          }
          return current ?? normalized[0].id;
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        message.error(error instanceof Error ? error.message : '会话列表加载失败');
        setSessions([]);
        setSessionTotalCount(0);
        setSelectedSessionId(() => null);
      } finally {
        if (!cancelled) {
          setSessionLoading(false);
        }
      }
    };

    void fetchSessionPage();

    return () => {
      cancelled = true;
    };
  }, [message, sessionPageNum, sessionRefreshToken]);

  useEffect(() => {
    if (!selectedSessionId) {
      if (!sending) {
        setMessages([]);
      }
      return;
    }
    if (sending) {
      return;
    }
    void fetchMessages(selectedSessionId);
  }, [selectedSessionId, fetchMessages, sending]);

  const handleSessionPageChange = (direction: 'prev' | 'next') => {
    if (!sessionHasData) {
      return;
    }
    const delta = direction === 'next' ? 1 : -1;
    const nextPage = sessionPageNum + delta;
    if (nextPage < 1 || nextPage > sessionTotalPages) {
      return;
    }
    setSessionPageNum(nextPage);
  };

  const handleCreateSession = () => {
    if (sending) {
      message.warning('当前对话仍在生成中，请稍后再新建');
      return;
    }
    setSelectedSessionId(null);
    setMessages([]);
    setDraft('');
    message.success('已开始新的对话，请输入你的问题');
  };

  const handleSelectSession = (sessionId: string) => {
    if (sending) {
      message.warning('当前对话仍在生成中，请稍后切换会话');
      return;
    }
    if (sessionId === selectedSessionId) {
      return;
    }
    setMessages([]);
    setDraft('');
    setSelectedSessionId(sessionId);
  };

  const renderMarkdownContent = useCallback(
    (content: string) => (
      <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    ),
    [],
  );

  const sendMessage = async (content: string, onReset?: () => void) => {
    const trimmed = content.trim();
    if (!trimmed || sending) {
      return;
    }
    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    const placeholderId = `assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: placeholderId,
      role: 'assistant',
      content: '正在思考...',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    onReset?.();
    setSending(true);
    let resolvedSessionId: string | null = selectedSessionId;
    let assistantBuffer = '';
    let finalResponseText = '';
    const syncSessionId = (incoming?: number | string) => {
      const normalized = toSafeId(incoming);
      if (!normalized || normalized === '0') {
        return;
      }
      resolvedSessionId = normalized;
    };
    let shouldRefreshSessions = false;
    try {
      await streamChatWithMemoryRequest(
        {
          message: trimmed,
          sessionId: resolvedSessionId ?? '0',
        },
        (event) => {
          syncSessionId(event.sessionId);
          const eventType = event.t ?? '';
          if (eventType === 'message') {
            assistantBuffer += event.d ?? '';
            const visibleText = sanitizeModelOutput(assistantBuffer);
            setMessages((prev) =>
              prev.map((item) =>
                item.id === placeholderId
                  ? {
                    ...item,
                    content: visibleText || '正在生成回答...',
                  }
                  : item,
              ),
            );
            return;
          }
          if (eventType === 'final.object') {
            const payload = parseHistoryPayload(event.d);
            const parsed = extractTextFromPayload(payload);
            finalResponseText = parsed || event.d || finalResponseText;
            return;
          }
          if (eventType === 'message.end') {
            const resolvedText = sanitizeModelOutput(finalResponseText || assistantBuffer);
            const safeContent = resolvedText || '暂无回复，请稍后重试。';
            setMessages((prev) =>
              prev.map((item) =>
                item.id === placeholderId
                  ? {
                    ...item,
                    content: safeContent,
                    status: 'sent',
                  }
                  : item,
              ),
            );
          }
        },
      );
      shouldRefreshSessions = Boolean(resolvedSessionId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送失败，请稍后重试';
      setMessages((prev) =>
        prev.map((item) =>
          item.id === placeholderId
            ? {
              ...item,
              content: errorMessage,
              status: 'error',
            }
            : item,
        ),
      );
      message.error(errorMessage);
    } finally {
      if (resolvedSessionId && resolvedSessionId !== selectedSessionId) {
        setSelectedSessionId(resolvedSessionId);
      }
      if (shouldRefreshSessions) {
        triggerSessionRefresh({ gotoFirstPage: true });
      }
      setSending(false);
    }
  };

  const handleOpenProfileModal = () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    profileForm.setFieldsValue({
      userName: user.userName ?? '',
      userAvatar: user.userAvatar ?? '',
      major: user.major ?? '',
      college: user.college ?? '',
      gradeYear: user.gradeYear,
      phone: user.phone ?? '',
      email: user.email ?? '',
    });
    setProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
    profileForm.resetFields();
  };

  const handleProfileFinish = async (values: ProfileFormValues) => {
    setProfileSubmitting(true);
    try {
      await updateProfile(values);
      message.success('个人资料已更新');
      handleProfileModalClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '更新失败，请稍后重试');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleOpenPasswordModal = () => {
    passwordForm.resetFields();
    setPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false);
    passwordForm.resetFields();
  };

  const handlePasswordFinish = async (values: PasswordFormValues) => {
    setPasswordSubmitting(true);
    try {
      await changePassword(values);
      message.success('密码修改成功');
      handlePasswordModalClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '修改失败，请稍后重试');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人资料' },
    { key: 'password', label: '修改密码' },
    { type: 'divider' },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await logout();
      message.success('已退出登录');
      navigate('/login', { replace: true });
      return;
    }
    if (key === 'profile') {
      handleOpenProfileModal();
      return;
    }
    if (key === 'password') {
      handleOpenPasswordModal();
      return;
    }
    message.info('功能开发中，敬请期待');
  };

  const renderMessages = () => {
    if (messageLoading && messages.length === 0) {
      return <Empty description={renderEmptyDescription('正在同步历史记录...')} />;
    }
    if (messages.length === 0) {
      return (
        <Flex
          vertical
          align="center"
          gap="small"
          style={{ color: themeTokens.textMuted, padding: '40px 0', textAlign: 'center' }}
        >
          <img src={emptyStateIllustration} alt="empty state" width={96} height={96} />
          <span>开始新的对话，百事通将全程协助你。</span>
        </Flex>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        {messages.map((item) => {
          const isUser = item.role === 'user';
          const bubbleBackground = isUser ? themeTokens.userBubbleBg : themeTokens.assistantBubbleBg;
          return (
            <div
              key={item.id}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '90%',
                    borderRadius: 20,
                    padding: '1px 16px',
                    background: bubbleBackground,
                    border: themeTokens.bubbleBorder,
                    boxShadow: isUser ? themeTokens.userBubbleShadow : 'none',
                    color: item.status === 'error' ? '#dc2626' : themeTokens.textPrimary,
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {renderMarkdownContent(item.content)}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: themeTokens.timestampColor,
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {isUser ? displayName : '百事通助理'} · {formatDate(item.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const sidebar = (
    <Flex
      vertical
      style={{ height: '100%', padding: 16, color: themeTokens.textPrimary }}
      gap="middle"
    >
      <Flex align="center" gap="small">
        <BrandMark size="md" label="NJ" />
        <Flex vertical>
          <Title level={5} style={{ margin: 0, color: themeTokens.headingColor }}>
            百事通智能体
          </Title>
          <Text type="secondary" style={{ fontSize: '0.8rem', color: themeTokens.textMuted }}>
            南京邮电大学
          </Text>
        </Flex>
      </Flex>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateSession}
        className="chat-sidebar-primary-btn"
        style={sidebarButtonStyle}
      >
        新建对话
      </Button>
      <Input
        className="chat-search-input"
        style={searchInputStyle}
        placeholder="搜索会话"
        prefix={<SearchOutlined />}
        allowClear
        value={sessionSearch}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSessionSearch(event.target.value);
          setSessionPageNum(1);
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: themeTokens.paginationText,
          fontWeight: 600,
        }}
      >
        <button
          type="button"
          onClick={() => handleSessionPageChange('prev')}
          disabled={!canGoPrevSessionPage}
          style={{
            border: 'none',
            background: 'transparent',
            color: canGoPrevSessionPage ? themeTokens.paginationText : themeTokens.paginationDisabled,
            cursor: canGoPrevSessionPage ? 'pointer' : 'not-allowed',
            fontSize: 16,
            padding: '4px 8px',
          }}
        >
          {'<'}
        </button>
        <Text
          type="secondary"
          style={{ minWidth: 64, textAlign: 'center', color: themeTokens.paginationText }}
        >
          {sessionPageDisplay} / {sessionPageDisplayTotal}
        </Text>
        <button
          type="button"
          onClick={() => handleSessionPageChange('next')}
          disabled={!canGoNextSessionPage}
          style={{
            border: 'none',
            background: 'transparent',
            color: canGoNextSessionPage ? themeTokens.paginationText : themeTokens.paginationDisabled,
            cursor: canGoNextSessionPage ? 'pointer' : 'not-allowed',
            fontSize: 16,
            padding: '4px 8px',
          }}
        >
          {'>'}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sessionLoading ? (
          <Empty description={renderEmptyDescription('加载中...')} />
        ) : visibleSessions.length === 0 ? (
          <Empty description={renderEmptyDescription(sessionEmptyDescription)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleSessions.map((session) => (
              <button
                type="button"
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                style={{
                  textAlign: 'left',
                  border: themeTokens.sessionBorder,
                  borderRadius: 16,
                  padding: '8px 12px',
                  background:
                    selectedSessionId === session.id ? themeTokens.sessionSelectedBg : themeTokens.sessionBg,
                  cursor: 'pointer',
                  color: themeTokens.textPrimary,
                  transition: 'background 0.3s ease',
                }}
              >
                <div style={{ fontWeight: 600 }}>{session.title}</div>
                <div style={{ color: themeTokens.textMuted, fontSize: 12 }}>{session.updateLabel}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Flex justify="space-between" align="center" style={{ color: themeTokens.textPrimary }}>
        <Flex vertical>
          <Text strong style={{ color: themeTokens.headingColor }}>
            {displayName}
          </Text>
          <Text type="secondary" style={{ fontSize: 12, color: themeTokens.textMuted }}>
            {user?.college || '智能体内测 · Beta'}
          </Text>
        </Flex>
        <Dropdown
          trigger={['click']}
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
        >
          <Button type="text" icon={<SettingOutlined />} style={{ color: themeTokens.textPrimary }} />
        </Dropdown>
      </Flex>
    </Flex>
  );

  const hasMessages = messages.length > 0;
  const themeToggleLabel = isDarkMode ? '切换到日间模式' : '切换到夜间模式';
  const topBar = (
    <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
      <Space size="middle">
        <Button
          shape="circle"
          icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="chat-sidebar-toggle-btn"
          style={sidebarToggleStyle}
        />
        <Tag color="green" bordered={false}>
          Qwen3.0 校园版
        </Tag>
      </Space>
      <Space>
        <button
          type="button"
          className={`theme-toggle${isDarkMode ? ' theme-toggle--dark' : ''}`}
          onClick={handleThemeToggle}
          aria-label={themeToggleLabel}
          aria-pressed={isDarkMode}
        >
          <span className="theme-toggle__sparkle theme-toggle__sparkle--one" />
          <span className="theme-toggle__sparkle theme-toggle__sparkle--two" />
          <span className="theme-toggle__thumb">
            {isDarkMode ? <MoonFilled /> : <SunOutlined />}
          </span>
        </button>
        <Dropdown
          trigger={['click']}
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
        >
          <Avatar size="large" style={{ backgroundColor: '#4c99cfff', cursor: 'pointer' }}>
            {userInitial}
          </Avatar>
        </Dropdown>
      </Space>
    </Flex>
  );

  return (
    <>
      <Layout
        style={{
          height: '100vh',
          overflow: 'hidden',
          background: themeTokens.layoutBg,
          color: themeTokens.textPrimary,
        }}
      >
        <Sider
          theme={isDarkMode ? 'dark' : 'light'}
          collapsible
          collapsed={isSidebarCollapsed}
          collapsedWidth={0}
          trigger={null}
          width={280}
          style={{
            borderRight: themeTokens.sidebarBorder,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            background: themeTokens.surfaceBg,
            color: themeTokens.textPrimary,
          }}
        >
          {sidebar}
        </Sider>
        <Content
          style={{
            padding: '24px 32px 32px',
            background: themeTokens.layoutBg,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            minHeight: 0,
            overflow: 'hidden',
            color: themeTokens.textPrimary,
          }}
        >
          {topBar}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 0,
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 1100,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: hasMessages ? 16 : 24,
                padding: '0 12px',
                minHeight: 0,
              }}
            >
              {!hasMessages && (
                <Flex justify="space-between" align="center">
                  <div>
                    <Title level={2} style={{ marginBottom: 4, color: themeTokens.headingColor }}>
                      你好，{displayName}
                    </Title>
                    <Text type="secondary" style={{ color: themeTokens.textMuted }}>
                      我可以帮你解答校园生活、课程学习、科研探索等所有问题。
                    </Text>
                  </div>
                  <Tag
                    bordered={false}
                    style={{ background: themeTokens.tagBg, color: themeTokens.tagColor, borderRadius: 12 }}
                  >
                    Beta
                  </Tag>
                </Flex>
              )}

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '8px 0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                  }}
                >
                  {renderMessages()}
                </div>

                <div
                  style={{
                    borderRadius: 20,
                    border: themeTokens.bubbleBorder,
                    background: themeTokens.composerOuterBg,
                    padding: 8,
                    boxShadow: themeTokens.composerShadow,
                    position: 'sticky',
                    bottom: 12,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      padding: '6px 12px',
                      background: themeTokens.composerInnerBg,
                      border: themeTokens.composerInnerBorder,
                      cursor: 'text',
                    }}
                    onMouseDown={handleComposerMouseDown}
                  >
                    <Input.TextArea
                      className="chat-message-input"
                      placeholder="输入消息，按 Enter 发送，Shift + Enter 换行"
                      value={draft}
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      onChange={(event) => setDraft(event.target.value)}
                      onPressEnter={(event) => {
                        if (!event.shiftKey) {
                          event.preventDefault();
                          void sendMessage(draft, () => setDraft(''));
                        }
                      }}
                      bordered={false}
                      ref={messageInputRef}
                      style={messageInputStyle}
                    />
                    <Flex justify="flex-end" align="center" style={{ marginTop: 8 }}>
                      <Button
                        type="primary"
                        className="chat-send-button"
                        style={sendButtonStyle}
                        shape="circle"
                        icon={<SendOutlined />}
                        onClick={() => sendMessage(draft, () => setDraft(''))}
                        loading={sending}
                        disabled={!draft.trim() || sending}
                      />
                    </Flex>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      <Modal
        title="编辑个人资料"
        open={profileModalOpen}
        onCancel={handleProfileModalClose}
        onOk={() => profileForm.submit()}
        okText="保存"
        cancelText="取消"
        confirmLoading={profileSubmitting}
        destroyOnClose
      >
        <Form form={profileForm} layout="vertical" onFinish={handleProfileFinish}>
          <Form.Item
            label="姓名"
            name="userName"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="头像链接" name="userAvatar">
            <Input placeholder="请输入头像图片地址" />
          </Form.Item>
          <Form.Item label="专业" name="major">
            <Input placeholder="如：计算机科学与技术" />
          </Form.Item>
          <Form.Item label="学院" name="college">
            <Input placeholder="如：计算机学院" />
          </Form.Item>
          <Form.Item label="入学年份" name="gradeYear">
            <InputNumber min={2000} max={2100} style={{ width: '100%' }} placeholder="2022" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ pattern: /^1\d{10}$/, message: '请输入有效的手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="示例：student@njupt.edu.cn" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onCancel={handlePasswordModalClose}
        onOk={() => passwordForm.submit()}
        okText="保存"
        cancelText="取消"
        confirmLoading={passwordSubmitting}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordFinish}>
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度至少 8 位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChatPage;
