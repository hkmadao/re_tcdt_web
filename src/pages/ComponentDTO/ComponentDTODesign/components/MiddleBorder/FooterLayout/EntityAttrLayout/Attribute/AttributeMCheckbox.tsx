import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Form } from 'antd';
import type { TModuleStore } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { DOStatus } from '@/models/enums';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TDtoEntityAttribute } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';

export type TAttributeNameInputProps = TDtoEntityAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeMCheckbox: FC<TAttributeNameInputProps> = ({
  idDtoEntityAttribute: idDtoEntityAttribute,
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
    return state[moduleName].dtoCollection.dtoEntities
      ?.find((entityFind) => entityFind.idDtoEntity === idElement)
      ?.deAttributes?.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoEntityAttribute === idDtoEntityAttribute,
      );
  });

  useEffect(() => {
    if (attribute) {
      form.setFieldsValue(attribute);
    }
  }, [attribute]);

  const handleChange = async (e: CheckboxChangeEvent) => {
    const values = await form.validateFields();
    const newAttribute: TDtoEntityAttribute = {
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
