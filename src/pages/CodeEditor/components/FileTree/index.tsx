import { FC, Key, useEffect, useRef, useState } from 'react';
import { Button, TreeProps, Input, Tree, InputRef, Space, message } from 'antd';
import {
  CloseCircleFilled,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { TTree } from '@/models';
import {
  useTreeData,
  useExpandedKeys,
  useSelectedKeys,
  useFoundKeys,
  useFgEdit,
  useCurrentProject,
} from '../../hooks';
import { actions, fetchTree } from '../../store';
import SelectProject from './SelectProject';
import NodeAction from './NodeAction';

type TOprationLayout = {};

const LeftTreeLayout: FC<TOprationLayout> = () => {
  const fgEdit = useFgEdit();
  const currentProject = useCurrentProject();
  const treeDatas = useTreeData();
  const searchRef = useRef<InputRef>(null);
  const expandedKeys = useExpandedKeys();
  const selectedKeys = useSelectedKeys();
  const foundKeys = useFoundKeys();
  const [searchValue, setSearchValue] = useState<string>();

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(fetchTree());
  }, []);

  const onReflesh = () => {
    if (!currentProject) {
      message.error('请先选择项目');
      return;
    }
    dispatch(fetchTree());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const value = searchRef.current?.input?.value;
    dispatch(actions.searchTreeNode(value));
  };

  const handleClear = () => {
    if (searchRef.current?.input?.value) {
      let value = undefined;
      setSearchValue(value);
      dispatch(actions.searchTreeNode());
    }
  };

  const handleSearch = () => {
    const value = searchRef.current?.input?.value;
    dispatch(actions.searchTreeNode(value));
  };

  const handleChange = (e: any) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleClick = (e: any, node: any) => {};

  const handleDoubleClick = (e: any, node: any) => {};

  const onSelect = (
    keys: Key[],
    { node, nativeEvent }: { node: TTree; nativeEvent: MouseEvent },
  ) => {
    //只有第一次点击执行事件，防止连续多次执行
    if (nativeEvent.detail === 1) {
      if (keys && keys.length > 0) {
        dispatch(actions.setSelectedNode({ keys, node }));
      }
    }
  };

  const onExpand = (
    keys: Key[],
    { node }: { node: TTree; expanded: boolean },
  ) => {
    dispatch(actions.toggleExpand(node.key));
  };

  /** 树主配置 */
  const treeConfig: TreeProps<TTree & any> = {
    disabled: fgEdit,
    treeData: treeDatas,
    expandedKeys,
    selectedKeys: selectedKeys,
    showIcon: false,
    showLine: true,
    onSelect,
    onExpand,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    titleRender: (nodeData) => {
      return (
        <span
          style={{
            display: 'inline-block',
            minWidth: '20px',
            whiteSpace: 'nowrap',
            color: foundKeys.includes(nodeData.key) ? 'red' : undefined,
          }}
        >
          {nodeData.title}
        </span>
      );
    },
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 1 auto',
          width: '30%',
          overflow: 'auto',
          margin: '0px 5px 0px 5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'column',
            backgroundColor: 'white',
            gap: '5px',
          }}
        >
          <SelectProject />
          <div
            style={{
              marginBottom: '5px',
            }}
          >
            <Space size={'small'}>
              <Input
                size={'small'}
                readOnly={fgEdit}
                ref={searchRef}
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                suffix={
                  <Space direction="horizontal" size={2}>
                    {searchValue ? (
                      <CloseCircleFilled
                        style={{ color: 'rgb(191 191 191)' }}
                        onClick={handleClear}
                      />
                    ) : (
                      ''
                    )}
                  </Space>
                }
              />
              <Button
                size={'small'}
                onClick={handleSearch}
                type={'primary'}
                disabled={fgEdit}
              >
                <SearchOutlined />
              </Button>
              <Button
                size={'small'}
                onClick={onReflesh}
                type={'primary'}
                disabled={fgEdit}
              >
                <ReloadOutlined />
              </Button>
            </Space>
          </div>
          <NodeAction />
          <Tree {...treeConfig} />
        </div>
      </div>
    </>
  );
};

export default LeftTreeLayout;
