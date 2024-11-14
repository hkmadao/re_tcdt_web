import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TMenu } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TMenu>[] = () => {
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
      title: '系统菜单id',
      dataIndex: 'idMenu',
      key: 'idMenu',
      render: (_dom: any, record: any) => {
        return <>{record.idMenu ? record.idMenu : '--'}</>;
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
    {
      width: 150,
      title: '显示标志',
      dataIndex: 'fgShow',
      key: 'fgShow',
      render: (_dom: any, record: any) => {
        return (
          <>
            <Checkbox checked={record.fgShow ?? false} />
          </>
        );
      },
    },
    {
      width: 150,
      title: '路由参数',
      dataIndex: 'query',
      key: 'query',
      render: (_dom: any, record: any) => {
        return <>{record.query ? record.query : '--'}</>;
      },
    },
    {
      width: 150,
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      render: (_dom: any, record: any) => {
        return <>{record.menuType ? record.menuType : '--'}</>;
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
    {
      width: 150,
      title: '前端权限标识',
      dataIndex: 'webPerms',
      key: 'webPerms',
      render: (_dom: any, record: any) => {
        return <>{record.webPerms ? record.webPerms : '--'}</>;
      },
    },
    {
      width: 150,
      title: '后台权限标识',
      dataIndex: 'servicePerms',
      key: 'servicePerms',
      render: (_dom: any, record: any) => {
        return <>{record.servicePerms ? record.servicePerms : '--'}</>;
      },
    },
    {
      width: 150,
      title: '上级系统菜单',
      dataIndex: ['idParent', 'parent'],
      key: 'idParent',
      render: (_dom: any, record: any) => {
        const refConf = getRefByAttr(
          EPartName.Header,
          'menu',
          'idParent',
          billformConf!,
        );
        if (refConf) {
          const refData = (record as any).parent;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
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
