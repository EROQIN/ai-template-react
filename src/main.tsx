import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from '@/App.tsx';
import 'antd/dist/reset.css';
import '@/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1B5E20', // 深绿色
          colorLink: '#D84315', // 使用更深的橙色以保证对比度
          colorSuccess: '#4CAF50',
          colorWarning: '#FFC107', // 琥珀色
          colorError: '#F44336',
          colorInfo: '#1B5E20',
          borderRadius: 8,
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            paddingInline: 24,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
