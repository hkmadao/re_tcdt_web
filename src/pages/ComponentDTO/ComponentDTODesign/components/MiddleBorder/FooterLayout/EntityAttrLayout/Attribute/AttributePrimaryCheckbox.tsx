import { Checkbox, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { TModuleStore } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { DOStatus } from '@/models/enums';
import type { TDtoEntityAttribute } from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { FC, useCallback } from 'react';

export type TAttributeNameInputProps = TDtoEntityAttribute & {
  value?: any;
  onChange?: any;
};

const AttributePrimaryCheckbox: FC<TAttributeNameInputProps> = ({
  idDtoEntityAttribute: idDtoEntityAttribute,
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
    return state[moduleName].dtoCollection.dtoEntities
      ?.find((entityFind) => entityFind.idDtoEntity === idElement)
      ?.deAttributes?.find(
        (entityAttr) =>
          entityAttr.action !== DOStatus.DELETED &&
          entityAttr.idDtoEntityAttribute === idDtoEntityAttribute,
      );
  });

  // 设置P为 true 时，联动处理 M
  const handleChange = useCallback(async () => {
    const values = await form.validateFields();
    const newAttribute: TDtoEntityAttribute = {
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
