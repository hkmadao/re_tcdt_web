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
import { fillTreeKey, getTreeParentKeys, getUpKeysByKey } from '@/util/tree';
import {
  andLogicNode,
  equalFilterNode,
  stringFilterParam,
  TCondition,
} from '@/models';
import ComponentTreeAPI from '@/pages/ComponentData/ComponentTree/api';
import { TCompUpTreeInfo } from '../../model';
import { findCompUpTreeInfoByNodeId } from '../../utils';

export const getInitExpandKeys = (tree: TTree[]): Key[] => {
  const keys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.level === EnumTreeNodeType.COMPONENT_MODULE) {
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

const ComponentRef: FC<
  TCompUpTreeInfo & {
    disabled?: boolean;
    okCallback: (subProject: TCompUpTreeInfo) => void;
  }
> = (props) => {
  const [spinning, setSpinning] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<Key[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TTree[]>([]);
  const [selectComponent, setSelectComponent] = useState<Partial<TTree>>();
  const inputDisplayRef = useRef<InputRef>(null);

  useEffect(() => {
    setSelectComponent({
      idParent: props.idComponentModule,
      id: props.idComponent,
      displayName: props.compDisplayName,
    });
  }, [props]);

  useEffect(() => {}, []);

  /**获取组件树 */
  const fetchData = async () => {
    let condition: TCondition = {};
    if (props.idSubProject) {
      condition = {
        logicNode: andLogicNode([
          equalFilterNode(
            'subProjects.idSubProject',
            stringFilterParam(props.idSubProject),
          ),
        ])(),
      };
    }
    setSpinning(true);
    const componentTree = await ComponentTreeAPI.componentProjectTree(
      condition,
    );
    setSpinning(false);
    if (componentTree) {
      const treeData = fillTreeKey(componentTree);
      setTreeData(treeData);
      if (props.idComponentModule) {
        const expandedKeys = getUpKeysByKey(props.idComponentModule, treeData);
        setExpandedKeys(expandedKeys);
        setSelectedTreeKeys(props.idComponent ? [props.idComponent] : []);
      } else {
        const expandedKeys = getTreeParentKeys(treeData);
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
    if (!selectComponent) {
      message.error('请先选中组件！');
      return;
    }
    let idObjResult: TCompUpTreeInfo = {};
    findCompUpTreeInfoByNodeId(selectComponent.id!, idObjResult, treeData);
    props.okCallback({
      ...idObjResult,
    });
    setModalVisible(false);
  };

  const handleClear = () => {
    setSelectComponent(undefined);
    props.okCallback({
      idProject: undefined,
      projectName: undefined,
      idSubProject: undefined,
      subProjectName: undefined,
    });
  };

  const onSelect = (keys: React.Key[], { node }: { node: TTree }) => {
    if (node.children && node.children.length > 0) {
      toggleExpand(node.key);
    }
    if (!keys || keys.length === 0) {
      setSelectedTreeKeys(selectedTreeKeys);
      return;
    }
    if (node.level === EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION) {
      setSelectComponent(node);
    } else {
      setSelectComponent(undefined);
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
    toggleExpand(node.key);
  };

  /**点击关闭选择组件弹窗 */
  const handleCloseModal = () => {
    setSelectComponent({
      idParent: props.idComponentModule,
      id: props.idComponent,
      displayName: props.compDisplayName,
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
          value={selectComponent?.displayName}
          readOnly
          placeholder={'请选择'}
          disabled={props.disabled}
          suffix={
            <Space direction="horizontal" size={2}>
              {selectComponent && selectComponent.id ? (
                <CloseOutlined onClick={handleClear} />
              ) : (
                ''
              )}
              <Button
                size="small"
                type="primary"
                disabled={props.disabled}
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

export default ComponentRef;
