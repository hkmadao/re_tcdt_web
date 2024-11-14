import { useSelector, useDispatch } from 'react-redux';
import { TModuleStore, TPageMap } from '../../../../model';
import { moduleReducerName } from '../../../../conf';
import { findLayout } from '../../../../store/util';
import { ProColumns } from '@ant-design/pro-components';

export function useColumns() {
  const columns = useSelector((state: { [x: string]: TModuleStore }) => {
    const layout = findLayout(
      state[moduleReducerName].currentLayoutId!,
      state[moduleReducerName].data.layouts,
    );
    const pages = state[moduleReducerName].data.pages;
    if (!layout) {
      return [];
    }

    const valueEnum: any = {};
    if (pages) {
      pages.map((p) => {
        valueEnum[p.code] = {
          text: p.name,
          status: p.code,
        };
      });
    }

    const proColumns: ProColumns<TPageMap>[] = [
      {
        title: '组件内部状态',
        dataIndex: 'componentStateCode',
        key: 'componentStateCode',
        render: (text, record, _, action) => [
          <>{record.componentStateCode ? record.componentStateCode : '--'} </>,
        ],
      },
      {
        title: '页面编码',
        dataIndex: 'pageCode',
        key: 'pageCode',
        valueType: 'select',
        valueEnum: valueEnum,
      },
    ];
    return proColumns;
  });

  return columns;
}
