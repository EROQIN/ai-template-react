import { useEffect, useState } from 'react';
import { App as AntdApp, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

type RegisterFormValues = API.UserRegisterRequest;

export const RegisterPage = () => {
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const [submitting, setSubmitting] = useState(false);
  const { message } = AntdApp.useApp();

  useEffect(() => {
    if (initialized && user) {
      navigate('/', { replace: true });
    }
  }, [initialized, user, navigate]);

  const handleFinish = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      await register(values);
      message.success('注册成功，已自动登录');
      navigate('/', { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败，请重试');
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
              创建 NJUPT 百事通账号
            </Title>
            <Text type="secondary">完善资料后即可体验定制化校园助手</Text>
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
                placeholder="设置登录学号"
                autoComplete="username"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="userPassword"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少 6 位' },
              ]}
            >
              <Input.Password
                placeholder="至少 6 位字符"
                autoComplete="new-password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="checkPassword"
              label="确认密码"
              dependencies={['userPassword']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="再次输入密码"
                autoComplete="new-password"
                prefix={<CheckCircleOutlined />}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                创建账号
              </Button>
            </Form.Item>
          </Form>

          <Flex gap="small">
            <Text>已经注册？</Text>
            <Link to="/login">返回登录</Link>
          </Flex>
          <Paragraph style={{ textAlign: 'center', fontSize: '0.8rem' }} type="secondary">
            copyright © 2025 NJUPT Intelligent Lab
          </Paragraph>
        </Flex>
      </Card>
    </Flex>
  );
};

export default RegisterPage;
