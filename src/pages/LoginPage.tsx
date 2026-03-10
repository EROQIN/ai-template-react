import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Card, Flex, Form, Input, Space, Typography } from 'antd';
import { Link, type Location, useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/stores/authStore';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

type LoginFormValues = Pick<API.UserLoginRequest, 'studentNo' | 'userPassword'>;

export const LoginPage = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const { message } = AntdApp.useApp();

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: Location } | undefined;
    return state?.from?.pathname ?? '/';
  }, [location.state]);

  useEffect(() => {
    if (initialized && user) {
      navigate('/', { replace: true });
    }
  }, [initialized, user, navigate]);

  const handleFinish = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      await login(values);
      message.success('欢迎回来');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: '16px', backgroundColor: '#F5F5F5' }}>
      <Card style={{ width: 'min(440px, 100%)' }}>
        <Flex vertical align="center" gap="large">
          <Flex vertical align="center">
            <BrandMark size="lg" label="NJ" />
            <Title level={2} style={{ margin: '16px 0 4px' }}>
              欢迎来到 NJUPT 百事通
            </Title>
            <Text type="secondary">使用校园账号登录，即可与智能助手交流</Text>
          </Flex>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ width: '100%' }}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="studentNo"
              label="学号"
              rules={[
                { required: true, message: '请输入学号' },
                { min: 6, message: '学号长度至少 6 位' },
              ]}
            >
              <Input
                placeholder="输入您的校园学号"
                autoComplete="username"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="userPassword"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                placeholder="请输入登录密码"
                autoComplete="current-password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Flex justify="end" style={{ marginBottom: 16 }}>
              <Link to="/forgot-password">忘记密码？</Link>
            </Flex>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                登录
              </Button>
              <Button onClick={() => form.resetFields()} disabled={submitting} block>
                清空
              </Button>
            </Space>
          </Form>

          <Flex gap="small">
            <Text>还没有账号？</Text>
            <Link to="/register">立即注册</Link>
          </Flex>
          <Paragraph style={{ textAlign: 'center', fontSize: '0.8rem' }} type="secondary">
            登录即代表同意
            <Link to="https://www.njupt.edu.cn" target="_blank" rel="noreferrer">
              《用户协议》
            </Link>
            与
            <Link to="https://www.njupt.edu.cn" target="_blank" rel="noreferrer">
              《隐私政策》
            </Link>
          </Paragraph>
        </Flex>
      </Card>
    </Flex>
  );
};

export default LoginPage;
