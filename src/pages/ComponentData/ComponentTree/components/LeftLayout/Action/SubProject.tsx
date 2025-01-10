import { FC, Key, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Tree } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import Env from '@/conf/env';
import { useSelector, useDispatch } from 'react-redux';
import { TComponentModule, TTree } from '../../../models';
import { DOStatus } from '@/models';
import { addComponentModule } from '../../../store';
import { useSelectedNode, useChildTreeData } from '../../../hooks';
import { EnumComponentType } from '@/pages/ComponentData/ComponentDesign/conf';
import BaseAPI from '@/api';

const SubProjectAction: FC = () => {
  const [form] = Form.useForm<TComponentModule>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bactchGenerateModalVisible, setBactchGenerateModalVisible] =
    useState<boolean>(false);
  const selectedNode = useSelectedNode();
  const childTreeData = useChildTreeData();
  const [selectedNodes, setSelectedNodes] = useState<TTree[]>([]);
  const dispatch = useDispatch();

  const handleToAdd = () => {
    form.resetFields();
    const componentModule = {
      idSubProject: selectedNode?.id,
    };
    form.setFieldsValue(componentModule);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const componentModule: TComponentModule = await form.validateFields();
    componentModule.action = DOStatus.NEW;
    dispatch(addComponentModule(componentModule));
    setModalVisible(false);
  };

  const handleCloseBactchGenerateModal = () => {
    setBactchGenerateModalVisible(false);
  };

  const handleOpenBactchGenerateModalVisible = () => {
    setBactchGenerateModalVisible(true);
  };

  const handleBactchGenerate = async () => {
    const singleComponentNodes = selectedNodes.filter(
      (treeNode) => treeNode.componentType === EnumComponentType.Single,
    );
    if (window.tcdtAPI && singleComponentNodes.length > 0) {
      const params = singleComponentNodes.map((node) => {
        return {
          url: Env.directServerUrl + `/component/generateSingle?id=${node?.id}`,
          name: node.displayName ?? '',
        };
      });
      window.tcdtAPI.singleComponentBatchGenerate(params);
    } else {
      for (let index = 0; index < singleComponentNodes.length; index++) {
        const node = singleComponentNodes[index];
        await BaseAPI.GET_DOWNLOAD(
          `/component/generateSingle?id=${node.id}`,
          node?.displayName + '.zip',
        );
      }
    }
    const enumComponentNodes = selectedNodes.filter(
      (treeNode) => treeNode.componentType === EnumComponentType.Enum,
    );
    if (window.tcdtAPI && enumComponentNodes.length > 0) {
      const params = enumComponentNodes.map((node) => {
        return {
          url:
            Env.directServerUrl + `/component/generateEnumPart?id=${node?.id}`,
          name: node.displayName ?? '',
        };
      });
      window.tcdtAPI.enumComponentBatchGenerate(params);
    } else {
      for (let index = 0; index < enumComponentNodes.length; index++) {
        const node = enumComponentNodes[index];
        await BaseAPI.GET_DOWNLOAD(
          `/component/generateEnumPart?id=${node.id}`,
          node?.displayName + '.zip',
        );
      }
    }
    const combinationComponentNodes = selectedNodes.filter(
      (treeNode) => treeNode.componentType === EnumComponentType.Combination,
    );
    if (window.tcdtAPI && combinationComponentNodes.length > 0) {
      const params = combinationComponentNodes.map((node) => {
        return {
          url:
            Env.directServerUrl +
            `/component/generateCombination?id=${node?.id}`,
          name: node.displayName ?? '',
        };
      });
      window.tcdtAPI.combinationComponentBatchGenerate(params);
    } else {
      for (let index = 0; index < combinationComponentNodes.length; index++) {
        const node = combinationComponentNodes[index];
        await BaseAPI.GET_DOWNLOAD(
          `/component/generateCombination?id=${node.id}`,
          node?.displayName + '.zip',
        );
      }
    }
    setBactchGenerateModalVisible(false);
  };

  const handleCheck = (
    checkKeys: any,
    { checkedNodes }: { checkedNodes: TTree[] },
  ) => {
    setSelectedNodes(checkedNodes);
  };

  return (
    <>
      <Space size={'middle'}>
        <Button size={'small'} onClick={handleToAdd} type={'default'}>
          <PlusCircleOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <EditOutlined />
        </Button>
        <Button size={'small'} type={'default'} disabled={true}>
          <DeleteOutlined />
        </Button>
        <Button
          size={'small'}
          onClick={handleOpenBactchGenerateModalVisible}
          type={'default'}
        >
          <DownloadOutlined />
        </Button>
      </Space>
      <Modal
        title="添加组件模块"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={form}>
          <Form.Item label="所属模块" name={'idSubProject'}>
            <Select disabled>
              <Select.Option value={selectedNode?.id}>
                {selectedNode?.displayName}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="组件模块包名" name={'path'}>
            <Input placeholder="请输入组件模块包名" />
          </Form.Item>
          <Form.Item label="组件模块显示名称" name={'displayName'}>
            <Input placeholder="请输入组件显示名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="批量生成代码"
        open={bactchGenerateModalVisible}
        onCancel={handleCloseBactchGenerateModal}
        onOk={handleBactchGenerate}
      >
        <Tree
          height={300}
          showLine={true}
          treeData={childTreeData}
          checkable={true}
          onCheck={handleCheck}
        />
      </Modal>
    </>
  );
};

export default SubProjectAction;
