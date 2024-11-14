import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TUser, TUserRole } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TUser>[] = () => {
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
      title: '系统用户id',
      dataIndex: 'idUser',
      key: 'idUser',
      render: (_dom: any, record: any) => {
        return <>{record.idUser ? record.idUser : '--'}</>;
      },
    },
    {
      width: 150,
      title: '登录账号 ',
      dataIndex: 'account',
      key: 'account',
      render: (_dom: any, record: any) => {
        return <>{record.account ? record.account : '--'}</>;
      },
    },
    {
      width: 150,
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      render: (_dom: any, record: any) => {
        return <>{record.phone ? record.phone : '--'}</>;
      },
    },
    {
      width: 150,
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (_dom: any, record: any) => {
        return <>{record.email ? record.email : '--'}</>;
      },
    },
    {
      width: 150,
      title: '姓名 ',
      dataIndex: 'name',
      key: 'name',
      render: (_dom: any, record: any) => {
        return <>{record.name ? record.name : '--'}</>;
      },
    },
    {
      width: 150,
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render: (_dom: any, record: any) => {
        return <>{record.nickName ? record.nickName : '--'}</>;
      },
    },
    {
      width: 150,
      fixed: 'right',
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (_dom: any, record: any) => {
        if (record['gender'] === 'female') {
          return '女';
        }
        if (record['gender'] === 'unknown') {
          return '未知';
        }
        if (record['gender'] === 'male') {
          return '男';
        }
        return '--';
      },
    },
    {
      width: 150,
      title: '启用标志',
      dataIndex: 'fgActive',
      key: 'fgActive',
      render: (_dom: any, record: any) => {
        return (
          <>
            <Checkbox checked={record.fgActive ?? false} />
          </>
        );
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
/**系统用户 */
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
      title: '角色',
      dataIndex: ['idRole', 'role'],
      key: 'idRole',
      render: (_dom: any, record: any) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'userRoles',
          'idRole',
          billformConf!,
        );
        if (refConf) {
          const refData = (record as any).role;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
