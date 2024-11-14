import { FC, ReactNode, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
  fetchEntityAttributes,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEnumAssociate,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';

const EnumAssoLinkLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TDtoEnumAssociate>();
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
      const assoLink = state[moduleName].dtoCollection.dtoEnumAssociates?.find(
        (entityFind) => entityFind.idDtoEnumAssociate === idElement,
      );
      const findEntity = state[moduleName].dtoCollection.dtoEntities?.find(
        (entity) => entity.idDtoEntity === assoLink?.idDtoEntity,
      );
      const allEnumSet = [...state[moduleName].dtoCollection.dtoEnums]; // 内外部枚举集合
      const findEnum = allEnumSet?.find(
        (ddEnum) => ddEnum.idDtoEnum === assoLink?.idDtoEnum,
      );
      const attributeOptions: ReactNode[] = [];
      findEntity?.deAttributes?.forEach((entityAttr) => {
        if (entityAttr.action === DOStatus.DELETED) {
          return;
        }
        if (entityAttr.fgPrimaryKey) {
          return;
        }
        // 一个字段只能被一条枚举线选中
        const findEnumAsso = state[
          moduleName
        ].dtoCollection.dtoEnumAssociates.find((enumAsso) => {
          if (
            enumAsso.action !== DOStatus.DELETED &&
            enumAsso.idDtoEnumAssociate !== assoLink?.idDtoEnumAssociate &&
            enumAsso.idDtoEntityAttribute === entityAttr.idDtoEntityAttribute
          ) {
            return true;
          }
          return false;
        });
        if (findEnumAsso) {
          return;
        }
        attributeOptions.push(
          <Option
            key={entityAttr.idDtoEntityAttribute!}
            value={entityAttr.idDtoEntityAttribute!}
          >
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
      (!sourceEntity.deAttributes || sourceEntity.deAttributes.length === 0)
    ) {
      idEntities.push(sourceEntity.idDtoEntity);
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
            <Form.Item label={''} name={'idEnumAssociate'} noStyle={true}>
              {activeItem === 'idEnumAssociate' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{assoLink?.idDtoEnumAssociate}</Col>
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
            <Form.Item label={''} name={'idDtoEntityAttribute'} noStyle={true}>
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
