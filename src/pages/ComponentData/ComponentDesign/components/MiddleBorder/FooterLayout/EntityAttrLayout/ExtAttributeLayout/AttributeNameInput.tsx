import { FC, Key, ReactNode, useEffect, useMemo, useState } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models/enums';
import {
  TExtAttribute,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import { actions } from '@/pages/ComponentData/ComponentDesign/store';

export type TExtAttributeNameInputProps = TExtAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeNameInput: FC<TExtAttributeNameInputProps> = ({
  idExtAttribute,
}) => {
  const [form] = Form.useForm<TExtAttributeNameInputProps>();
  const dispatch = useDispatch();

  const extAttribute = useSelector((state: { [x: string]: TModuleStore }) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].component.componentEntities
      ?.find((entityFind) => entityFind.idComponentEntity === idElement)
      ?.extAttributes?.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idExtAttribute === idExtAttribute,
      );
  });

  useEffect(() => {
    if (extAttribute) {
      form.setFieldsValue(extAttribute);
    }
  }, [extAttribute]);

  const handleChange = async () => {
    const values = await form.validateFields();
    const newAttribute: TExtAttribute = {
      ...extAttribute,
      idExtAttribute,
    };
    dispatch(actions.updateExtAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TExtAttribute = {
      ...extAttribute,
      idExtAttribute,
    };
    dispatch(actions.updateExtAttribute(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Form form={form}>
          <Form.Item name={'attributeName'} noStyle>
            <Input
              onBlur={handleChange}
              addonAfter={
                <PauseOutlined
                  style={{ transform: 'rotate(90deg)' }}
                  onClick={handleClick}
                />
              }
            />
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};

export default AttributeNameInput;
