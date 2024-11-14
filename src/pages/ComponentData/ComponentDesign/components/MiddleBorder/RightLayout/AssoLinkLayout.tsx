import { FC, ReactNode, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  selectComponentEntities,
  selectOutEntities,
  selectCurentSelectType,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TAttribute,
  TEntity,
  TEntityAssociate,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import {
  EnumDownAssociateType,
  EnumUpAssociateType,
} from '@/pages/DescriptData/DescriptDesign/conf';

const AssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const curentSelectType = useSelector(selectCurentSelectType);
  const compoentEntities = useSelector(selectComponentEntities);
  const outEntities = useSelector(selectOutEntities);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TEntityAssociate>();
  const { Option } = Select;
  const [sourceEntity, setSourceEntity] = useState<TEntity>();
  const [targetEntity, setTargetEntity] = useState<TEntity>();
  const [targetEntityPKAttr, setTargetEntityPKAttr] = useState<TAttribute>();
  const [activeItem, setActiveItem] = useState('');
  const [fkOptions, setFkOptions] = useState<ReactNode[]>();

  const assoLink = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ASSOLINK
    ) {
      return;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].component.componentEntityAssociates?.find(
      (entityFind) => entityFind.idComponentEntityAssociate === idElement,
    );
  });

  useEffect(() => {
    if (curentSelectType !== EnumConcreteDiagramType.ASSOLINK) {
      return;
    }
    let parentEntity = compoentEntities?.find(
      (entity) => entity.idEntity === assoLink?.entityAssociate?.idUp,
    )?.ddEntity;
    if (!parentEntity) {
      parentEntity = outEntities?.find(
        (entity) => entity.idEntity === assoLink?.entityAssociate?.idUp,
      );
    }
    const childEntity = compoentEntities?.find(
      (entity) => entity.idEntity === assoLink?.entityAssociate?.idDown,
    )?.ddEntity;

    setSourceEntity(childEntity);
    setTargetEntity(parentEntity);

    form.resetFields();
    form.setFieldsValue({ ...assoLink?.entityAssociate });
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName: string) => {
    return async () => {};
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
            <Form.Item label={''} name={'idEntityAsso'} noStyle={true}>
              {activeItem === 'idEntityAsso' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{assoLink?.idEntityAssociate}</Col>
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
            上级实体
          </Col>
          <Col span={16}>
            <Row>
              <Col span={24}>{targetEntity?.displayName}</Col>
            </Row>
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
            下级实体
          </Col>
          <Col span={16}>
            <Row>
              <Col span={24}>{sourceEntity?.displayName}</Col>
            </Row>
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
            属性
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            外键字段
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'fkColumnName'} noStyle={true}>
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            外键属性
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'fkAttributeName'} noStyle={true}>
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            外键名称
          </Col>
          <Col span={16}>
            <Form.Item
              label={''}
              name={'fkAttributeDisplayName'}
              noStyle={true}
            >
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            ref
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'refAttributeName'} noStyle={true}>
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            ref名称
          </Col>
          <Col span={16}>
            <Form.Item
              label={''}
              name={'refAttributeDisplayName'}
              noStyle={true}
            >
              <Input
                onChange={hanleToggleInput('refAttributeDisplayName')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            array
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'downAttributeName'} noStyle={true}>
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
            array名称
          </Col>
          <Col span={16}>
            <Form.Item
              label={''}
              name={'downAttributeDisplayName'}
              noStyle={true}
            >
              <Input
                onChange={hanleToggleInput('')}
                placeholder={'请填写属性名称'}
                readOnly={true}
              />
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
            关系
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
            上级关系
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'downAssociateType'} noStyle={true}>
              <Select
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
                onChange={hanleToggleInput('')}
                disabled
              >
                {/* <Option value={'zero'}>0</Option> */}
                <Option value={EnumUpAssociateType.ONE}>1</Option>
                {/* <Option value={'more'}>N</Option>
                <Option value={'zeroMore'}>0...N</Option>
                <Option value={'oneMore'}>1...N</Option> */}
                <Option value={EnumUpAssociateType.ZERO_ONE}>0...1</Option>
              </Select>
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
            下级关系
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'downAssociateType'} noStyle={true}>
              <Select
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
                onChange={hanleToggleInput('')}
                disabled
              >
                <Option value={EnumDownAssociateType.ZERO_TO_ONE}>0...1</Option>
                <Option value={EnumDownAssociateType.ZERO_TO_MANY}>
                  0...*
                </Option>
                <Option value={EnumDownAssociateType.ONE_TO_ONE}>1...1</Option>
                <Option value={EnumDownAssociateType.ONE_TO_MANY}>1...*</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* <Row
          style={{
            borderBottom: '1px solid #eeeeee',
            borderLeft: '1px solid #eeeeee',
            borderRight: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            子实体外键
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'fk'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
                allowClear
              >
                {fkOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
    </>
  );
};

export default AssoLinkLayout;
