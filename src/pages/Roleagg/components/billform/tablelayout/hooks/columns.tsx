import {
  Checkbox,
  Dropdown,
  Menu,
  TableColumnType,
  message,
  Popover,
} from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import CustomDateTimeText from '@/components/CustomDateTimeText';
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
        const content = record.idRole ? record.idRole : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      width: 150,
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_dom: any, record: any) => {
        const content = record.name ? record.name : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      width: 150,
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (_dom: any, record: any) => {
        const content = record.displayName ? record.displayName : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
  ];
};
/**用户 */
export const useUserRolesColumns: () => TableColumnType<TUserRole>[] = () => {
  return [
    {
      width: 150,
      title: '用户角色关系主属性',
      dataIndex: 'idSysUserRole',
      key: 'idSysUserRole',
      render: (_dom: any, record: any) => {
        const content = record.idSysUserRole ? record.idSysUserRole : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      width: 150,
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
      width: 150,
      title: '角色与菜单id',
      dataIndex: 'idRoleMenu',
      key: 'idRoleMenu',
      render: (_dom: any, record: any) => {
        const content = record.idRoleMenu ? record.idRoleMenu : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      width: 150,
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
