import { FC, useEffect, useState } from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { Space, Modal, message, Form, Input, Button } from 'antd';
import { md5 } from 'js-md5';
import API from '../api';
import { ModifyPasswordParams } from '../models';
import { clearSessionStore, getLonginUser, setLonginUser } from '@/session';
import { useChangePasswdLocaleMsg } from '@/locales/hooks';

const ModifyPassword: FC = () => {
  const changePasswdMsg = useChangePasswdLocaleMsg();
  const [form] = Form.useForm<ModifyPasswordParams>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {}, []);

  const handleToLogin = () => {
    form.resetFields();
    const loginUser = getLonginUser();
    form.setFieldValue('username', loginUser.username);
    setIsModalVisible(true);
  };

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const password = md5(values.password!);
      // 修改
      await API.modifyPassword({ ...values, password });

      clearSessionStore();
      const user = getLonginUser();
      setLonginUser({ ...user, token: undefined });
      message.info('密码修改成功，请重新登录！');
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error('服务异常！');
    }
  };

  const handleCancelLogin = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space onClick={handleToLogin}>
        <LoginOutlined />
        {changePasswdMsg.changepawsswdText}
      </Space>
      <Modal
        width={600}
        title={changePasswdMsg.changepawsswdText}
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
            label={changePasswdMsg.usernameText}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input readOnly={true} />
          </Form.Item>

          <Form.Item
            label={changePasswdMsg.oldPasswordText}
            name="oldPassword"
            rules={[
              { required: true, message: 'Please input your oldPassword!' },
            ]}
          >
            <Input.Password autoComplete={'new-password'} />
          </Form.Item>

          <Form.Item
            label={changePasswdMsg.newPasswordText}
            name="password"
            rules={[
              { required: true, message: 'Please input your NewPassword!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={changePasswdMsg.checkedPasswordText}
            name="checkedPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 14, span: 10 }} hidden>
            <Button type="primary" htmlType="submit">
              {changePasswdMsg.submitText}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModifyPassword;
