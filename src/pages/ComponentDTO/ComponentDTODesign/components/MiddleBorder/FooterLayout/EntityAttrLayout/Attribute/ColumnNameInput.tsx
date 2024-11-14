import { FC, useEffect } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  TDtoEntityAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { humpToUnderline } from '@/util/name-convent';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { DOStatus } from '@/models/enums';

export type TAttributeNameInputProps = TDtoEntityAttribute & {
  value?: any;
  onChange?: any;
};

const ColumnNameInput: FC<TAttributeNameInputProps> = ({
  idDtoEntityAttribute: idDtoEntityAttribute,
}) => {
  const [form] = Form.useForm<TAttributeNameInputProps>();
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
      columnName: values.columnName,
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TDtoEntityAttribute = {
      ...attribute,
      columnName: attribute?.attributeName
        ? humpToUnderline(attribute.attributeName)
        : '',
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Form form={form}>
          <Form.Item name={'columnName'} noStyle>
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

export default ColumnNameInput;
