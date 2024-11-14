import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TDataType } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TDataType>[] = () => {
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
      title: '数据类型编码',
      dataIndex: 'code',
      key: 'code',
      render: (_dom: any, record: any) => {
        return <>{record.code ? record.code : '--'}</>;
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
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (_dom: any, record: any) => {
        return <>{record.note ? record.note : '--'}</>;
      },
    },
    {
      width: 150,
      title: '序列号',
      dataIndex: 'sn',
      key: 'sn',
      render: (_dom: any, record: any) => {
        return <>{record.sn ? record.sn : '--'}</>;
      },
    },
    {
      width: 150,
      title: '长度',
      dataIndex: 'len',
      key: 'len',
      render: (_dom: any, record: any) => {
        return <>{record.len ? record.len : '--'}</>;
      },
    },
    {
      width: 150,
      title: '精度',
      dataIndex: 'pcs',
      key: 'pcs',
      render: (_dom: any, record: any) => {
        return <>{record.pcs ? record.pcs : '--'}</>;
      },
    },
    {
      width: 150,
      title: '字段类型',
      dataIndex: 'columnType',
      key: 'columnType',
      render: (_dom: any, record: any) => {
        return <>{record.columnType ? record.columnType : '--'}</>;
      },
    },
    {
      width: 150,
      title: '对象类型名称',
      dataIndex: 'objectType',
      key: 'objectType',
      render: (_dom: any, record: any) => {
        return <>{record.objectType ? record.objectType : '--'}</>;
      },
    },
    {
      width: 150,
      title: '对象类型包名',
      dataIndex: 'objectTypePackage',
      key: 'objectTypePackage',
      render: (_dom: any, record: any) => {
        return (
          <>{record.objectTypePackage ? record.objectTypePackage : '--'}</>
        );
      },
    },
    {
      width: 150,
      title: '项目',
      dataIndex: ['idProject', 'project'],
      key: 'idProject',
      render: (_dom: any, record: any) => {
        const refConf = getRefByAttr(
          EPartName.Header,
          'dataType',
          'idProject',
          billformConf!,
        );
        if (refConf) {
          const refData = (record as any).project;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
    {
      width: 150,
      title: '扩展属性1',
      dataIndex: 'ext1',
      key: 'ext1',
      render: (_dom: any, record: any) => {
        return <>{record.ext1 ? record.ext1 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '扩展属性2',
      dataIndex: 'ext2',
      key: 'ext2',
      render: (_dom: any, record: any) => {
        return <>{record.ext2 ? record.ext2 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '扩展属性3',
      dataIndex: 'ext3',
      key: 'ext3',
      render: (_dom: any, record: any) => {
        return <>{record.ext3 ? record.ext3 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '扩展属性4',
      dataIndex: 'ext4',
      key: 'ext4',
      render: (_dom: any, record: any) => {
        return <>{record.ext4 ? record.ext4 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '扩展属性5',
      dataIndex: 'ext5',
      key: 'ext5',
      render: (_dom: any, record: any) => {
        return <>{record.ext5 ? record.ext5 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '扩展属性6',
      dataIndex: 'ext6',
      key: 'ext6',
      render: (_dom: any, record: any) => {
        return <>{record.ext6 ? record.ext6 : '--'}</>;
      },
    },
    {
      width: 150,
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      render: (_dom: any, record: any) => {
        return <>{record.defaultValue ? record.defaultValue : '--'}</>;
      },
    },
    {
      width: 150,
      title: '必填标志',
      dataIndex: 'fgMandatory',
      key: 'fgMandatory',
      render: (_dom: any, record: any) => {
        return (
          <>
            <Checkbox checked={record.fgMandatory ?? false} />
          </>
        );
      },
    },
    {
      width: 150,
      title: 'TypeScript类型',
      dataIndex: 'typeScriptType',
      key: 'typeScriptType',
      render: (_dom: any, record: any) => {
        return <>{record.typeScriptType ? record.typeScriptType : '--'}</>;
      },
    },
    {
      width: 150,
      title: 'HTML5输入框类型',
      dataIndex: 'webInputType',
      key: 'webInputType',
      render: (_dom: any, record: any) => {
        return <>{record.webInputType ? record.webInputType : '--'}</>;
      },
    },
    {
      width: 150,
      title: '系统预置数据标识',
      dataIndex: 'fgPreset',
      key: 'fgPreset',
      render: (_dom: any, record: any) => {
        return (
          <>
            <Checkbox checked={record.fgPreset ?? false} />
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
