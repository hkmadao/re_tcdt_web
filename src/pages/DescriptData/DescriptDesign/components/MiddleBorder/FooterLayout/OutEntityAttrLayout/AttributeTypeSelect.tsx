import { FC, ReactNode, useMemo, useState } from 'react';
import { Select, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { TAttribute } from '@/pages/DescriptData/DescriptDesign/models';
import {
  actions,
  selectSysDataTypes,
} from '@/pages/DescriptData/DescriptDesign/store';

export type TRefPickerProps = TAttribute;

const AttributeTypePickerInput: FC<TRefPickerProps> = (props) => {
  const [attributeTypeOptions, setAttributeTypeOptions] =
    useState<ReactNode[]>();
  const dataTypes = useSelector(selectSysDataTypes);
  const dispatch = useDispatch();

  useMemo(() => {}, []);

  const handleChange = (value: string) => {
    const findDataType = dataTypes.find(
      (dataType) => dataType.idDataType === value,
    );
    if (!findDataType) {
      return;
    }
    const newAttribute: TAttribute = {
      idAttribute: props.idAttribute,
      idEntity: props.idEntity,
      idAttributeType: findDataType.idDataType,
      attributeTypeName: findDataType.displayName,
    };
    dispatch(actions.updateAttributeType(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Select
          onChange={handleChange}
          placeholder={'请选择'}
          defaultValue={props.idAttributeType}
          style={{ maxWidth: '150px' }}
        >
          {attributeTypeOptions}
        </Select>
      </Space>
    </>
  );
};

export default AttributeTypePickerInput;
