import { FC, useEffect } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { DOStatus } from '@/models/enums';
import {
  TComputationAttribute,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import { actions } from '@/pages/ComponentData/ComponentDesign/store';

export type TExtAttributeNameInputProps = TComputationAttribute & {
  value?: any;
  onChange?: any;
};

const NoteInput: FC<TExtAttributeNameInputProps> = ({
  idComputationAttribute,
}) => {
  const [form] = Form.useForm<TExtAttributeNameInputProps>();
  const dispatch = useDispatch();

  const computationAttribute = useSelector(
    (state: { [x: string]: TModuleStore }) => {
      if (
        state[moduleName].currentSelect.concreteType !==
        EnumConcreteDiagramType.ENTITY
      ) {
        return;
      }
      const idElement = state[moduleName].currentSelect.idElement;
      return state[moduleName].component.componentEntities
        ?.find((entityFind) => entityFind.idComponentEntity === idElement)
        ?.computationAttributes?.find(
          (entityAttr) =>
            entityAttr.action !== DOStatus.DELETED &&
            entityAttr.idComputationAttribute === idComputationAttribute,
        );
    },
  );

  useEffect(() => {
    if (computationAttribute) {
      form.setFieldsValue(computationAttribute);
    }
  }, [computationAttribute]);

  const handleChange = async () => {
    const values = await form.validateFields();
    const newAttribute: TComputationAttribute = {
      ...computationAttribute,
      idComputationAttribute: idComputationAttribute,
      note: values.note,
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TComputationAttribute = {
      ...computationAttribute,
      idComputationAttribute: idComputationAttribute,
      note: computationAttribute?.displayName,
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
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

export default NoteInput;
