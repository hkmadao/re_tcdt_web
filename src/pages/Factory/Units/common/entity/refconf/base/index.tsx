import { AutoComplete, Form, Input, Select } from 'antd';
import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { firstToLower } from '@/util/name-convent';
import { TBillRef, TBillTreeRef, TDescriptionInfo } from '../../../model';
import { fetchStringValue } from '@/util';

type TOption = {
  lable: string;
  value: string;
  displayName?: string;
  dataType?: string;
};

type TBillRefBase = Omit<TBillRef, 'billTreeRef' | 'tableRef'>;

const RefBase: (
  props: {
    billRefBase?: TBillRefBase;
    onRefStyleChange: any;
    sourceOptions: TOption[];
    idProject?: string;
  },
  ref: any,
) => any = (
  { billRefBase, onRefStyleChange, sourceOptions, idProject },
  ref,
) => {
  const [form] = Form.useForm<TBillRefBase>();
  const [options, setOptions] = useState<TOption[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      async getBillRefBase() {
        const values = await form.validateFields();
        const result: TBillRefBase = {
          ...values,
        };
        return result;
      },
    }),
    [],
  );

  useEffect(() => {
    if (billRefBase) {
      form.setFieldsValue({
        ...billRefBase,
      });
    }
  }, [billRefBase]);

  const handleSearch = (searchText: string) => {
    const myOptions = sourceOptions.filter(
      (o) =>
        o.lable.indexOf(searchText) > -1 || o.value.indexOf(searchText) > -1,
    );
    setOptions(myOptions);
  };

  return (
    <>
      <div
        style={{
          height: '400px',
          overflow: 'auto',
          margin: '0px 20px 0px 20px',
        }}
      >
        <Form form={form} style={{ display: 'flex', flexDirection: 'column' }}>
          <Form.Item
            label="风格样式"
            name="refStyle"
            rules={[{ required: true, message: 'Please Select refStyle!' }]}
          >
            <Select placeholder={'请选择'} onChange={onRefStyleChange}>
              <Select.Option value={'table'}>表格</Select.Option>
              <Select.Option value={'treeTable'}>树表</Select.Option>
              <Select.Option value={'tree'}>树</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="弹出框标题"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="显示属性"
            name="displayProp"
            rules={[{ required: true, message: 'Please input displayProp!' }]}
          >
            <AutoComplete options={options} onSearch={handleSearch} />
          </Form.Item>
          <Form.Item
            label="回写属性"
            name="backWriteProp"
            rules={[{ required: true, message: 'Please input backWriteProp!' }]}
          >
            <AutoComplete options={options} onSearch={handleSearch} />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default forwardRef(RefBase);
