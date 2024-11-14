import { FC, useEffect, useState } from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { Space, Modal, message, Form, Input, Checkbox, Button } from 'antd';
import { md5 } from 'js-md5';
import { setLonginUser } from '@/session';
import API from '../api';
import { LoginParams, LoginResult } from '../models';
import { useLoginLocaleMsg } from '@/locales/hooks';

const Login: FC = () => {
  const localeMsg = useLoginLocaleMsg();
  const [form] = Form.useForm<LoginParams>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {}, []);

  const handleToLogin = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const password = md5(values.password!);
      // 登录
      const loginResult: LoginResult = await API.login({ ...values, password });
      setLonginUser({
        nickName: loginResult.nickName,
        username: loginResult.username,
        token: loginResult.token,
      });
      message.info(localeMsg.successMsg);
      setIsModalVisible(false);
    } catch (error) {
      message.error(localeMsg.failMsg);
    }
  };

  const handleCancelLogin = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space onClick={handleToLogin}>
        <LoginOutlined />
        {localeMsg.loginText}
      </Space>
      <Modal
        width={600}
        title={localeMsg.loginText}
        open={isModalVisible}
        onOk={handleLogin}
        onCancel={handleCancelLogin}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 11 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label={localeMsg.usernameText}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={localeMsg.passwordText}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password autoComplete={'new-password'} />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
            hidden
          >
            <Checkbox>{localeMsg.rememberText}</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 14, span: 10 }} hidden>
            <Button type="primary" htmlType="submit">
              {localeMsg.loginText}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Login;
