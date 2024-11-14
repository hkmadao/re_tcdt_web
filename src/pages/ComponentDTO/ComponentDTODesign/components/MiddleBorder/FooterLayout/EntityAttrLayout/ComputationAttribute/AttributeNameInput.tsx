import { FC, useEffect } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  TDtoComputationAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { actions } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { underlineToHump } from '@/util/name-convent';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import { DOStatus } from '@/models/enums';

export type TAttributeNameInputProps = TDtoComputationAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeNameInput: FC<TAttributeNameInputProps> = ({
  idDtoComputationAttribute: idDtoComputationAttribute,
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

  const handleChange = async () => {
    const values = await form.validateFields();
    const newAttribute: TDtoComputationAttribute = {
      ...attribute,
      attributeName: values.attributeName,
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TDtoComputationAttribute = {
      ...attribute,
      attributeName: attribute?.columnName
        ? underlineToHump(attribute.columnName)
        : '',
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
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
