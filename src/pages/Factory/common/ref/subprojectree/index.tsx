import { EnumTreeNodeType } from '@/pages/ComponentData/ComponentTree/conf';
import { TTree } from '@/pages/ComponentData/ComponentTree/models';
import {
  Button,
  Input,
  InputRef,
  message,
  Modal,
  Space,
  Spin,
  Tree,
} from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import DescriptTreeAPI from '@/pages/DescriptData/DescriptTree/api';
import { fillTreeKey, getUpKeysByKey } from '@/util/tree';
import { TSubProjectUpTreeInfo } from '../../model';
import { findSubProjectUpTreeInfoByNodeId } from '../../utils';

export const getInitExpandKeys = (tree: TTree[]): Key[] => {
  const keys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.level === EnumTreeNodeType.PROJECT) {
      keys.push(node.key);
      break;
    }
    if (node.children && node.children.length > 0) {
      const childResult = getInitExpandKeys(node.children);
      if (childResult.length > 0) {
        keys.push(...childResult);
        keys.push(node.key);
        break;
      }
    }
  }
  return keys;
};

const SubProjectRef: FC<
  TSubProjectUpTreeInfo & {
    okCallback: (subProject: TSubProjectUpTreeInfo) => void;
  }
> = (props) => {
  const [spinning, setSpinning] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TTree[]>([]);
  const [selectSubProject, setSelectSubProject] = useState<Partial<TTree>>();
  const inputDisplayRef = useRef<InputRef>(null);

  useEffect(() => {
    setSelectSubProject({
      idParent: props.idProject,
      id: props.idSubProject,
      displayName: props.subProjectName,
    });
  }, [props]);

  useEffect(() => {}, []);

  /**获取组件树 */
  const fetchData = async () => {
    setSpinning(true);
    const subProjectTree = await DescriptTreeAPI.subProjectTree();
    setSpinning(false);
    if (subProjectTree) {
      const treeData = fillTreeKey(subProjectTree);
      setTreeData(treeData);
      if (props.idProject) {
        const expandedKeys = getUpKeysByKey(props.idProject, treeData);
        setExpandedKeys(expandedKeys);
        setSelectedTreeKeys(props.idSubProject ? [props.idSubProject] : []);
      } else {
        const expandedKeys = getInitExpandKeys(treeData);
        setExpandedKeys(expandedKeys);
        setSelectedTreeKeys([]);
      }
    }
  };

  /**点击组件 */
  const handleTreeClick = (nodeData: TTree) => {
    return () => {};
  };

  /**点击选择组件 */
  const handleToSelectComponent = () => {
    setSelectedTreeKeys([]);
    fetchData();
    setModalVisible(true);
  };

  /**点击配置表单 */
  const handleConfBillform = () => {
    if (!selectSubProject) {
      message.error('请先选中子项目！');
      return;
    }
    const idObjResult: TSubProjectUpTreeInfo = {};
    findSubProjectUpTreeInfoByNodeId(
      selectSubProject.id!,
      idObjResult,
      treeData,
    );
    props.okCallback({
      ...idObjResult,
    });
    setModalVisible(false);
  };

  const handleClear = () => {
    setSelectSubProject(undefined);
    props.okCallback({
      idProject: undefined,
      projectName: undefined,
      idSubProject: undefined,
      subProjectName: undefined,
    });
  };

  const onSelect = (keys: React.Key[], { node }: { node: TTree }) => {
    // console.log('Trigger Select', keys, info);
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    if (!keys || keys.length === 0) {
      setSelectedTreeKeys(selectedTreeKeys);
      return;
    }
    if (node.level === EnumTreeNodeType.SUB_PROJECT) {
      setSelectSubProject(node);
    } else {
      setSelectSubProject(undefined);
    }
    setSelectedTreeKeys(keys);
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
    { node }: { node: TTree; expanded: boolean },
  ) => {
    // console.log('Trigger Expand');
    toggleExpand(node.key);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setSelectSubProject({
      idParent: props.idProject,
      id: props.idSubProject,
      displayName: props.subProjectName,
    });
    setModalVisible(false);
  };

  const titleRender = (nodeData: TTree) => {
    return (
      <span
        style={{ whiteSpace: 'nowrap' }}
        onClick={handleTreeClick(nodeData)}
      >
        {nodeData.displayName}
      </span>
    );
  };

  return (
    <>
      <span>
        <Input
          ref={inputDisplayRef}
          value={selectSubProject?.displayName}
          readOnly
          placeholder={'请选择'}
          suffix={
            <Space direction="horizontal" size={2}>
              {selectSubProject && selectSubProject.id ? (
                <CloseOutlined onClick={handleClear} />
              ) : (
                ''
              )}
              <Button
                size="small"
                type="primary"
                onClick={handleToSelectComponent}
              >
                <SearchOutlined />
              </Button>
            </Space>
          }
        />
      </span>
      <Modal
        title="选择组件"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleConfBillform}
        width={'500px'}
      >
        <Spin spinning={spinning}>
          <div style={{ height: '500px', overflow: 'auto' }}>
            <div style={{ height: '500px', overflow: 'auto' }}>
              <Tree
                showLine={{ showLeafIcon: false }}
                onSelect={onSelect}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                treeData={treeData}
                selectedKeys={selectedTreeKeys}
                titleRender={titleRender}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default SubProjectRef;
