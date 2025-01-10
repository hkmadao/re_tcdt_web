import { FC, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Tree } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models';
import { useChildTreeData, useSelectedNode } from '../../../../hooks';
import {
  addComponent,
  fetchComponentProjectTree,
  removeComponentModule,
  updateComponentModule,
} from '../../../../store';
import ComponentTreeAPI from '../../../../api';
import {
  TComponentEntityCollection,
  TComponentModule,
  TSubProject,
  TTree,
} from '@/pages/ComponentData/ComponentTree/models';
import {
  TComponentEntity,
  TComponentEnum,
  TEntity,
  TEntityAssociate,
  TEnum,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumComponentType,
  EnumNodeUi,
} from '@/pages/ComponentData/ComponentDesign/conf';
import SelectEntity from './SelectEntity';
import { nanoid } from '@reduxjs/toolkit';
import Env from '@/conf/env';
import BaseAPI from '@/api';

const CompModuleAction: FC = () => {
  const selectedNode = useSelectedNode();
  const [addForm] = Form.useForm<TComponentEntityCollection>();
  const [compEntiCollec, setCompEntiCollec] =
    useState<TComponentEntityCollection>();
  const [editForm] = Form.useForm<TComponentModule>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const [selectEntity, setSelectEntity] = useState<{
    data: TEntity | TEnum;
    entityType: 'agg' | 'entity' | 'enum';
  }>();
  const [resetSe, setResetSe] = useState<number>(0);
  const [bactchGenerateModalVisible, setBactchGenerateModalVisible] =
    useState<boolean>(false);
  const childTreeData = useChildTreeData();
  const [selectedNodes, setSelectedNodes] = useState<TTree[]>([]);
  const dispatch = useDispatch();

  const handleToAdd = () => {
    addForm.resetFields();
    setResetSe((r) => r + 1);
    setSelectEntity(undefined);
    const componentEntityCollection: TComponentEntityCollection = {
      idComponent: nanoid(),
      idComponentModule: selectedNode?.id,
      componentType: EnumComponentType.Single,
    };
    addForm.setFieldsValue(componentEntityCollection);
    setCompEntiCollec(componentEntityCollection);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async () => {
    const compEnitColl: TComponentEntityCollection =
      await addForm.validateFields();
    compEnitColl.componentEntities = [];
    compEnitColl.componentEntityAssociates = [];
    compEnitColl.componentNodeUis = [];
    compEnitColl.componentEnums = [];
    compEnitColl.action = DOStatus.NEW;

    if (!selectEntity) {
      await ComponentTreeAPI.saveComponentEntityCollection(compEnitColl);
      dispatch(fetchComponentProjectTree());
      setModalVisible(false);
    }

    if (
      (compEnitColl.componentType === EnumComponentType.Single &&
        selectEntity &&
        selectEntity.entityType === 'entity') ||
      (compEnitColl.componentType === EnumComponentType.Combination &&
        selectEntity &&
        selectEntity.entityType === 'agg')
    ) {
      const entity = selectEntity.data as TEntity;
      ComponentTreeAPI.getDetailByEntityId({ idEntity: entity.idEntity }).then(
        async (resEntity: TEntity) => {
          if (resEntity) {
            const mainEntity = resEntity;
            const { downAssociates, upAssociates } = mainEntity;
            const allAssos: TEntityAssociate[] = [];
            if (downAssociates) {
              allAssos.push(
                ...downAssociates.filter((asso) => asso.downAttributeName),
              );
            }
            const assoIds = allAssos.map((asso) => asso.idEntityAssociate!);
            upAssociates?.forEach((asso) => {
              if (!assoIds.includes(asso.idEntityAssociate!)) {
                allAssos.push(asso);
                assoIds.push(asso.idEntityAssociate!);
              }
            });
            const idComponentEntity = nanoid();
            compEnitColl.componentNodeUis?.push({
              idElement: idComponentEntity,
              x: 300,
              y: 300,
              width: 150,
              height: 200,
              idComponentNodeUi: nanoid(),
              idComponent: compEnitColl?.idComponent,
              action: DOStatus.NEW,
            });
            compEnitColl.idMainComponentEntity = idComponentEntity;
            const mainComponentEntity: TComponentEntity = {
              ddEntity: {
                ...mainEntity,
              },
              fgVirtual:
                compEnitColl.componentType === EnumComponentType.Combination,
              idEntity: mainEntity.idEntity,
              idComponentEntity,
              extAttributes: [],
              action: DOStatus.NEW,
            };
            //为组件实体添加扩展属性
            mainEntity.attributes?.forEach((attribute) => {
              mainComponentEntity.extAttributes?.push({
                idComponentEntity: idComponentEntity,
                idAttribute: attribute.idAttribute,
                sn: attribute.sn,
                attribute: attribute,
                idExtAttribute: nanoid(),
                action: DOStatus.NEW,
              });
            });
            compEnitColl?.componentEntities?.push(mainComponentEntity);
            //添加关系连线
            allAssos.forEach((asso) => {
              compEnitColl.componentEntityAssociates?.push({
                idComponentEntityAssociate: nanoid(),
                action: DOStatus.NEW,
                fgAggAsso: false,
                idComponent: compEnitColl.idComponent,
                idEntityAssociate: asso.idEntityAssociate,
                entityAssociate: asso,
              });
            });
            dispatch(addComponent(compEnitColl));
            setModalVisible(false);
          }
        },
      );
    }

    if (
      compEnitColl.componentType === EnumComponentType.Enum &&
      selectEntity &&
      selectEntity.entityType === 'enum'
    ) {
      const ddEnum = selectEntity.data as TEnum;
      ComponentTreeAPI.getDetailByEnumIds({ idEnumList: ddEnum.idEnum }).then(
        async (resEnums: TEnum[]) => {
          if (resEnums) {
            const ddEnums = resEnums;
            ddEnums.forEach((ddEnum, index) => {
              const idComponentEnum = nanoid();
              compEnitColl.componentNodeUis?.push({
                idElement: idComponentEnum,
                x: 100 * index,
                y: 300,
                width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
                height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
                idComponentNodeUi: nanoid(),
                idComponent: compEnitColl?.idComponent,
                action: DOStatus.NEW,
              });
              const newComponentEnum: TComponentEnum = {
                idComponentEnum: idComponentEnum,
                idComponent: compEnitColl?.idComponent,
                idEnum: ddEnum.idEnum,
                ddEnum: ddEnum,
                action: DOStatus.NEW,
              };
              compEnitColl?.componentEnums?.push(newComponentEnum);
            });
            dispatch(addComponent(compEnitColl));
            setModalVisible(false);
          }
        },
      );
    }
  };

  const handleToEdit = () => {
    editForm.resetFields();
    editForm.setFieldsValue({
      ...selectedNode,
      idComponentModule: selectedNode?.id,
      idSubProject: selectedNode?.idParent,
    });
    setEditModalVisible(true);
  };

  const handleEditCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleEdit = async () => {
    const formValue: TSubProject = await editForm.validateFields();
    formValue.action = DOStatus.UPDATED;
    dispatch(
      updateComponentModule({
        ...{ ...selectedNode, children: undefined, parent: undefined },
        ...formValue,
        idComponentModule: selectedNode?.id,
        idSubProject: selectedNode?.idParent,
      }),
    );
    setEditModalVisible(false);
  };

  /**弹出删除确认框 */
  const handleToRemoveModal = () => {
    setRemoveModalVisible(true);
  };

  /**删除取消 */
  const handleRemoveCloseModal = () => {
    setRemoveModalVisible(false);
  };

  /**删除 */
  const handleRemove = async () => {
    dispatch(
      removeComponentModule({
        idComponentModule: selectedNode?.id,
      }),
    );
    setRemoveModalVisible(false);
  };

  const handleComponentTypeChange = (value: string) => {};

  const handleAddFormVaulesChange = (
    changeValues: TComponentEntityCollection,
    values: TComponentEntityCollection,
  ) => {
    const newValues = { ...values };
    if (changeValues.componentType) {
      newValues.name = undefined;
      newValues.displayName = undefined;
      newValues.packageName = undefined;
      setResetSe((r) => r + 1);
      addForm.setFieldsValue(newValues);
      setSelectEntity(undefined);
    }
    setCompEntiCollec(newValues);
  };

  const selectEntityCallBack = (
    data: TEntity | TEnum,
    entityType: 'agg' | 'entity' | 'enum',
  ) => {
    setSelectEntity({ data, entityType });
    if (entityType === 'agg') {
      const entity = data as TEntity;
      const newCompEntiCollec = { ...compEntiCollec };
      newCompEntiCollec.name = entity.className?.toLowerCase() + 'Agg';
      newCompEntiCollec.displayName = entity.displayName + '聚合';
      newCompEntiCollec.packageName = entity.className?.toLowerCase() + 'agg';
      setCompEntiCollec(newCompEntiCollec);
      addForm.setFieldsValue(newCompEntiCollec);
      return;
    }
    if (entityType === 'entity') {
      const entity = data as TEntity;
      const newCompEntiCollec = { ...compEntiCollec };
      newCompEntiCollec.name = entity.className?.toLowerCase();
      newCompEntiCollec.displayName = entity.displayName;
      newCompEntiCollec.packageName = entity.className?.toLowerCase();
      setCompEntiCollec(newCompEntiCollec);
      addForm.setFieldsValue(newCompEntiCollec);
      return;
    }
    if (entityType === 'enum') {
      const ddEnum = data as TEnum;
      const newCompEntiCollec = { ...compEntiCollec };
      newCompEntiCollec.name = ddEnum.className?.toLowerCase();
      newCompEntiCollec.displayName = ddEnum.displayName;
      newCompEntiCollec.packageName = ddEnum.className?.toLowerCase();
      setCompEntiCollec(newCompEntiCollec);
      addForm.setFieldsValue(newCompEntiCollec);
      return;
    }
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
        <Button size={'small'} onClick={handleToEdit} type={'default'}>
          <EditOutlined />
        </Button>
        <Button size={'small'} onClick={handleToRemoveModal} type={'default'}>
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
        title="添加组件"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAdd}
      >
        <Form form={addForm} onValuesChange={handleAddFormVaulesChange}>
          <Form.Item label="所属组件模块" name={'idComponentModule'}>
            <Select disabled>
              <Select.Option value={selectedNode?.id}>
                {selectedNode?.displayName}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="全包名">
            <Input
              value={
                selectedNode?.path +
                '.' +
                (compEntiCollec?.packageName ?? 'null')
              }
              placeholder="请输入组件包名"
              readOnly
            />
          </Form.Item>
          <Form.Item label={'组件类型'} name={'componentType'}>
            <Select
              defaultValue={EnumComponentType.Single}
              onChange={handleComponentTypeChange}
            >
              <Select.Option value={EnumComponentType.Single}>
                {'普通组件'}
              </Select.Option>
              <Select.Option value={EnumComponentType.Combination}>
                {'组合实体组件'}
              </Select.Option>
              <Select.Option value={EnumComponentType.Enum}>
                {'枚举组件'}
              </Select.Option>
            </Select>
          </Form.Item>
          {compEntiCollec?.componentType === EnumComponentType.Combination ? (
            <Form.Item label="主实体">
              <SelectEntity
                resetInputVaule={resetSe}
                entityType="agg"
                selectEntityCallBack={selectEntityCallBack}
                idSubProject={selectedNode?.idParent!}
              />
            </Form.Item>
          ) : compEntiCollec?.componentType === EnumComponentType.Enum ? (
            <Form.Item label="枚举">
              <SelectEntity
                resetInputVaule={resetSe}
                entityType="enum"
                selectEntityCallBack={selectEntityCallBack}
                idSubProject={selectedNode?.idParent!}
              />
            </Form.Item>
          ) : (
            <Form.Item label="主实体">
              <SelectEntity
                resetInputVaule={resetSe}
                entityType="entity"
                selectEntityCallBack={selectEntityCallBack}
                idSubProject={selectedNode?.idParent!}
              />
            </Form.Item>
          )}
          <Form.Item label="组件包名" name={'packageName'}>
            <Input placeholder="请输入组件包名" />
          </Form.Item>
          <Form.Item label="组件显示名称" name={'displayName'}>
            <Input placeholder="请输入组件显示名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑组件模块"
        open={editModalVisible}
        onCancel={handleEditCloseModal}
        onOk={handleEdit}
      >
        <Form form={editForm}>
          <Form.Item label="组件模块ID" name={'idComponentModule'} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="组件模块包名" name={'path'}>
            <Input placeholder="请输入组件模块包名" />
          </Form.Item>
          <Form.Item label="组件模块显示名称" name={'displayName'}>
            <Input placeholder="请输入组件模块名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="删除组件模块确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将组件模块{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>
            {selectedNode?.displayName}
          </b>{' '}
          删除?
        </p>
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

export default CompModuleAction;
