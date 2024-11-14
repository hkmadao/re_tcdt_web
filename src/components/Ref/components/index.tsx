import store, { actions, useSelectedNodes, useSelectedRows } from '../store';
import { TRefProps } from '../model';
import { Divider, Input, InputRef, Modal, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import LeftTree from './Tree';
import Search from './Search';
import RightGrid from './Grid';
import { useEffect, useRef, useState } from 'react';

const Component: React.FC<TRefProps> = (props) => {
  const dispatch = useDispatch();
  const {
    billTreeRef,
    title,
    tableRef,
    onChange,
    displayProp,
    refStyle,
    value,
  } = props;
  const { selectedRows } = useSelectedRows();
  const { selectedNodes } = useSelectedNodes();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [interValue, setInterValue] = useState<any>();
  const inputDisplayRef = useRef<InputRef>(null);

  useEffect(() => {
    if (value) {
      if (refStyle === 'tree' && props.billTreeRef?.keyAttr) {
        dispatch(
          actions.setSelectedNodes({
            nodeKeys: [value[props.billTreeRef.keyAttr!]],
            nodes: [value],
          }),
        );
      } else if (refStyle === 'treeTable' && props.billTreeRef?.keyAttr) {
        if (value[props.tableRef?.treeRefMainKey!]) {
          dispatch(
            actions.setSelectedNodes({
              nodeKeys: [value[props.tableRef?.treeRefMainKey!]],
              nodes: [],
            }),
          );
        }
        dispatch(
          actions.setSelectedRows({
            rowKeys: [value[props.backWriteProp!]],
            rows: [value],
          }),
        );
      } else if (refStyle === 'table' && props.billTreeRef?.keyAttr) {
        dispatch(
          actions.setSelectedRows({
            rowKeys: [value[props.backWriteProp!]],
            rows: [value],
          }),
        );
      }
      setInterValue(value[displayProp!]);
    }
  }, [value]);

  const handleSearch = () => {
    dispatch(actions.initPageInfo());
    setIsModalVisible(true);
  };

  const handleClear = () => {
    /**清空显示的值 */
    setInterValue(undefined);

    //editTable必须要触发表单修改，否则修改不会更新到table模式
    onChange(undefined);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    if (refStyle === 'tree') {
      if (selectedNodes && selectedNodes.length > 0) {
        //editTable必须要触发表单修改，否则修改不会更新到table模式
        onChange(selectedNodes[0]);
        //设置显示的值
        setInterValue(selectedNodes[0][displayProp!]);
      }
    } else {
      if (selectedRows && selectedRows.length > 0) {
        //editTable必须要触发表单修改，否则修改不会更新到table模式
        onChange(selectedRows[0]);
        //设置显示的值
        setInterValue(selectedRows[0][displayProp!]);
      }
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Input
          ref={inputDisplayRef}
          value={interValue}
          readOnly
          placeholder={'请选择'}
          onClick={handleSearch}
          suffix={
            <Space direction="horizontal" size={5}>
              {interValue ? (
                <CloseCircleFilled
                  style={{ color: 'rgb(191 191 191)' }}
                  onClick={handleClear}
                />
              ) : (
                ''
              )}
              <SearchOutlined onClick={handleSearch} />
            </Space>
          }
        />
      </Space>
      <Modal
        width={
          refStyle === 'treeTable' ? 1200 : refStyle === 'table' ? 900 : 500
        }
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'row',
            alignItems: 'stretch',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              minWidth: refStyle === 'treeTable' ? '300px' : undefined,
              display: refStyle !== 'table' ? 'block' : 'none',
              flex: '1 0 auto',
            }}
            hidden={!billTreeRef}
          >
            <LeftTree {...props} />
          </div>
          <Divider
            style={{
              height: 'auto',
              display: refStyle !== 'treeTable' ? 'none' : 'block',
            }}
            type="vertical"
          />
          <div style={{ overflow: 'auto' }}>
            <div
              style={{
                display:
                  tableRef?.searchRefs && tableRef?.searchRefs.length > 0
                    ? 'flex'
                    : 'none',
              }}
            >
              <Search {...props} />
            </div>
            <div
              style={{
                display: refStyle !== 'tree' ? 'flex' : 'none',
                flex: '1 0 auto',
              }}
            >
              <RightGrid {...props} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Component;
