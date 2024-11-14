import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Input, Space, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models/enums';
import {
  TComputationAttribute,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import {
  actions,
  selectSysDataTypes,
} from '@/pages/ComponentData/ComponentDesign/store';

export type TRefPickerProps = TComputationAttribute;

const AttributeTypePickerInput: FC<TRefPickerProps> = ({
  idComputationAttribute,
}) => {
  const { Option } = Select;
  const [attributeTypeOptions, setAttributeTypeOptions] =
    useState<ReactNode[]>();
  const dispatch = useDispatch();
  const sysDataTypes = useSelector(selectSysDataTypes);

  const computationAttribute = useSelector(
    (state: { [x: string]: TModuleStore }) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ENTITY
      ) {
        return;
      }
      const idElement = state[moduleName].currentSelect.idElement;
      return state[moduleName].component.componentEntities
        ?.find((entityFind) => entityFind.idComponentEntity === idElement)
        ?.computationAttributes?.find(
          (entityAttr) =>
            entityAttr.action !== DOStatus.DELETED &&
            entityAttr.idComputationAttribute === idComputationAttribute,
        );
    },
  );

  useMemo(() => {
    const newOptions: ReactNode[] = [];
    sysDataTypes?.forEach((dataType) => {
      newOptions.push(
        <Option key={dataType.idDataType} value={dataType.idDataType}>
          {dataType.displayName}
        </Option>,
      );
    });
    setAttributeTypeOptions(newOptions);
  }, []);

  const handleChange = (value: string) => {
    const findDataType = sysDataTypes?.find(
      (dataType) => dataType.idDataType === value,
    );
    if (!findDataType) {
      return;
    }
    const newAttribute: TComputationAttribute = {
      ...computationAttribute,
      idComputationAttribute: idComputationAttribute,
      idAttributeType: findDataType.idDataType,
      attributeType: { ...findDataType },
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Select
          onChange={handleChange}
          placeholder={'请选择'}
          defaultValue={computationAttribute?.idAttributeType}
          style={{ maxWidth: '150px' }}
        >
          {attributeTypeOptions}
        </Select>
      </Space>
    </>
  );
};

export default AttributeTypePickerInput;
