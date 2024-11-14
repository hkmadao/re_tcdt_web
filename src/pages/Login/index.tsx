import { Alert, message, Form, Input, Button, Checkbox } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import Footer from '@/components/Footer';
import { getRediectPath, setLonginUser } from '@/session';

import API from './api';
import { LoginParams, LoginResult } from './models';

import styles from './index.less';
import { hashSync } from 'bcryptjs';

const Login: React.FC = () => {
  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      // const password = hashSync(values.password!, values.username);
      const loginResult: LoginResult = await API.login({ ...values });
      setLonginUser({
        nickName: loginResult.nickName,
        username: loginResult.username,
        token: loginResult.token,
      });
      const path = getRediectPath();
      if (!path || path.includes('/login')) {
        history.push('/');
        return;
      }
      history.push(path);
    } catch (error) {
      message.error('登录异常！');
    }
  };

  const onFinish = (values: LoginParams) => {
    console.log('Success:', values);
    handleSubmit(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formdiv}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 14, span: 10 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
