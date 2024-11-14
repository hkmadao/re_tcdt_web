import { FC, ReactNode, useEffect, useState } from 'react';
import { Space, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { TAttribute } from '@/pages/ComponentData/ComponentDesign/models';
import { actions } from '@/pages/ComponentData/ComponentDesign/store';
import { useSysDatatypes } from '@/pages/ComponentData/ComponentDesign/hooks';

export type TRefPickerProps = TAttribute;

const AttributeTypePickerInput: FC<TRefPickerProps> = (props) => {
  const { Option } = Select;
  const [attributeTypeOptions, setAttributeTypeOptions] =
    useState<ReactNode[]>();
  const dispatch = useDispatch();
  const sysDataTypes = useSysDatatypes();

  useEffect(() => {
    const newOptions: ReactNode[] = [];
    sysDataTypes?.forEach((dataType, index) => {
      newOptions.push(
        <Option key={dataType.idDataType} value={dataType.idDataType}>
          {dataType.displayName}
        </Option>,
      );
    });
    setAttributeTypeOptions(newOptions);
  }, [sysDataTypes]);

  const handleChange = (value: string) => {
    const findDataType = sysDataTypes?.find(
      (dataType) => dataType.idDataType === value,
    );
    if (!findDataType) {
      return;
    }
    const newAttribute: TAttribute = {
      idAttribute: props.idAttribute,
      idEntity: props.idEntity,
      idAttributeType: findDataType.idDataType,
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
