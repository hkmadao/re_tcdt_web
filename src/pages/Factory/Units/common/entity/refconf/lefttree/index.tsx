import { AutoComplete, Form, Input, Select, Space } from 'antd';
import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { firstToLower } from '@/util/name-convent';
import { TBillTreeRef, TDescriptionInfo } from '../../../model';
import SelectComponentEntity from '../../SelectComponentEntity';
import CommonAPI from '../../../api';
import { fetchStringValue } from '@/util';

type TOption = {
  lable: string;
  value: string;
  displayName?: string;
  dataType?: string;
};

// type TForm = Omit<TBillTreeRef, 'keyAttr' | 'labelAttr'> & {
//   keyAttr?: string[];
//   labelAttr?: string[];
// };

const LeftRefTree: (
  props: {
    billTreeRef?: TBillTreeRef;
    optionCallback: (options: TOption[]) => void;
    idProject?: string;
  },
  ref: any,
) => any = ({ billTreeRef, optionCallback, idProject }, ref) => {
  const [form] = Form.useForm<TBillTreeRef>();
  const [idComponentEntity, setIdComponentEntity] = useState<string>();
  const [ceDisplayName, setCeDisplayName] = useState<string>();
  const [sourceOptions, setSourceOptions] = useState<TOption[]>([]);
  const [options, setOptions] = useState<TOption[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      async getBillTreeConf() {
        const values = await form.validateFields();
        const result: TBillTreeRef = {
          ...values,
          keyAttr: fetchStringValue(values.keyAttr),
          labelAttr: fetchStringValue(values.labelAttr),
          idComponentEntity,
          ceDisplayName,
        };
        return result;
      },
    }),
    [],
  );

  useEffect(() => {
    form.resetFields();
    setCeDisplayName(undefined);
    setIdComponentEntity(undefined);
    setOptions([]);
    if (billTreeRef) {
      form.setFieldsValue({
        ...billTreeRef,
        keyAttr: billTreeRef.keyAttr,
        labelAttr: billTreeRef.labelAttr,
      });
    }
  }, [billTreeRef]);

  const handleCe: (idComponentEntity: string, ceDisplayName: string) => void = (
    idComponentEntity,
    ceDisplayName,
  ) => {
    setIdComponentEntity(idComponentEntity);
    setCeDisplayName(ceDisplayName);
  };

  useEffect(() => {
    if (idComponentEntity) {
      CommonAPI.getDescriptionDataByCompEntiId({ id: idComponentEntity }).then(
        (componentEntity: TDescriptionInfo) => {
          const values = form.getFieldsValue();
          // if (!values.uri) {
          // }
          form.setFieldsValue({
            ...values,
            uri:
              '/' +
              firstToLower(componentEntity.entityInfo?.className!) +
              '/aq',
          });
          let newOptions: { lable: string; value: string }[] = [];
          componentEntity.entityInfo?.attributes?.forEach((extattr) => {
            newOptions.push({
              lable: extattr.displayName!,
              value: extattr.attributeName!,
            });
          });
          setSourceOptions(newOptions);
          optionCallback(newOptions);
        },
      );
    }
  }, [idComponentEntity]);

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
        <Space size={10} direction={'vertical'}>
          <SelectComponentEntity
            filterProjectIds={idProject ? [idProject] : []}
            displayName={ceDisplayName}
            callback={handleCe}
          />
          <Form
            form={form}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Form.Item
              label={'加载树uri'}
              name={'uri'}
              style={{ width: '300px', alignSelf: 'center' }}
            >
              <Input allowClear placeholder={'请输入加载树uri'} />
            </Form.Item>
            <Form.Item
              label={'http方式'}
              name={'method'}
              style={{ width: '300px', alignSelf: 'center' }}
            >
              <Select placeholder="请选择" allowClear>
                <Select.Option value={'POST'}>POST</Select.Option>
                <Select.Option value={'GET'}>GET</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={'树主属性'}
              name={'keyAttr'}
              style={{ width: '300px', alignSelf: 'center' }}
            >
              <AutoComplete options={options} onSearch={handleSearch} />
              {/* <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder=""
              options={options}
            /> */}
            </Form.Item>
            <Form.Item
              label={'树显示属性'}
              name={'labelAttr'}
              style={{ width: '300px', alignSelf: 'center' }}
            >
              <AutoComplete options={options} onSearch={handleSearch} />
              {/* <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder=""
              options={options}
            /> */}
            </Form.Item>
            <Form.Item
              label={'参数'}
              name={'methodParams'}
              style={{ width: '300px', alignSelf: 'center' }}
            >
              <Input allowClear placeholder={'请输入参数'} />
            </Form.Item>
          </Form>
        </Space>
      </div>
    </>
  );
};

export default forwardRef(LeftRefTree);
