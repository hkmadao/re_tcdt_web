import { FC, useEffect, useState } from 'react';
import {
  MenuDataItem,
  ProBreadcrumb,
  ProLayout,
} from '@ant-design/pro-components';
import Header from './BasicLayout/Header';
import { Link, useLocation, useModel } from 'umi';
import routes from '../../config/routes';
import Banner from '../../public/tcdt-banner.png';
import styles from './index.less';
import classNames from 'classnames';
import { TAppInitial } from '@/menu';

// 侧边栏的默认关闭需要设置 breakpoint={false} ，如果只设置 defaultCollapsed 会无效
const BasicLayout: FC<any> = ({ children }) => {
  const fgCilent = !!window.tcdtAPI;
  const umiLocation = useLocation();
  const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>([]);
  const { initialState, loading, refresh, setInitialState } =
    useModel('@@initialState');

  useEffect(() => {
    setMenuSelectedKeys([umiLocation.pathname]);
  }, [umiLocation]);

  return (
    <ProLayout
      // className={classNames(styles.main)}
      layout={fgCilent ? 'top' : 'mix'}
      navTheme={'light'}
      logo={<img src={Banner} width={150} height={50} />}
      menuHeaderRender={(logo, title, props) =>
        props?.collapsed ? <>TCTD</> : logo
      }
      fixSiderbar={true}
      defaultCollapsed
      //有bug，会添加一个header元素，还写死内联样式，改动不了
      headerRender={() => <Header />}
      headerContentRender={() => <ProBreadcrumb />}
      fixedHeader={true}
      route={routes[1]}
      menuDataRender={(menuData: MenuDataItem[]) => {
        return (initialState as TAppInitial).menus;
      }}
      menuItemRender={({ path, name, ...props }) => {
        return (
          <Link to={path!} onClick={() => {}}>
            {name}
          </Link>
        );
      }}
      menu={{ defaultOpenAll: true }}
      token={{
        header: {},
        sider: {},
      }}
      menuProps={{
        selectedKeys: menuSelectedKeys,
      }}
    >
      {children}
    </ProLayout>
  );
};

export default BasicLayout;
