import { FC, ReactNode, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  TEnumAssociate,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { fetchEntityAttributes } from '@/pages/DescriptData/DescriptDesign/store/fetch-entity-attribute';

const EnumAssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TEnumAssociate>();
  const { Option } = Select;
  const [activeItem, setActiveItem] = useState<string>();

  const { assoLink, sourceEntity, targetEnum, attributeOptions } = useSelector(
    (state: Record<string, TModuleStore>) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ENUMASSOLINK
      ) {
        return {};
      }
      const idElement = state[moduleName].currentSelect.idElement;
      const assoLink = state[moduleName].entityCollection.enumAssociates?.find(
        (entityFind) => entityFind.idEnumAssociate === idElement,
      );
      const findEntity = state[moduleName].entityCollection.entities?.find(
        (entity) => entity.idEntity === assoLink?.idEntity,
      );
      const allEnumSet = [
        ...state[moduleName].entityCollection.enums,
        ...state[moduleName].entityCollection.outEnums,
      ]; // 内外部枚举集合
      const findEnum = allEnumSet?.find(
        (ddEnum) => ddEnum.idEnum === assoLink?.idEnum,
      );
      const attributeOptions: ReactNode[] = [];
      findEntity?.attributes?.forEach((entityAttr) => {
        if (entityAttr.action === DOStatus.DELETED) {
          return;
        }
        if (entityAttr.fgPrimaryKey) {
          return;
        }
        // 一个字段只能被一条枚举线选中
        const findEnumAsso = state[
          moduleName
        ].entityCollection.enumAssociates.find((enumAsso) => {
          if (
            enumAsso.action !== DOStatus.DELETED &&
            enumAsso.idEnumAssociate !== assoLink?.idEnumAssociate &&
            enumAsso.idAttribute === entityAttr.idAttribute
          ) {
            return true;
          }
          return false;
        });
        if (findEnumAsso) {
          return;
        }
        attributeOptions.push(
          <Option key={entityAttr.idAttribute!} value={entityAttr.idAttribute!}>
            {entityAttr.displayName}
          </Option>,
        );
      });
      return {
        assoLink,
        sourceEntity: findEntity,
        targetEnum: findEnum,
        attributeOptions,
      };
    },
  );

  useEffect(() => {
    //加载实体属性
    const idEntities: string[] = [];
    if (
      sourceEntity &&
      (!sourceEntity.attributes || sourceEntity.attributes.length === 0)
    ) {
      idEntities.push(sourceEntity.idEntity);
    }
    if (idEntities.length > 0) {
      dispatch(fetchEntityAttributes(idEntities));
    }

    form.resetFields();
    form.setFieldsValue({ ...assoLink });
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName?: string) => {
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
                onChange={hanleToggleInput()}
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
