import { AppRoutes } from '@/routes';
import { App as AntdApp, ConfigProvider, theme } from 'antd';

export function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#c7481f',
          borderRadius: 12,
          fontFamily:
            "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <AntdApp>
        <AppRoutes />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
