import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
  fetchEnums,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEnum,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import ReConnEntity from './ReConnEntity';

const EnumLayout: FC = () => {
  const { Option } = Select;
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TDtoEnum>();
  const [activeItem, setActiveItem] = useState<string>();
  const ddEnum = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENUM
    ) {
      return;
    }
    const idEnum = state[moduleName].currentSelect.idElement;
    return state[moduleName].dtoCollection.dtoEnums?.find(
      (entityFind) => entityFind.idDtoEnum === idEnum,
    );
  });

  useEffect(() => {
    form.resetFields();
    if (ddEnum) {
      form.setFieldsValue(ddEnum);
    }
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName?: string) => {
    return async () => {
      // if (!tagetName) {
      //   const validates: TDtoEnum = await form.validateFields();
      //   const newEnum: TDtoEnum = { ...validates };
      //   dispatch(actions.updateEnum({ ...ddEnum, ...newEnum }));
      // }
      setActiveItem(tagetName);
    };
  };

  const handleValuesChange = (changedValues: TDtoEnum, values: TDtoEnum) => {
    const newEnum: TDtoEnum = { ...ddEnum, ...values };
    if (values.refEnum) {
      newEnum.idRef = values.refEnum.idEnum;
    } else {
      newEnum.idRef = undefined;
    }
    dispatch(actions.updateEnum(newEnum));
  };

  const hanleleSync = () => {
    if (ddEnum?.idRef) {
      dispatch(fetchEnums([ddEnum?.idRef]));
    }
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
        onValuesChange={handleValuesChange}
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
                  <Col span={24}>{ddEnum?.idDtoEnum}</Col>
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
        <Row
          style={{
            border: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            引用枚举信息
          </Col>
          <Col span={1}></Col>
          <Col span={15}>
            <Button type={'primary'} onClick={hanleleSync}>
              同步属性
            </Button>
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
            引用枚举ID
          </Col>
          <Col span={16}>
            {/* <Input readOnly value={ddEnum?.refEnum?.idEnum} /> */}
            <Form.Item label={''} name={'refEnum'} noStyle={true}>
              <ReConnEntity entityType={'enum'} />
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
            引用枚举类名
          </Col>
          <Col span={16}>{ddEnum?.refEnum?.className}</Col>
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
            引用枚举名称
          </Col>
          <Col span={16}>{ddEnum?.refEnum?.displayName}</Col>
        </Row>
      </Form>
    </>
  );
};

export default EnumLayout;
