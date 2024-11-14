import { Checkbox, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { TModuleStore } from '@/pages/DescriptData/DescriptDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { DOStatus } from '@/models/enums';
import type { TAttribute } from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { FC, useCallback } from 'react';

export type TAttributeNameInputProps = TAttribute & {
  value?: any;
  onChange?: any;
};

const AttributePrimaryCheckbox: FC<TAttributeNameInputProps> = ({
  idAttribute,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<TAttributeNameInputProps>();

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

  // 设置P为 true 时，联动处理 M
  const handleChange = useCallback(async () => {
    const values = await form.validateFields();
    const newAttribute: TAttribute = {
      ...attribute,
      fgPrimaryKey: values.fgPrimaryKey,
    };
    dispatch(actions.updateAttribute(newAttribute));
  }, [attribute]);

  return (
    <Form form={form}>
      <Form.Item name={'fgPrimaryKey'} noStyle>
        <Checkbox onChange={handleChange} />
      </Form.Item>
    </Form>
  );
};

export default AttributePrimaryCheckbox;
