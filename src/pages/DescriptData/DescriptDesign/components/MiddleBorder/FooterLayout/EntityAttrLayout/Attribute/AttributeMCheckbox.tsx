import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Form } from 'antd';
import type { TModuleStore } from '@/pages/DescriptData/DescriptDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { DOStatus } from '@/models/enums';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TAttribute } from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';

export type TAttributeNameInputProps = TAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeMCheckbox: FC<TAttributeNameInputProps> = ({
  idAttribute,
  fgMandatory,
}) => {
  const [form] = Form.useForm<TAttributeNameInputProps>();
  const dispatch = useDispatch();

  // 获取属性
  const attribute = useSelector((state: Record<string, TModuleStore>) => {
    if (
      state[moduleName].currentSelect.concreteType !==
      EnumConcreteDiagramType.ENTITY
    ) {
      return;
    }
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection.entities
      ?.find((entityFind) => entityFind.idEntity === idElement)
      ?.attributes?.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idAttribute === idAttribute,
      );
  });

  useEffect(() => {
    if (attribute) {
      form.setFieldsValue(attribute);
    }
  }, [attribute]);

  const handleChange = async (e: CheckboxChangeEvent) => {
    const values = await form.validateFields();
    const newAttribute: TAttribute = {
      ...attribute,
      fgMandatory: values.fgMandatory,
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  return (
    <Form form={form}>
      <Form.Item name={'fgMandatory'} noStyle>
        <Checkbox
          disabled={!!attribute?.fgPrimaryKey}
          onChange={handleChange}
        />
      </Form.Item>
    </Form>
  );
};

export default AttributeMCheckbox;
