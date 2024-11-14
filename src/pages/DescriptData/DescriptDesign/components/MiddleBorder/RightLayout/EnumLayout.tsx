import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  TEnum,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';

const EnumLayout: FC = () => {
  const { Option } = Select;
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TEnum>();
  const [activeItem, setActiveItem] = useState<string>();
  const ddEnum = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENUM
    ) {
      return;
    }
    const idEnum = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection.enums?.find(
      (entityFind) => entityFind.idEnum === idEnum,
    );
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(ddEnum!);
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName?: string) => {
    return async () => {
      if (!tagetName) {
        const validates: TEnum = await form.validateFields();
        const newEnum: TEnum = { ...validates };
        dispatch(actions.updateEnum({ ...ddEnum, ...newEnum }));
      }
      setActiveItem(tagetName);
    };
  };

  return (
    <>
      <Form
        form={form}
        colon={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        labelAlign={'left'}
        size={'small'}
      >
        <Row
          style={{
            borderBottom: '1px solid #eeeeee',
            borderLeft: '1px solid #eeeeee',
            borderRight: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            ID
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'idEnum'} noStyle={true}>
              {activeItem === 'idEnum' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{ddEnum?.idEnum}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          style={{
            borderBottom: '1px solid #eeeeee',
            borderLeft: '1px solid #eeeeee',
            borderRight: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            类名称
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'className'} noStyle={true}>
              {activeItem === 'className' ? (
                <Input autoFocus onBlur={hanleToggleInput()} />
              ) : (
                <Row
                  onClick={hanleToggleInput('className')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{ddEnum?.className}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          style={{
            borderBottom: '1px solid #eeeeee',
            borderLeft: '1px solid #eeeeee',
            borderRight: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            显示名称
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'displayName'} noStyle={true}>
              {activeItem === 'displayName' ? (
                <Input autoFocus onBlur={hanleToggleInput()} />
              ) : (
                <Row
                  onClick={hanleToggleInput('displayName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{ddEnum?.displayName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          style={{
            borderBottom: '1px solid #eeeeee',
            borderLeft: '1px solid #eeeeee',
            borderRight: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            值类型
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'enumValueType'} noStyle={true}>
              <Select
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
                onChange={hanleToggleInput()}
                allowClear
              >
                <Option value={'String'}>String</Option>
                <Option value={'Int'}>Int</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EnumLayout;
