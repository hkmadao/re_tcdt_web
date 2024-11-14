import { Table, TableColumnType } from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRefProps } from '../../model';
import { fetchTableData } from '../../store/async-thunk';
import { actions, usePageInfo, useSelectedRows } from '../../store';

const RightGrid: React.FC<TRefProps> = (props) => {
  const dispatch = useDispatch();
  const { selectedRowKeys } = useSelectedRows();
  const pageInfo = usePageInfo();

  useEffect(() => {
    if (props.refStyle === 'table') {
      dispatch(fetchTableData({ refProps: props }));
    }
  }, []);

  const onPageChange = (page: number, pageSize: number) => {
    dispatch(actions.setSelectedRows({ rowKeys: [], rows: [] }));
    dispatch(
      fetchTableData({
        refProps: props,
        pageSize: pageSize,
        pageIndex: page,
      }),
    );
  };

  const showTotal = (total: number) => {
    return <>总数：{total}</>;
  };

  const columns: TableColumnType<any>[] = [];
  props.tableRef?.refColumns?.forEach((columConfig) => {
    columns.push({
      title: columConfig.displayName,
      dataIndex: columConfig.name,
      key: columConfig.name,
      render: (text: string, record: any) => {
        if (columConfig.name) {
          if (!columConfig.name.indexOf('.')) {
            return <a>{text ? text : '--'}</a>;
          }
          let properties = columConfig.name.split('.');
          return getValueByProperties(properties, record);
        }
        return;
      },
    });
  });

  const getValueByProperties = (properties: string[], source: any) => {
    if (!source) {
      return;
    }
    if (properties.length === 0) {
      return source;
    }
    let propertyFirst = properties[0];
    let value = source[propertyFirst];
    return getValueByProperties(properties.slice(1), value);
  };

  const handleSelectRowChange = (
    selectedRowKeys: Key[],
    selectedRows: any[],
  ) => {
    dispatch(
      actions.setSelectedRows({ rowKeys: selectedRowKeys, rows: selectedRows }),
    );
  };

  /**表格行行为 */
  const onRow = (record: any) => {
    //此处要配合表格行的onChange使用
    return {
      onClick: (event: any) => {
        dispatch(
          actions.setSelectedRows({
            rowKeys: [record[props.backWriteProp!]!],
            rows: [record],
          }),
        );
      }, // 点击行
      onDoubleClick: (event: any) => {
        //双击行选中结果
        dispatch(
          actions.setSelectedRows({
            rowKeys: [record[props.backWriteProp!]!],
            rows: [record],
          }),
        );
      },
      onContextMenu: (event: any) => {},
      onMouseEnter: (event: any) => {}, // 鼠标移入行
      onMouseLeave: (event: any) => {},
    };
  };
  return (
    <>
      <Table
        size={'small'}
        scroll={{ x: '200px', y: '300px' }}
        rowKey={props.backWriteProp}
        columns={columns}
        dataSource={pageInfo?.dataList}
        rowSelection={{
          type: 'radio',
          onChange: handleSelectRowChange,
          selectedRowKeys,
        }}
        onRow={onRow}
        pagination={{
          total: pageInfo?.pageInfoInput.totalCount,
          current: pageInfo?.pageInfoInput.pageIndex,
          pageSize: pageInfo?.pageInfoInput.pageSize,
          onChange: onPageChange,
          showTotal,
        }}
      />
    </>
  );
};

export default RightGrid;
