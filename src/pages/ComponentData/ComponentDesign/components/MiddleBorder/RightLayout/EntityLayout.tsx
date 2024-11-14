import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentDiagramContent,
  actions,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentEntity,
  TEntity,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';

const EntityLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [activeItem, setActiveItem] = useState('');
  const componentEntity = useSelector(
    (state: { [x: string]: TModuleStore }) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ENTITY
      ) {
        return;
      }
      const idElement = state[moduleName].currentSelect.idElement;
      return state[moduleName].component.componentEntities?.find(
        (entityFind) => entityFind.idComponentEntity === idElement,
      );
    },
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentEntity);
  }, [currentDiagramContent]);

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      if (!tagetName) {
        const newComponentEntity: TComponentEntity =
          await form.validateFields();
        dispatch(
          actions.updateComponentEntity({
            ...componentEntity,
            ...newComponentEntity,
          }),
        );
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
            <Form.Item label={''} name={'idComponentEntity'} noStyle={true}>
              {activeItem === 'idComponentEntity' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{componentEntity?.idEntity}</Col>
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
            表名
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'tableName'} noStyle={true}>
              {activeItem === 'tableName' ? (
                <Input autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{componentEntity?.ddEntity?.tableName}</Col>
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
                  onClick={hanleToggleInput('')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{componentEntity?.ddEntity?.className}</Col>
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
                  onClick={hanleToggleInput('')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{componentEntity?.ddEntity?.displayName}</Col>
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
            虚拟实体
          </Col>
          <Col span={16}>{componentEntity?.fgVirtual ? '是' : '否'}</Col>
        </Row>
      </Form>
    </>
  );
};

export default EntityLayout;
