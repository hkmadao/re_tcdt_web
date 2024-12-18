import { FC, ReactNode, useEffect, useState } from 'react';
import ModuleAPI from '@/pages/Factory/Units/Query/api';
import { TQuery, TQueryContent } from '@/pages/Factory/Units/Query/model';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  Upload,
} from 'antd';
import RefPicker from '@/components/Ref';

const SearchPriview: FC<{ idConf: string }> = ({ idConf }) => {
  const [itemNodes, setItemNodes] = useState<ReactNode[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    (async (idConf) => {
      if (idConf) {
        const q: TQuery = await ModuleAPI.getById(idConf);
        if (!q.content) {
          return;
        }
        const qc: TQueryContent = JSON.parse(q.content);
        const searcheRefs = qc.searchRefs;
        if (searcheRefs) {
          const newItemNodes: ReactNode[] = [];

          searcheRefs.forEach((searcheRef) => {
            let childNodeTemp = (
              <Form.Item
                style={{
                  margin: 0,
                }}
                label={searcheRef.label}
                name={searcheRef.attributeName}
              >
                <Input />
              </Form.Item>
            );

            switch (searcheRef.htmlInputType) {
              case 'Ref':
                let refConfig = searcheRef.refConfig!;
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <RefPicker {...refConfig} />
                  </Form.Item>
                );
                break;
              case 'Input':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <Input />
                  </Form.Item>
                );
                break;
              case 'Select':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <Select
                      style={{ minWidth: '100px' }}
                      value={searcheRef.defaultValue}
                      placeholder={'请选择'}
                    >
                      {searcheRef.enumConfig?.enumColumns?.map((ve) => (
                        <Select.Option
                          key={ve.idEnumColumn}
                          value={ve.enumValue}
                        >
                          {ve.displayName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
                break;
              case 'Text':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <Input type="Text" />
                  </Form.Item>
                );
                break;
              case 'InputNumber':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <InputNumber />
                  </Form.Item>
                );
                break;
              case 'Checkbox':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                    valuePropName="checked"
                  >
                    <Checkbox />
                  </Form.Item>
                );
                break;
              case 'Date':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <DatePicker />
                  </Form.Item>
                );
                break;
              case 'Time':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <TimePicker />
                  </Form.Item>
                );
                break;
              case 'DateTime':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={true} />
                  </Form.Item>
                );
                break;
              case 'Image':
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                    initialValue={searcheRef.defaultValue}
                  >
                    <Upload listType="picture-card" className="avatar-uploader">
                      Upload
                    </Upload>
                  </Form.Item>
                );
                break;
              default:
                childNodeTemp = (
                  <Form.Item
                    style={{
                      margin: 0,
                    }}
                    label={searcheRef.label}
                    name={searcheRef.attributeName}
                  >
                    <Input />
                  </Form.Item>
                );
            }
            newItemNodes.push(childNodeTemp);
          });
          setItemNodes(newItemNodes);

          const initValues = searcheRefs.reduce((prev, cur, index) => {
            if (index === 0) {
              return { [cur.attributeName!]: cur.defaultValue } as any;
            }
            return { ...prev, [cur.attributeName!]: cur.defaultValue } as any;
          });
          form.setFieldsValue(initValues);
        }
      }
    })(idConf);
  }, [idConf]);

  const handleValuesChange = () => {};

  const handleSearch = () => {};

  return (
    <>
      <div
        style={{
          display: 'block',
        }}
      >
        <Form
          form={form}
          layout={'inline'}
          onValuesChange={handleValuesChange}
          style={{
            gap: '10px',
          }}
        >
          {itemNodes}
          <Form.Item style={{ padding: '5px 0px 5px 0px' }}>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SearchPriview;
