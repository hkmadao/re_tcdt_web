import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Input, Select, Button, Descriptions, Checkbox } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
  fetchEntityAttributes,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEntityAttribute,
  TDtoEntityAssociate,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumUpAssociateType,
  EnumConcreteDiagramType,
  EnumDownAssociateType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { firstToLower } from '@/util/name-convent';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const AssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const { Option } = Select;
  const [targetEntityPKAttr, setTargetEntityPKAttr] =
    useState<TDtoEntityAttribute>();

  const { assoLink, sourceEntity, targetEntity } = useSelector(
    (state: Record<string, TModuleStore>) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ASSOLINK
      ) {
        return {};
      }
      const idElement = state[moduleName].currentSelect.idElement;
      const assoLink = state[moduleName].dtoCollection.deAssociates?.find(
        (entityFind) => entityFind.idDtoEntityAssociate === idElement,
      );
      let parentEntity = state[moduleName].dtoCollection.dtoEntities?.find(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          entity.idDtoEntity === assoLink?.idUp,
      );
      const childEntity = state[moduleName].dtoCollection.dtoEntities?.find(
        (entity) => entity.idDtoEntity === assoLink?.idDown,
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
      (!sourceEntity.deAttributes || sourceEntity.deAttributes.length === 0)
    ) {
      idEntities.push(sourceEntity.idDtoEntity);
    }
    if (
      targetEntity &&
      (!targetEntity.deAttributes || targetEntity.deAttributes.length === 0)
    ) {
      idEntities.push(targetEntity.idDtoEntity);
    }
    if (idEntities.length > 0) {
      dispatch(fetchEntityAttributes(idEntities));
    }
  }, [currentDiagramContent]);

  const fillAttr = () => {
    const newAssoLink: TDtoEntityAssociate = assoLink ? { ...assoLink } : {};

    const targetPK = targetEntity?.deAttributes?.find(
      (attr) => attr.action !== DOStatus.DELETED && attr.fgPrimaryKey,
    );
    setTargetEntityPKAttr(targetPK);

    if (targetPK) {
      if (!newAssoLink.fkColumnName) {
        newAssoLink.fkColumnName = targetPK.columnName;
      }
      if (!newAssoLink.fkAttributeName) {
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
    if (newAssoLink.idDtoEntityAssociate) {
      dispatch(actions.updateAssociate(newAssoLink));
    }
  };

  const inputValueSnyc = (targetName: keyof TDtoEntityAssociate) => {
    return async () => {
      const newAssoLink: TDtoEntityAssociate = assoLink ? { ...assoLink } : {};
      if (targetName === 'fkColumnName') {
        newAssoLink.fkColumnName = targetEntityPKAttr?.columnName;
      }
      if (targetName === 'fkAttributeName') {
        newAssoLink.fkAttributeName = targetEntityPKAttr?.attributeName;
      }
      if (targetName === 'fkAttributeDisplayName') {
        newAssoLink.fkAttributeDisplayName = targetEntityPKAttr?.displayName;
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
      dispatch(actions.updateAssociate({ ...assoLink, ...newAssoLink }));
    };
  };

  const generateAttr = (e: React.MouseEvent) => {
    fillAttr();
  };

  const handleCheckBox = (targetName: keyof TDtoEntityAssociate) => {
    return async (cp: CheckboxChangeEvent) => {
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: cp.target.checked,
        }),
      );
    };
  };

  const handleSelect = (targetName: keyof TDtoEntityAssociate) => {
    return async (value: EnumUpAssociateType | EnumDownAssociateType) => {
      dispatch(
        actions.updateAssociate({
          ...assoLink,
          [targetName]: value as EnumUpAssociateType,
        }),
      );
    };
  };

  const handleChange = (targetName: keyof TDtoEntityAssociate) => {
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

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          {/* {assoLink?.idEntityAssociate} */}
          <Input
            size={'small'}
            value={assoLink?.idDtoEntityAssociate}
            readOnly
          />
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
        {/* <Descriptions.Item label="外键字段">
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
        </Descriptions.Item> */}
        <Descriptions.Item label="是否系统引用连线">
          <Checkbox
            checked={assoLink?.fgSysRef}
            onChange={handleCheckBox('fgSysRef')}
          ></Checkbox>
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
