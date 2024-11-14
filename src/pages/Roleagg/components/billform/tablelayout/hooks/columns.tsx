import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TRole, TUserRole, TRoleMenu } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TRole>[] = () => {
  const dispatch = useDispatch();
  const toEdit = () => {
    message.error('to be complate');
  };

  const detail = () => {
    message.error('to be complate');
  };

  const remove = () => {
    message.error('to be complate');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={toEdit}>
        编辑
      </Menu.Item>
      <Menu.Item key="2" onClick={detail}>
        详情
      </Menu.Item>
      <Menu.Item key="3" onClick={remove}>
        删除
      </Menu.Item>
    </Menu>
  );

  return [
    {
      width: 150,
      title: '角色id',
      dataIndex: 'idRole',
      key: 'idRole',
      render: (_dom: any, record: any) => {
        return <>{record.idRole ? record.idRole : '--'}</>;
      },
    },
    {
      width: 150,
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_dom: any, record: any) => {
        return <>{record.name ? record.name : '--'}</>;
      },
    },
    {
      width: 150,
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (_dom: any, record: any) => {
        return <>{record.displayName ? record.displayName : '--'}</>;
      },
    },
    /*[- */
    {
      width: 150,
      fixed: 'right',
      title: '操作',
      key: 'action',
      sorter: true,
      render: () => (
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            更多 <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
    /* -]*/
  ];
};
/**用户 */
export const useUserRolesColumns: () => TableColumnType<TUserRole>[] = () => {
  return [
    {
      title: '用户角色关系主属性',
      dataIndex: 'idSysUserRole',
      key: 'idSysUserRole',
      render: (_dom: any, record: any) => {
        return <>{record.idSysUserRole ? record.idSysUserRole : '--'}</>;
      },
    },
    {
      title: '系统用户',
      dataIndex: ['idUser', 'user'],
      key: 'idUser',
      render: (_dom: any, record: any) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'userRoles',
          'idUser',
          billformConf!,
        );
        if (refConf) {
          const refData = (record as any).user;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
/**菜单 */
export const useRoleMenusColumns: () => TableColumnType<TRoleMenu>[] = () => {
  return [
    {
      title: '角色与菜单id',
      dataIndex: 'idRoleMenu',
      key: 'idRoleMenu',
      render: (_dom: any, record: any) => {
        return <>{record.idRoleMenu ? record.idRoleMenu : '--'}</>;
      },
    },
    {
      title: '系统菜单',
      dataIndex: ['idMenu', 'menu'],
      key: 'idMenu',
      render: (_dom: any, record: any) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'roleMenus',
          'idMenu',
          billformConf!,
        );
        if (refConf) {
          const refData = (record as any).menu;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
