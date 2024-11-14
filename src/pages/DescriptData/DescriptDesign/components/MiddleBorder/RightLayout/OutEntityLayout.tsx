import { FC, useEffect, useState } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentDiagramContent } from '@/pages/DescriptData/DescriptDesign/store';
import { TModuleStore } from '@/pages/DescriptData/DescriptDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';

const OutEntityLayout: FC = () => {
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const entity = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.OUT_ENTITY
    ) {
      return;
    }
    const idEntity = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection.outEntities?.find(
      (entityFind) => entityFind.idEntity === idEntity,
    );
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(entity);
  }, [currentDiagramContent]);

  const [activeItem, setActiveItem] = useState('');

  const hanleToggleInput = (tagetName: string) => {
    return async () => {
      // if (!tagetName) {
      //   const validates: TEntity = await form.validateFields();
      //   const newEntity: TEntity = { ...validates };
      //   dispatch(setCurrentDiagramContent({ ...entity, ...newEntity }));
      //   setEntity({ ...entity, ...newEntity });
      // }
      // setActiveItem(tagetName);
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
            <Form.Item label={''} name={'idEntity'} noStyle={true}>
              {activeItem === 'idEntity' ? (
                <Input readOnly={true} />
              ) : (
                <Row>
                  <Col span={24}>{entity?.idEntity}</Col>
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
                  onClick={hanleToggleInput('tableName')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{entity?.tableName}</Col>
                </Row>
              )}
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
            名称
          </Col>
          <Col span={16}>
            <Form.Item label={''} name={'name'} noStyle={true}>
              {activeItem === 'name' ? (
                <Input placeholder='小写下划线命名' autoFocus onBlur={hanleToggleInput('')} />
              ) : (
                <Row
                  onClick={hanleToggleInput('name')}
                  style={{ cursor: 'pointer', height: '16px' }}
                >
                  <Col span={24}>{entity.name}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row> */}
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
                  <Col span={24}>{entity?.className}</Col>
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
                  <Col span={24}>{entity?.displayName}</Col>
                </Row>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default OutEntityLayout;
