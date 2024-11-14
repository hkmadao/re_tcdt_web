import { FC, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Space, Modal, Form } from 'antd';
import API from '../api';
import { TProfile } from '../models';
import { useProfileLocaleMsg } from '@/locales/hooks';

const Profile: FC = () => {
  const profileMsg = useProfileLocaleMsg();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<TProfile>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {}, []);

  const handleToLogin = async () => {
    const proflile: TProfile = await API.getProfile();
    setProfile(proflile);
    setIsModalVisible(true);
  };

  const handleLogin = async () => {
    setIsModalVisible(false);
  };

  const handleCancelLogin = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space onClick={handleToLogin}>
        <UserOutlined />
        {profileMsg.profileText}
      </Space>
      <Modal
        width={600}
        title={profileMsg.profileText}
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
          <Form.Item label={profileMsg.accountText} name="account">
            {profile?.account ?? '--'}
          </Form.Item>
          <Form.Item label={profileMsg.nameText} name="name">
            {profile?.name ?? '--'}
          </Form.Item>
          <Form.Item label={profileMsg.nickNameText} name="nickName">
            {profile?.nickName ?? '--'}
          </Form.Item>
          <Form.Item label={profileMsg.phoneText} name="phone">
            {profile?.phone ?? '--'}
          </Form.Item>
          <Form.Item label={profileMsg.emailText} name="email">
            {profile?.email ?? '--'}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
