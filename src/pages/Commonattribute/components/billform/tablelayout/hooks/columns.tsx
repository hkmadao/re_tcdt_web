import { Checkbox, Dropdown, Menu, TableColumnType, message } from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { EPartName } from '@/models';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
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
        title: '属性名称',
        dataIndex: 'attributeName',
        key: 'attributeName',
        render: (_dom: any, record: any) => {
          return <>{record.attributeName ? record.attributeName : '--'}</>;
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
        title: '字段名称',
        dataIndex: 'columnName',
        key: 'columnName',
        render: (_dom: any, record: any) => {
          return <>{record.columnName ? record.columnName : '--'}</>;
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
        title: '序号',
        dataIndex: 'sn',
        key: 'sn',
        render: (_dom: any, record: any) => {
          return <>{record.sn ? record.sn : '--'}</>;
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
        title: '引用属性显示名称',
        dataIndex: 'refDisplayName',
        key: 'refDisplayName',
        render: (_dom: any, record: any) => {
          return <>{record.refDisplayName ? record.refDisplayName : '--'}</>;
        },
      },
      {
        width: 150,
        title: '属性类别',
        dataIndex: 'category',
        key: 'category',
        render: (_dom: any, record: any) => {
          return <>{record.category ? record.category : '--'}</>;
        },
      },
      {
        width: 150,
        title: '引用属性名称',
        dataIndex: 'refAttributeName',
        key: 'refAttributeName',
        render: (_dom: any, record: any) => {
          return (
            <>{record.refAttributeName ? record.refAttributeName : '--'}</>
          );
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
      /*[- */
      {
        width: 150,
        fixed: 'right',
        title: '操作',
        key: 'action',
        sorter: true,
        render: () => (
          <Dropdown overlay={menu} trigger={['click']}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              更多 <DownOutlined />
            </a>
          </Dropdown>
        ),
      },
      /* -]*/
    ];
  };
