import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TEnum,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';

const ComponentEnumLayout: FC = () => {
  const { Option } = Select;
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [activeItem, setActiveItem] = useState('');
  const componentEnum = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENUM
    ) {
      return;
    }
    const idComponentEnum = state[moduleName].currentSelect.idElement;
    return state[moduleName].component.componentEnums?.find(
      (componentEnumFind) =>
        componentEnumFind.idComponentEnum === idComponentEnum,
    );
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentEnum?.ddEnum);
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      if (!tagetName) {
        const validates: TEnum = await form.validateFields();
        const newEnum: TEnum = { ...validates };
        dispatch(actions.updateEnum({ ...componentEnum, ...newEnum }));
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
            <Form.Item label={''} name={'idComponentEnum'} noStyle={true}>
              {activeItem === 'idComponentEnum' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{componentEnum?.idComponentEnum}</Col>
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
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('className')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{componentEnum?.ddEnum?.className}</Col>
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
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('displayName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{componentEnum?.ddEnum?.displayName}</Col>
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
                onChange={hanleToggleInput('')}
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

export default ComponentEnumLayout;
