import { FC, ReactNode, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  selectComponentEntities,
  actions,
  selectComponentEnums,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TEnumAssociate,
  TEntity,
  TEnum,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';

const EnumAssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const entities = useSelector(selectComponentEntities);
  const enums = useSelector(selectComponentEnums);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TEnumAssociate>();
  const { Option } = Select;
  const [sourceEntity, setSourceEntity] = useState<TEntity>();
  const [targetEnum, setTargetEnum] = useState<TEnum>();
  const [activeItem, setActiveItem] = useState('');
  const [attributeOptions, setAttributeOptions] = useState<ReactNode[]>();

  const assoLink = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENUMASSOLINK
    ) {
      return;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].component.enumAssociates?.find(
      (entityFind) => entityFind.idEnumAssociate === idElement,
    );
  });

  useEffect(() => {
    let findEntity = entities?.find(
      (entity) => entity.idEntity === assoLink?.idEntity,
    )?.ddEntity;
    const findEnum = enums?.find(
      (ddEnum) => ddEnum.idEnum === assoLink?.idEnum,
    );
    setSourceEntity(findEntity);
    setTargetEnum(findEnum);

    const newFkOptions: ReactNode[] = [];
    findEntity?.attributes?.forEach((entityAttr) => {
      if (entityAttr.action === DOStatus.DELETED) {
        return;
      }
      newFkOptions.push(
        <Option key={entityAttr.idAttribute!} value={entityAttr.idAttribute!}>
          {entityAttr.displayName}
        </Option>,
      );
    });
    setAttributeOptions(newFkOptions);

    form.resetFields();
    form.setFieldsValue({ ...assoLink });
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      if (!tagetName) {
        const validates = await form.validateFields();
        dispatch(actions.updateEnumAssociate({ ...assoLink, ...validates }));
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
            <Form.Item label={''} name={'idEntityAsso'} noStyle={true}>
              {activeItem === 'idEntityAsso' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{assoLink?.idEnumAssociate}</Col>
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
            枚举
          </Col>
          <Col span={16}>
            <Row>
              <Col span={24}>{targetEnum?.displayName}</Col>
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
            实体
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
            实体属性
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'idAttribute'} noStyle={true}>
              <Select
                onChange={hanleToggleInput('')}
                placeholder={'请选择'}
                dropdownStyle={{ minWidth: '100px' }}
              >
                {attributeOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EnumAssoLinkLayout;
