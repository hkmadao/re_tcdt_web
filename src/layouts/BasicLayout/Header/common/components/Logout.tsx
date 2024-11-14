import { FC, useEffect, useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Space, Modal, message } from 'antd';
import {
  getLonginUser,
  User,
  setLonginUser,
  clearSessionStore,
} from '@/session';
import API from '../api';
import { useLogoutLocaleMsg } from '@/locales/hooks';

const Logout: FC = () => {
  const logoutMsg = useLogoutLocaleMsg();
  const [user, setUser] = useState({} as User);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {}, []);

  const handleToLoggout = () => {
    setIsModalVisible(true);
  };

  const handleLoggout = async () => {
    try {
      // 注销
      await API.logout();
      setIsModalVisible(false);
      message.success(logoutMsg.logoutSuccessMsg);
      clearSessionStore();
      // history.push('/login');
      const user = getLonginUser();
      setLonginUser({ ...user, token: undefined });
      setIsModalVisible(false);
    } catch (error) {
      message.error(logoutMsg.logoutFailMsg);
    }
  };

  const handleCancelLoggout = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Space onClick={handleToLoggout}>
        <LogoutOutlined />
        {logoutMsg.logoutMsg}
      </Space>
      <Modal
        title="确认退出"
        open={isModalVisible}
        onOk={handleLoggout}
        onCancel={handleCancelLoggout}
      >
        确认退出
      </Modal>
    </>
  );
};

export default Logout;
