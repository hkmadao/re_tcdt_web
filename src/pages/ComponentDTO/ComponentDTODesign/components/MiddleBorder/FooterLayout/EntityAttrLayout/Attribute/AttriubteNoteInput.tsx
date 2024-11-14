import { FC, useEffect } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  TDtoEntityAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { DOStatus } from '@/models/enums';

export type TAttriubteNoteInputProps = TDtoEntityAttribute & {
  value?: any;
  onChange?: any;
};

const AttriubteNoteInput: FC<TAttriubteNoteInputProps> = ({
  idDtoEntityAttribute: idDtoEntityAttribute,
}) => {
  const [form] = Form.useForm<TAttriubteNoteInputProps>();
  const dispatch = useDispatch();

  const attribute = useSelector((state: { [x: string]: TModuleStore }) => {
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

  const handleChange = async () => {
    const values = await form.validateFields();
    const newAttribute: TDtoEntityAttribute = {
      ...attribute,
      note: values.note,
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TDtoEntityAttribute = {
      ...attribute,
      note: attribute?.displayName,
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Form form={form}>
          <Form.Item name={'note'} noStyle>
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

export default AttriubteNoteInput;
