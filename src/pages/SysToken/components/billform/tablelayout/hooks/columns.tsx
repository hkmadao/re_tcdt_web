import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import CustomDateTimeText from '@/components/CustomDateTimeText';
import { TToken } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TToken>[] = () => {
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
      title: '令牌主属性',
      dataIndex: 'idSysToken',
      key: 'idSysToken',
      render: (_dom: any, record: any) => {
        return <>{record.idSysToken ? record.idSysToken : '--'}</>;
      },
    },
    {
      width: 150,
      title: '用户名称',
      dataIndex: 'username',
      key: 'username',
      render: (_dom: any, record: any) => {
        return <>{record.username ? record.username : '--'}</>;
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (_dom: any, record: any) => {
        return (
          <>
            <CustomDateTimeText
              value={record.createTime}
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </>
        );
      },
    },
    {
      width: 150,
      title: '令牌',
      dataIndex: 'token',
      key: 'token',
      render: (_dom: any, record: any) => {
        return <>{record.token ? record.token : '--'}</>;
      },
    },
    {
      width: 150,
      title: '过期时间',
      dataIndex: 'expiredTime',
      key: 'expiredTime',
      render: (_dom: any, record: any) => {
        return (
          <>
            <CustomDateTimeText
              value={record.expiredTime}
              format="YYYY-MM-DDTHH:mm:ssZ"
              displayFormat="YYYY-MM-DD HH:mm:ss"
            />
          </>
        );
      },
    },
    {
      width: 150,
      title: '用户信息序列化',
      dataIndex: 'userInfoString',
      key: 'userInfoString',
      render: (_dom: any, record: any) => {
        return <>{record.userInfoString ? record.userInfoString : '--'}</>;
      },
    },
  ];
};
