import { FC, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { history, useLocation } from 'umi';
import { getLonginUser, User } from '@/session';
import styles from './index.less';
import Logout from '../common/components/Logout';
import Login from '../common/components/Login';
import Locale from '../common/components/Locale';
import Sevice from '../common/components/Sevice';

enum EPathKey {
  Descriptdata = '/devmanager/descriptdata',
  ComponentData = '/devmanager/ComponentData',
  ComponentDTO = '/devmanager/ComponentDTO',
  MainFactory = '/devmanager/MainFactory',
  Query = '/devmanager/factory/units/Query',
  Form = '/devmanager/factory/units/Form',
  Tree = '/devmanager/factory/units/Tree',
  Action = '/devmanager/factory/units/Action',
  AttributeType = '/devmanager/AttributeType',
  CommonAttribute = '/devmanager/Commonattribute',
  // InternalMethod = '/devmanager/InternalMethodAgg',
  Process = '/client/programconf',
}

const pathObject: any = {
  [EPathKey.Descriptdata]: 'ER图设计',
  [EPathKey.ComponentData]: '组件建模',
  [EPathKey.ComponentDTO]: '出入参设计',
  [EPathKey.MainFactory]: 'UI配置',
  [EPathKey.Query]: '查询建模',
  [EPathKey.Form]: '表单建模',
  [EPathKey.Tree]: '树建模',
  [EPathKey.Action]: '按钮建模',
  [EPathKey.AttributeType]: '数据类型配置',
  [EPathKey.CommonAttribute]: '公共属性',
  // [EPathKey.InternalMethod]: '内置方法配置',
  [EPathKey.Process]: '程序配置',
};

const CilentHeader: FC = () => {
  const localtion = useLocation();
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

  const menu: MenuProps = {
    items: [
      {
        key: 'dataType',
        label: '数据类型配置',
        disabled: EPathKey.AttributeType === localtion.pathname,
        onClick: (e) => {
          if (localtion.pathname !== EPathKey.AttributeType) {
            history.push(EPathKey.AttributeType);
          }
        },
      },
      {
        key: 'CommonAttribute',
        label: '公共属性',
        disabled: EPathKey.CommonAttribute === localtion.pathname,
        onClick: (e) => {
          if (localtion.pathname !== EPathKey.CommonAttribute) {
            history.push(EPathKey.CommonAttribute);
          }
        },
      },
      // {
      //   key: 'internalMethod',
      //   label: '内置方法配置',
      //   disabled: EPathKey.InternalMethod === localtion.pathname,
      //   onClick: (e) => {
      //     if (localtion.pathname !== EPathKey.InternalMethod) {
      //       history.push(EPathKey.InternalMethod);
      //     }
      //   },
      // },
      {
        key: 'processConfig',
        label: '程序配置',
        disabled: EPathKey.Process === localtion.pathname,
        onClick: (e) => {
          if (localtion.pathname !== EPathKey.Process) {
            history.push(EPathKey.Process);
          }
        },
      },
    ],
  };

  const handleToView = (pathKey: EPathKey) => {
    return () => {
      if (localtion.pathname !== pathKey) {
        history.push(pathKey);
      }
    };
  };

  return (
    <>
      <div className={styles['header']}>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            height: '30px',
            lineHeight: '30px',
          }}
        >
          <div style={{ display: 'flex', flex: '0 1 20%', paddingLeft: 20 }}>
            <div
              style={{
                color: '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              {pathObject[localtion.pathname]}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              gap: '10px',
              justifyContent: 'end',
            }}
          >
            <div
              onClick={handleToView(EPathKey.Descriptdata)}
              style={{
                cursor:
                  EPathKey.Descriptdata === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.Descriptdata === localtion.pathname
                    ? '#e6f7ff'
                    : '#ebebeb',
                color:
                  EPathKey.Descriptdata === localtion.pathname
                    ? '#1890ff'
                    : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              ER图设计
            </div>
            <div
              onClick={handleToView(EPathKey.ComponentData)}
              style={{
                cursor:
                  EPathKey.ComponentData === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.ComponentData === localtion.pathname
                    ? '#e6f7ff'
                    : '#ebebeb',
                color:
                  EPathKey.ComponentData === localtion.pathname
                    ? '#1890ff'
                    : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              组件建模
            </div>
            <div
              onClick={handleToView(EPathKey.ComponentDTO)}
              style={{
                cursor:
                  EPathKey.ComponentDTO === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.ComponentDTO === localtion.pathname
                    ? '#e6f7ff'
                    : '#ebebeb',
                color:
                  EPathKey.ComponentDTO === localtion.pathname
                    ? '#1890ff'
                    : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              DTO设计
            </div>
            <div
              onClick={handleToView(EPathKey.MainFactory)}
              style={{
                cursor:
                  EPathKey.MainFactory === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.MainFactory === localtion.pathname
                    ? '#e6f7ff'
                    : '#ebebeb',
                color:
                  EPathKey.MainFactory === localtion.pathname
                    ? '#1890ff'
                    : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              页面设计
            </div>
            <div
              onClick={handleToView(EPathKey.Query)}
              style={{
                cursor:
                  EPathKey.Query === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.Query === localtion.pathname ? '#e6f7ff' : '#ebebeb',
                color:
                  EPathKey.Query === localtion.pathname ? '#1890ff' : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              查询建模
            </div>
            <div
              onClick={handleToView(EPathKey.Form)}
              style={{
                cursor:
                  EPathKey.Form === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.Form === localtion.pathname ? '#e6f7ff' : '#ebebeb',
                color:
                  EPathKey.Form === localtion.pathname ? '#1890ff' : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              表单建模
            </div>
            <div
              onClick={handleToView(EPathKey.Tree)}
              style={{
                cursor:
                  EPathKey.Tree === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.Tree === localtion.pathname ? '#e6f7ff' : '#ebebeb',
                color:
                  EPathKey.Tree === localtion.pathname ? '#1890ff' : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              树建模
            </div>
            <div
              onClick={handleToView(EPathKey.Action)}
              style={{
                cursor:
                  EPathKey.Action === localtion.pathname
                    ? 'not-allowed'
                    : 'pointer',
                backgroundColor:
                  EPathKey.Action === localtion.pathname
                    ? '#e6f7ff'
                    : '#ebebeb',
                color:
                  EPathKey.Action === localtion.pathname ? '#1890ff' : '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              按钮建模
            </div>
            <Dropdown menu={menu} placement={'bottom'}>
              <div
                style={{
                  backgroundColor: '#ebebeb',
                  color: '#000',
                  padding: '0px 5px',
                  fontSize: 16,
                }}
              >
                ...
              </div>
            </Dropdown>
            <div
              style={{
                backgroundColor: '#ebebeb',
                color: '#000',
                padding: '0px 5px',
                fontSize: 16,
              }}
            >
              <div>
                <UserOutlined />
                {user?.nickName}
              </div>
            </div>
            <div hidden={!user?.token}>
              <Logout />
            </div>
            <div hidden={!!user?.token}>
              <Login />
            </div>
            <div>
              <Locale />
            </div>
            <div>
              <Sevice />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CilentHeader;
