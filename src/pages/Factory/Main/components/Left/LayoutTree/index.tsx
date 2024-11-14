import React, { FC, Key, useEffect, useState } from 'react';
import { Tree } from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectLayouts, selectCurrentLayout } from '../../../store';
import { AntdTreeNodeAttribute } from 'antd/lib/tree';
import { TLayout } from '../../../model';
import TreeTitileLayout from './TreeTitileLayout';
import { getUpKeysByKey } from '@/util';

const LayoutTree: FC = (props) => {
  const layouts = useSelector(selectLayouts);
  const currentLayout = useSelector(selectCurrentLayout);
  const dispatch = useDispatch();
  const [treeSelectKeys, setTreeSelectKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (!currentLayout) {
      setTreeSelectKeys([]);
      return;
    }
    if (!treeSelectKeys.includes(currentLayout.id)) {
      setTreeSelectKeys([currentLayout.id]);
    }
    if (!expandedKeys.includes(currentLayout.id)) {
      const upKeys = getUpKeysByKey(currentLayout.id, layouts as any[]);
      const newKeys = upKeys.filter((uk) => !expandedKeys.includes(uk));
      setExpandedKeys([...expandedKeys, ...newKeys]);
    }
  }, [currentLayout]);

  const onSelect = (keys: React.Key[], { node }: { node: TLayout }) => {
    // console.log('Trigger Select', keys, info);
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    if (keys && keys.length > 0) {
      setTreeSelectKeys(keys);
    }
  };

  const toggleExpand = (currentKey: string | number) => {
    if (expandedKeys.includes(currentKey)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== currentKey));
      return;
    }
    setExpandedKeys(expandedKeys.concat([currentKey]));
  };

  const onExpand = (
    keys: React.Key[],
    { node }: { node: TLayout; expanded: boolean },
  ) => {
    // console.log('Trigger Expand');
    toggleExpand(node.key);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Tree
          defaultExpandedKeys={[layouts.length > 0 ? layouts[0].id : '0']}
          showLine={{ showLeafIcon: false }}
          showIcon={true}
          icon={(props: AntdTreeNodeAttribute) => {
            const props1 = props as AntdTreeNodeAttribute & {
              data: TLayout;
            };
            if (props1.data.type === 'component') {
              return <FileOutlined style={{ fontSize: 16 }} />;
            }
            if (props1.expanded) {
              return <FolderOpenOutlined style={{ fontSize: 16 }} />;
            }
            return <FolderOutlined style={{ fontSize: 16 }} />;
          }}
          expandedKeys={expandedKeys}
          selectedKeys={treeSelectKeys}
          onSelect={onSelect}
          onExpand={onExpand}
          onDoubleClick={() => console.log('db')}
          treeData={layouts}
          titleRender={(nodeData) => <TreeTitileLayout {...nodeData} />}
        />
      </div>
    </>
  );
};

export default LayoutTree;
