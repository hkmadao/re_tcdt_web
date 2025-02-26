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
import CustomDateText from '@/components/CustomDateText';
import { TCommonAttribute } from '../../../../models';
export const useMainTableColumns: () => TableColumnType<TCommonAttribute>[] =
  () => {
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
        title: '属性id',
        dataIndex: 'idCommonAttribute',
        key: 'idCommonAttribute',
        render: (_dom: any, record: any) => {
          const content = record.idCommonAttribute
            ? record.idCommonAttribute
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
        title: '属性名称',
        dataIndex: 'attributeName',
        key: 'attributeName',
        render: (_dom: any, record: any) => {
          const content = record.attributeName ? record.attributeName : '--';
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
        title: '字段名称',
        dataIndex: 'columnName',
        key: 'columnName',
        render: (_dom: any, record: any) => {
          const content = record.columnName ? record.columnName : '--';
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
        title: '是否必填',
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
        title: '数据长度',
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
        title: '序号',
        dataIndex: 'sn',
        key: 'sn',
        render: (_dom: any, record: any) => {
          return <>{record.sn ? record.sn : '--'}</>;
        },
      },
      {
        width: 150,
        title: '引用属性名称',
        dataIndex: 'refAttributeName',
        key: 'refAttributeName',
        render: (_dom: any, record: any) => {
          const content = record.refAttributeName
            ? record.refAttributeName
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
        title: '引用属性显示名称',
        dataIndex: 'refDisplayName',
        key: 'refDisplayName',
        render: (_dom: any, record: any) => {
          const content = record.refDisplayName ? record.refDisplayName : '--';
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
        title: '属性类别',
        dataIndex: 'category',
        key: 'category',
        render: (_dom: any, record: any) => {
          const content = record.category ? record.category : '--';
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
            'commonAttribute',
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
        title: '数据类型',
        dataIndex: ['idDataType', 'dataType'],
        key: 'idDataType',
        render: (_dom: any, record: any) => {
          const refConf = getRefByAttr(
            EPartName.Header,
            'commonAttribute',
            'idDataType',
            billformConf!,
          );
          if (refConf) {
            const refData = (record as any).dataType;
            if (refData) {
              return refData[refConf.displayProp!];
            }
          }
        },
      },
      {
        width: 150,
        title: '上级实体信息',
        dataIndex: ['idRefEntity', 'refEntity'],
        key: 'idRefEntity',
        render: (_dom: any, record: any) => {
          const refConf = getRefByAttr(
            EPartName.Header,
            'commonAttribute',
            'idRefEntity',
            billformConf!,
          );
          if (refConf) {
            const refData = (record as any).refEntity;
            if (refData) {
              return refData[refConf.displayProp!];
            }
          }
        },
      },
    ];
  };
