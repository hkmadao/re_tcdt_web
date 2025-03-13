import React, { ChangeEvent, FC, useEffect } from 'react';
import {
  Input,
  Select,
  Button,
  Descriptions,
  Checkbox,
  InputNumber,
} from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  fetchEntityAttributes,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  TEntityAssociate,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumUpAssociateType,
  EnumConcreteDiagramType,
  EnumDownAssociateType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { firstToLower } from '@/util/name-convent';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const AssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const { Option } = Select;

  const { assoLink, sourceEntity, targetEntity } = useSelector(
    (state: Record<string, TModuleStore>) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ASSOLINK
      ) {
        return {};
      }
      const idElement = state[moduleName].currentSelect.idElement;
      const assoLink = state[
        moduleName
      ].entityCollection.entityAssociates?.find(
        (entityFind) => entityFind.idEntityAssociate === idElement,
      );
      let parentEntity = state[moduleName].entityCollection.entities?.find(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          entity.idEntity === assoLink?.idUp,
      );
      if (!parentEntity) {
        parentEntity = state[moduleName].entityCollection.outEntities?.find(
          (entity) => entity.idEntity === assoLink?.idUp,
        );
      }
      const childEntity = state[moduleName].entityCollection.entities?.find(
        (entity) => entity.idEntity === assoLink?.idDown,
      );

      return {
        assoLink,
        sourceEntity: childEntity,
        targetEntity: parentEntity,
      };
    },
  );

  useEffect(() => {
    //加载实体属性
    const idEntities: string[] = [];
    if (
      sourceEntity &&
      (!sourceEntity.attributes || sourceEntity.attributes.length === 0)
    ) {
      idEntities.push(sourceEntity.idEntity);
    }
    if (
      targetEntity &&
      (!targetEntity.attributes || targetEntity.attributes.length === 0)
    ) {
      idEntities.push(targetEntity.idEntity);
    }
    if (idEntities.length > 0) {
      dispatch(fetchEntityAttributes(idEntities));
    }
  }, [currentDiagramContent]);

  const fillAttr = () => {
    const newAssoLink: TEntityAssociate = assoLink ? { ...assoLink } : {};

    const targetPK = targetEntity?.attributes?.find(
      (attr) => attr.action !== DOStatus.DELETED && attr.fgPrimaryKey,
    );
    const sourcePK = sourceEntity?.attributes?.find(
      (attr) => attr.action !== DOStatus.DELETED && attr.fgPrimaryKey,
    );

    if (sourcePK) {
      newAssoLink.downOrderStr = sourcePK.columnName + ' asc';
      newAssoLink.downBatchSize = 0;
      newAssoLink.fgForeignKey = true;
    }

    if (targetPK) {
      if (!newAssoLink?.fkColumnName) {
        newAssoLink.fkColumnName = targetPK.columnName;
      }
      if (!newAssoLink?.fkAttributeName) {
        newAssoLink.fkAttributeName = targetPK.attributeName;
      }
      if (!newAssoLink.fkAttributeDisplayName) {
        newAssoLink.fkAttributeDisplayName = targetPK.displayName;
      }
      if (!newAssoLink.refAttributeName && targetEntity?.className) {
        newAssoLink.refAttributeName = firstToLower(targetEntity.className);
      }
      if (!newAssoLink.refAttributeDisplayName) {
        newAssoLink.refAttributeDisplayName = targetEntity?.displayName;
      }
    }

    if (sourceEntity) {
      if (!newAssoLink.downAttributeName && sourceEntity?.className) {
        newAssoLink.downAttributeName =
          firstToLower(sourceEntity.className) + 's';
      }
      if (!newAssoLink.downAttributeDisplayName) {
        newAssoLink.downAttributeDisplayName = sourceEntity.displayName;
      }
    }

    if (!newAssoLink.downAssociateType) {
      newAssoLink.downAssociateType = EnumDownAssociateType.ZERO_TO_MANY;
    }
    if (!newAssoLink.upAssociateType) {
      newAssoLink.upAssociateType = EnumUpAssociateType.ZERO_ONE;
    }
    if (newAssoLink.idEntityAssociate) {
      dispatch(actions.updateAssociate(newAssoLink));
    }
  };

  const handleCheckBox = (targetName: keyof TEntityAssociate) => {
    return async (cp: CheckboxChangeEvent) => {
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: cp.target.checked,
        }),
      );
    };
  };

  const handleSelect = (targetName: keyof TEntityAssociate) => {
    return async (value: EnumUpAssociateType | EnumDownAssociateType) => {
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: value as EnumUpAssociateType,
        }),
      );
    };
  };

  const handleNumber = (targetName: keyof TEntityAssociate) => {
    return (value: number | null) => {
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: value || undefined,
        }),
      );
    };
  };

  const handleChange = (targetName: keyof TEntityAssociate) => {
    return async (ce: ChangeEvent<Element>) => {
      const cei = ce as ChangeEvent<HTMLInputElement>;
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: cei.target.value,
        }),
      );
    };
  };

  const inputValueSnyc = (targetName: keyof TEntityAssociate) => {
    return async () => {
      const newAssoLink = { ...assoLink };
      const targetPK = targetEntity?.attributes?.find(
        (attr) => attr.action !== DOStatus.DELETED && attr.fgPrimaryKey,
      );
      const sourcePK = sourceEntity?.attributes?.find(
        (attr) => attr.action !== DOStatus.DELETED && attr.fgPrimaryKey,
      );
      if (targetName === 'fkColumnName') {
        newAssoLink.fkColumnName = targetPK?.columnName;
      }
      if (targetName === 'fkAttributeName') {
        newAssoLink.fkAttributeName = targetPK?.attributeName;
      }
      if (targetName === 'fkAttributeDisplayName') {
        newAssoLink.fkAttributeDisplayName = targetPK?.displayName;
      }
      if (targetName === 'refAttributeName') {
        if (targetEntity?.className) {
          newAssoLink.refAttributeName = firstToLower(targetEntity.className);
        }
      }
      if (targetName === 'refAttributeDisplayName') {
        newAssoLink.refAttributeDisplayName = targetEntity?.displayName;
      }
      if (targetName === 'downAttributeName') {
        if (sourceEntity?.className) {
          newAssoLink.downAttributeName =
            firstToLower(sourceEntity.className) + 's';
        }
      }
      if (targetName === 'downAttributeDisplayName') {
        newAssoLink.downAttributeDisplayName = sourceEntity?.displayName;
      }
      if (targetName === 'downOrderStr') {
        newAssoLink.downOrderStr = sourcePK?.columnName + ' asc';
      }
      dispatch(actions.updateAssociate(newAssoLink));
    };
  };

  const generateAttr = (e: React.MouseEvent) => {
    fillAttr();
  };

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          {/* {assoLink?.idEntityAssociate} */}
          <Input size={'small'} value={assoLink?.idEntityAssociate} readOnly />
        </Descriptions.Item>
        <Descriptions.Item label="上级实体">
          {targetEntity?.displayName}
        </Descriptions.Item>
        <Descriptions.Item label="下级实体">
          {sourceEntity?.displayName}
        </Descriptions.Item>
        <Descriptions.Item label="属性">
          <Button size={'small'} type={'primary'} onClick={generateAttr}>
            一键填充
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="外键字段">
          <Input
            size={'small'}
            value={assoLink?.fkColumnName}
            onChange={handleChange('fkColumnName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('fkColumnName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="外键属性">
          <Input
            size={'small'}
            value={assoLink?.fkAttributeName}
            onChange={handleChange('fkAttributeName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('fkAttributeName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="外键名称">
          <Input
            size={'small'}
            value={assoLink?.fkAttributeDisplayName}
            onChange={handleChange('fkAttributeDisplayName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('fkAttributeDisplayName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="是否系统引用连线">
          <Checkbox
            checked={assoLink?.fgSysRef}
            onChange={handleCheckBox('fgSysRef')}
          ></Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="是否建立物理外键">
          <Checkbox
            checked={assoLink?.fgForeignKey}
            onChange={handleCheckBox('fgForeignKey')}
          ></Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="ref">
          <Input
            size={'small'}
            value={assoLink?.refAttributeName}
            onChange={handleChange('refAttributeName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('refAttributeName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="ref名称">
          <Input
            size={'small'}
            value={assoLink?.refAttributeDisplayName}
            onChange={handleChange('refAttributeDisplayName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('refAttributeDisplayName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="array">
          <Input
            size={'small'}
            value={assoLink?.downAttributeName}
            onChange={handleChange('downAttributeName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('downAttributeName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="array名称">
          <Input
            size={'small'}
            value={assoLink?.downAttributeDisplayName}
            onChange={handleChange('downAttributeDisplayName')}
            placeholder={'请填写属性名称'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('downAttributeDisplayName')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="下级实体排序">
          <Input
            size={'small'}
            value={assoLink?.downOrderStr}
            onChange={handleChange('downOrderStr')}
            placeholder={'请填写'}
            allowClear
            addonAfter={
              <PauseOutlined
                style={{ transform: 'rotate(90deg)' }}
                onClick={inputValueSnyc('downOrderStr')}
              />
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="批量获取下级实体数量">
          <InputNumber
            size={'small'}
            value={assoLink?.downBatchSize}
            onChange={handleNumber('downBatchSize')}
          />
        </Descriptions.Item>
        <Descriptions.Item label="关系"> </Descriptions.Item>
        <Descriptions.Item label="上级关系">
          <Select
            size={'small'}
            value={assoLink?.upAssociateType}
            placeholder={'请选择'}
            dropdownStyle={{ minWidth: '100px' }}
            onChange={handleSelect('upAssociateType')}
            allowClear
          >
            <Option value={EnumUpAssociateType.ONE}>1</Option>
            <Option value={EnumUpAssociateType.ZERO_ONE}>0...1</Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="下级关系">
          <Select
            size={'small'}
            value={assoLink?.downAssociateType}
            placeholder={'请选择'}
            dropdownStyle={{ minWidth: '100px' }}
            onChange={handleSelect('downAssociateType')}
            allowClear
          >
            <Option value={EnumDownAssociateType.ZERO_TO_ONE}>0...1</Option>
            <Option value={EnumDownAssociateType.ZERO_TO_MANY}>0...*</Option>
            <Option value={EnumDownAssociateType.ONE_TO_ONE}>1...1</Option>
            <Option value={EnumDownAssociateType.ONE_TO_MANY}>1...*</Option>
          </Select>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default AssoLinkLayout;
