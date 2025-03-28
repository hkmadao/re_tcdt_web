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
        const content = record.idUser ? record.idUser : '--';
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
      title: '登录账号 ',
      dataIndex: 'account',
      key: 'account',
      render: (_dom: any, record: any) => {
        const content = record.account ? record.account : '--';
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
      title: '用户密码 ',
      dataIndex: 'userPwd',
      key: 'userPwd',
      render: (_dom: any, record: any) => {
        const content = record.userPwd ? record.userPwd : '--';
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
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      render: (_dom: any, record: any) => {
        const content = record.phone ? record.phone : '--';
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
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (_dom: any, record: any) => {
        const content = record.email ? record.email : '--';
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
      title: '姓名 ',
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
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render: (_dom: any, record: any) => {
        const content = record.nickName ? record.nickName : '--';
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
  ];
};
/**系统用户 */
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
