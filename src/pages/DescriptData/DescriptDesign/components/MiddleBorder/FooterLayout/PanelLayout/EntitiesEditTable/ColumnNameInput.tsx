import { FC, useEffect } from 'react';
import { Input, Space, Form } from 'antd';
import { PauseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  TAttribute,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import { actions } from '@/pages/DescriptData/DescriptDesign/store';
import { humpToUnderline } from '@/util/name-convent';
import { moduleName } from '@/pages/DescriptData/DescriptDesign/conf';
import { DOStatus } from '@/models/enums';

export type TAttributeNameInputProps = TAttribute & {
  value?: any;
  onChange?: any;
};

const ColumnNameInput: FC<TAttributeNameInputProps> = ({
  idAttribute,
  idEntity,
}) => {
  const [form] = Form.useForm<TAttributeNameInputProps>();
  const dispatch = useDispatch();

  const attribute = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].entityCollection.entities
      ?.find((entityFind) => entityFind.idEntity === idEntity)
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

  const handleChange = async () => {
    const values = await form.validateFields();
    const newAttribute: TAttribute = {
      ...attribute,
      columnName: values.columnName,
    };
    dispatch(actions.updateAttribute(newAttribute));
  };

  const handleClick = () => {
    const newAttribute: TAttribute = {
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
