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
      title: '数据类型id',
      dataIndex: 'idDataType',
      key: 'idDataType',
      render: (_dom: any, record: any) => {
        const content = record.idDataType ? record.idDataType : '--';
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
      title: '数据类型编码',
      dataIndex: 'code',
      key: 'code',
      render: (_dom: any, record: any) => {
        const content = record.code ? record.code : '--';
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
    {
      width: 150,
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (_dom: any, record: any) => {
        const content = record.note ? record.note : '--';
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
        const content = record.columnType ? record.columnType : '--';
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
      title: '对象类型名称',
      dataIndex: 'objectType',
      key: 'objectType',
      render: (_dom: any, record: any) => {
        const content = record.objectType ? record.objectType : '--';
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
      title: '对象类型包名',
      dataIndex: 'objectTypePackage',
      key: 'objectTypePackage',
      render: (_dom: any, record: any) => {
        const content = record.objectTypePackage
          ? record.objectTypePackage
          : '--';
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
      title: '扩展属性1',
      dataIndex: 'ext1',
      key: 'ext1',
      render: (_dom: any, record: any) => {
        const content = record.ext1 ? record.ext1 : '--';
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
      title: '扩展属性2',
      dataIndex: 'ext2',
      key: 'ext2',
      render: (_dom: any, record: any) => {
        const content = record.ext2 ? record.ext2 : '--';
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
      title: '扩展属性3',
      dataIndex: 'ext3',
      key: 'ext3',
      render: (_dom: any, record: any) => {
        const content = record.ext3 ? record.ext3 : '--';
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
      title: '扩展属性4',
      dataIndex: 'ext4',
      key: 'ext4',
      render: (_dom: any, record: any) => {
        const content = record.ext4 ? record.ext4 : '--';
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
      title: '扩展属性5',
      dataIndex: 'ext5',
      key: 'ext5',
      render: (_dom: any, record: any) => {
        const content = record.ext5 ? record.ext5 : '--';
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
      title: '扩展属性6',
      dataIndex: 'ext6',
      key: 'ext6',
      render: (_dom: any, record: any) => {
        const content = record.ext6 ? record.ext6 : '--';
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
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      render: (_dom: any, record: any) => {
        const content = record.defaultValue ? record.defaultValue : '--';
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
        const content = record.typeScriptType ? record.typeScriptType : '--';
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
      title: 'HTML5输入框类型',
      dataIndex: 'webInputType',
      key: 'webInputType',
      render: (_dom: any, record: any) => {
        const content = record.webInputType ? record.webInputType : '--';
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
  ];
};
