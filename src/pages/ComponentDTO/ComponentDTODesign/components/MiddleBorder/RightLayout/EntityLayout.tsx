import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
  fetchEntites,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  TDtoEntity,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import ReConnEntity from './ReConnEntity';

const EntityLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm<TDtoEntity>();
  const [activeItem, setActiveItem] = useState<string>();
  const dtoEntity = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return;
    }
    const idDtoEntity = state[moduleName].currentSelect.idElement;
    return state[moduleName].dtoCollection.dtoEntities?.find(
      (entityFind) => entityFind.idDtoEntity === idDtoEntity,
    );
  });

  useEffect(() => {
    form.resetFields();
    if (dtoEntity) {
      form.setFieldsValue(dtoEntity);
    }
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName?: string) => {
    return async () => {
      // if (!tagetName) {
      //   const validates: TDtoEntity = await form.validateFields();
      //   const newEntity: TDtoEntity = { ...validates };
      //   dispatch(actions.updateEntity({ ...dtoEntity, ...newEntity }));
      // }
      setActiveItem(tagetName);
    };
  };

  const handleValuesChange = (
    changedValues: TDtoEntity,
    values: TDtoEntity,
  ) => {
    const newEntity: TDtoEntity = { ...dtoEntity, ...values };
    if (values.refEntity) {
      newEntity.idRef = values.refEntity.idEntity;
    } else {
      newEntity.idRef = undefined;
    }
    dispatch(actions.updateEntity(newEntity));
  };

  const hanleleSync = () => {
    if (dtoEntity?.idRef) {
      dispatch(fetchEntites([dtoEntity?.idRef]));
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
            <Form.Item label={''} name={'idDtoEntity'} noStyle={true}>
              <Input readOnly={true} />
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
            表名
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tableName'} noStyle={true}>
              {activeItem === 'tableName' ? (
                <Input autoFocus onBlur={hanleToggleInput()} />
              ) : (
                <Row
                  onClick={hanleToggleInput('tableName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{dtoEntity?.tableName}</Col>
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
          <Col
            span={8}
            style={{
              borderRight: '1px solid #eeeeee',
              // textDecorationLine: 'line-through',
            }}
          >
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
                  <Col span={24}>{dtoEntity?.className}</Col>
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
                  <Col span={24}>{dtoEntity?.displayName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>&nbsp;</Col>
        </Row>
        <Row
          style={{
            border: '1px solid #eeeeee',
            padding: '5px 0px',
          }}
        >
          <Col span={8} style={{ borderRight: '1px solid #eeeeee' }}>
            引用实体信息
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
            引用实体
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'refEntity'} noStyle={true}>
              <ReConnEntity entityType={'entity'} />
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
            引用实体表名
          </Col>
          <Col span={16}>{dtoEntity?.refEntity?.tableName}</Col>
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
            引用实体类名
          </Col>
          <Col span={16}>{dtoEntity?.refEntity?.className}</Col>
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
            引用实体名称
          </Col>
          <Col span={16}>{dtoEntity?.refEntity?.displayName}</Col>
        </Row>
      </Form>
    </>
  );
};

export default EntityLayout;
