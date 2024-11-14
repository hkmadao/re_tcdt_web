import React, { FC, Key, useEffect, useState } from 'react';
import { Tree } from 'antd';
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { useSelector, useDispatch } from 'react-redux';
import TreeTitileLayout from './TreeTitleLayout';
import {
  fetchComponentProjectTree,
  actions as treeActions,
} from '@/pages/ComponentData/ComponentTree/store';
import { EnumCanvasUi } from '@/pages/ComponentData/ComponentDesign/conf';
import { AntdTreeNodeAttribute } from 'antd/lib/tree';
import { TTree } from '../../models';
import { EnumTreeNodeType } from '../../conf';
import {
  actions,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import SearchLayout from './Search';
import NodeAction from './Action';
import {
  useExpandedKeys,
  useFoundKeys,
  useSelectedKeys,
  useTreeData,
} from '../../hooks';
import styles from './index.less';

const LeftLayout: FC = (props) => {
  const moduleUi = useSelector(selectModuleUi);
  const dispatch = useDispatch();
  const [maxWidth, minWidth] = [500, 200];
  const treeDatas = useTreeData();
  const expandedKeys = useExpandedKeys();
  const selectedKeys = useSelectedKeys();
  const foundKeys = useFoundKeys();

  const [width, setWidth] = useState(moduleUi.lWidth);

  useEffect(() => {
    if (!treeDatas[0].children || treeDatas[0].children.length === 0) {
      dispatch(fetchComponentProjectTree());
    }
  }, []);

  const onSelect = (
    keys: React.Key[],
    { node, nativeEvent }: { node: TTree; nativeEvent: MouseEvent },
  ) => {
    // console.log('Trigger Select', keys, info);
    if (node.children && node.children.length > 0) {
      dispatch(treeActions.toggleExpand(node.key));
    }
    //只有第一次点击执行事件，防止连续多次执行
    if (nativeEvent.detail === 1) {
      if (keys && keys.length > 0) {
        dispatch(treeActions.setSelectedNode({ keys, node }));
      } else {
        dispatch(treeActions.setSelectedNode({ keys: selectedKeys, node }));
      }
    }
  };

  const onExpand = (
    keys: Key[],
    { node }: { node: TTree; expanded: boolean },
  ) => {
    dispatch(treeActions.toggleExpand(node.key));
  };

  /**设置模块的宽度 */
  const handleResize: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    let currentWidth = data.size.width;
    if (currentWidth > maxWidth) {
      currentWidth = maxWidth;
    }
    if (currentWidth < minWidth) {
      currentWidth = minWidth;
    }
    setWidth(currentWidth);
  };

  const handleResizeStop: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    let currentWidth = data.size.width;
    if (currentWidth > maxWidth) {
      currentWidth = maxWidth;
    }
    if (currentWidth < minWidth) {
      currentWidth = minWidth;
    }
    dispatch(actions.updateLeftWidth(currentWidth));
  };

  /**切换显示或隐藏模块 */
  const hanleToggleHidden = () => {
    if (moduleUi.lWidth === 0) {
      setWidth(EnumCanvasUi.lWidth);
      dispatch(actions.updateLeftWidth(EnumCanvasUi.lWidth));
    } else {
      dispatch(actions.updateLeftWidth(0));
    }
  };
  return (
    <>
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#fff',
        }}
      >
        <div
          hidden={moduleUi.lWidth === 0}
          style={{
            display: 'flex',
            flex: 'auto',
          }}
        >
          <div
            style={{
              width: width,
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
            }}
          >
            <SearchLayout />
            <NodeAction />
            <div
              style={{
                overflow: 'auto',
              }}
            >
              <Tree
                showLine={{ showLeafIcon: false }}
                showIcon={true}
                icon={(props: AntdTreeNodeAttribute) => {
                  const props1 = props as AntdTreeNodeAttribute & {
                    data: TTree;
                  };
                  if (
                    props1.data.level ===
                    EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION
                  ) {
                    return <FileOutlined style={{ fontSize: 16 }} />;
                  }
                  if (props1.expanded) {
                    return <FolderOpenOutlined style={{ fontSize: 16 }} />;
                  }
                  return <FolderOutlined style={{ fontSize: 16 }} />;
                }}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                onExpand={onExpand}
                onDoubleClick={() => console.log('db')}
                treeData={treeDatas}
                titleRender={(nodeData) => (
                  <span
                    style={{
                      display: 'inline-block',
                      minWidth: '20px',
                      whiteSpace: 'nowrap',
                      color: foundKeys.includes(nodeData.key)
                        ? 'red'
                        : undefined,
                    }}
                  >
                    <TreeTitileLayout {...nodeData} />
                  </span>
                )}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 'auto' }}>
          <Resizable
            width={width}
            height={200}
            handle={<div className={styles.resizableHandleElement}></div>}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
          >
            <div style={{ display: 'flex', flex: 'auto' }} />
          </Resizable>
        </div>
        {/* 折叠按钮 */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
          }}
        >
          <span onClick={hanleToggleHidden}>
            {moduleUi.lWidth === 0 ? (
              <DoubleRightOutlined className={styles.arrow} />
            ) : (
              <DoubleLeftOutlined className={styles.arrow} />
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default LeftLayout;
