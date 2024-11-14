import { FC, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Space, Dropdown } from 'antd';
import { getLonginUser, User } from '@/session';
import Logout from '../common/components/Logout';
import Login from '../common/components/Login';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import ModifyPassword from '../common/components/ModifyPassword';
import Profile from '../common/components/Profile';
import Locale from '../common/components/Locale';
import Sevice from '../common/components/Sevice';

const WebHeader: FC<{}> = (props) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const loginUser: User = getLonginUser();
    setUser(loginUser);
    //设置定时器检查登录信息
    const interval = setInterval(() => {
      const loginUser: User = getLonginUser();
      setUser(loginUser);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const menuItems: ItemType[] = [
    {
      key: 'userInfo',
      label: <Profile />,
    },
    {
      key: 'modifyPW',
      label: <ModifyPassword />,
    },
  ];

  return (
    <>
      <Space
        size={20}
        style={{ position: 'relative', display: 'flex', justifyContent: 'end' }}
      >
        <Dropdown menu={{ items: menuItems }} placement={'bottom'}>
          <Space style={{ minWidth: '80px' }}>
            <UserOutlined />
            {user?.nickName ?? '--'}
          </Space>
        </Dropdown>
        <div>{!user?.token ? <Login /> : <Logout />}</div>
        <Locale />
        <Sevice />
        <div></div>
      </Space>
    </>
  );
};

export default WebHeader;
