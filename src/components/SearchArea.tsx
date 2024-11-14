import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Select } from 'antd';
import RefPickerInput from '@/components/Ref';
import { EInputType, TBillSearchRef } from '@/models';

type TSearchAreaLayout = {
  searchRefs?: TBillSearchRef[];
  callback: any;
};

const SearchArea: FC<TSearchAreaLayout> = ({ searchRefs, callback }) => {
  const [itemNodes, setItemNodes] = useState<ReactNode[]>([]);
  const [form] = Form.useForm();

  const handleSearch = async () => {
    const values = await form.validateFields();
    callback(values);
  };

  useEffect(() => {
    if (searchRefs) {
      //设置搜索条件
      const newItemNodes: ReactNode[] = [];
      searchRefs.forEach((searcheRef) => {
        if (searcheRef.htmlInputType === 'Ref') {
          const refConfig = searcheRef.refConfig;
          if (refConfig) {
            newItemNodes.push(
              <Form.Item
                label={searcheRef.label}
                name={searcheRef.attributeName}
                style={{ padding: '5px 0px 5px 0px' }}
              >
                <RefPickerInput {...refConfig} />
              </Form.Item>,
            );
          }
        }
        if (searcheRef.htmlInputType === 'Input') {
          newItemNodes.push(
            <Form.Item
              label={searcheRef.label}
              name={searcheRef.attributeName}
              style={{ padding: '5px 0px 5px 0px' }}
            >
              <Input allowClear placeholder={'请输入' + searcheRef.label} />
            </Form.Item>,
          );
        }
        if (searcheRef.htmlInputType === 'InputNumber') {
          newItemNodes.push(
            <Form.Item
              label={searcheRef.label}
              name={searcheRef.attributeName}
              style={{ padding: '5px 0px 5px 0px' }}
              valuePropName="checked"
            >
              <InputNumber placeholder={'请输入序号'} />
            </Form.Item>,
          );
        }
        if (searcheRef.htmlInputType === 'Checkbox') {
          newItemNodes.push(
            <Form.Item
              label={searcheRef.label}
              name={searcheRef.attributeName}
              style={{ padding: '5px 0px 5px 0px' }}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>,
          );
        }
        if (searcheRef.htmlInputType === 'Select') {
          const valueEnums = searcheRef.enumConfig?.enumColumns;
          const newOptions: ReactNode[] = [];
          if (valueEnums) {
            valueEnums.forEach((valueEnum) => {
              newOptions.push(
                <Select.Option
                  label={valueEnum.displayName}
                  value={valueEnum.enumValue}
                >
                  {valueEnum.displayName}
                </Select.Option>,
              );
            });
            newItemNodes.push(
              <Form.Item
                label={searcheRef.label}
                name={searcheRef.attributeName}
                style={{ padding: '5px 0px 5px 0px' }}
              >
                <Select
                  defaultValue={searcheRef.defaultValue}
                  style={{ minWidth: 100 }}
                  placeholder={'请选择'}
                  allowClear
                >
                  {newOptions}
                </Select>
              </Form.Item>,
            );
          }
        }
      });
      setItemNodes(newItemNodes);

      //设置默认值
      const formDefaultValues: any = {};
      searchRefs.forEach((searcheRef) => {
        if (!searcheRef.attributeName) {
          return;
        }
        formDefaultValues[searcheRef.attributeName] = searcheRef.defaultValue;
      });
      form.setFieldsValue(formDefaultValues);
    }
  }, [searchRefs]);

  return (
    <>
      <Form form={form} layout={'inline'}>
        {itemNodes}
        <Form.Item style={{ padding: '5px 0px 5px 0px' }}>
          <Button type="primary" htmlType="submit" onClick={handleSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SearchArea;
