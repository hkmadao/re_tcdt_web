import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Space, Select, Form } from 'antd';
import { useSelector } from 'react-redux';
import { TAttribute } from '@/pages/DescriptData/DescriptDesign/models';
import { selectSysDataTypes } from '@/pages/DescriptData/DescriptDesign/store';

export type TRefPickerProps = TAttribute & { value?: any; onChange?: any };

const AttributeTypePickerInput: FC<TRefPickerProps> = ({
  value,
  onChange,
  ...attributeProps
}) => {
  const [form] = Form.useForm<TRefPickerProps>();
  const { Option } = Select;
  const [attributeTypeOptions, setAttributeTypeOptions] =
    useState<ReactNode[]>();
  const sysDataTypes = useSelector(selectSysDataTypes);
  const attribute = useMemo(() => attributeProps, [attributeProps]);

  useEffect(() => {
    form.setFieldsValue(attributeProps);
  }, [attributeProps]);

  useEffect(() => {
    if (attribute) {
      form.setFieldsValue(attribute);
    }
  }, [attribute]);

  useMemo(() => {
    const newOptions: ReactNode[] = [];
    sysDataTypes.forEach((dataType) => {
      newOptions.push(
        <Option key={dataType.idDataType} value={dataType.idDataType}>
          {dataType.displayName}
        </Option>,
      );
    });
    setAttributeTypeOptions(newOptions);
  }, []);

  const handleChange = (changedValues: any, values: TRefPickerProps) => {
    onChange(values.idAttributeType);
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Form form={form} onValuesChange={handleChange}>
          <Form.Item name={'idAttributeType'} noStyle>
            <Select placeholder={'请选择'} style={{ maxWidth: '150px' }}>
              {attributeTypeOptions}
            </Select>
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};

export default AttributeTypePickerInput;
