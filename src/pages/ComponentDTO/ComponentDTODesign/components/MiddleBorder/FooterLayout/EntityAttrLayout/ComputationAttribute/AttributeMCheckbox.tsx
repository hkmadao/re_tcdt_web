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
import type { TDtoComputationAttribute } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';

export type TAttributeNameInputProps = TDtoComputationAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeMCheckbox: FC<TAttributeNameInputProps> = ({
  idDtoComputationAttribute: idDtoComputationAttribute,
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
      ?.dcAttributes?.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoComputationAttribute === idDtoComputationAttribute,
      );
  });

  useEffect(() => {
    if (attribute) {
      form.setFieldsValue(attribute);
    }
  }, [attribute]);

  const handleChange = async (e: CheckboxChangeEvent) => {
    const values = await form.validateFields();
    const newAttribute: TDtoComputationAttribute = {
      ...attribute,
      fgMandatory: values.fgMandatory,
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
  };

  return (
    <Form form={form}>
      <Form.Item name={'fgMandatory'} noStyle>
        <Checkbox onChange={handleChange} />
      </Form.Item>
    </Form>
  );
};

export default AttributeMCheckbox;
