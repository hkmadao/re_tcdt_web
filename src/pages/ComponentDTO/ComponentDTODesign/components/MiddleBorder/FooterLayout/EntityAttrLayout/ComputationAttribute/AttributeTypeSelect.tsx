import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Space, Select, Form } from 'antd';
import { DOStatus, EDirection } from '@/models/enums';
import { useSelector, useDispatch } from 'react-redux';
import {
  TDtoComputationAttribute,
  TModuleStore,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import {
  actions,
  selectSysDataTypes,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';

export type TRefPickerProps = TDtoComputationAttribute & {
  value?: any;
  onChange?: any;
};

const AttributeTypePickerInput: FC<TRefPickerProps> = ({
  idDtoComputationAttribute: idDtoComputationAttribute,
}) => {
  const [form] = Form.useForm<TRefPickerProps>();
  const { Option } = Select;
  const [attributeTypeOptions, setAttributeTypeOptions] =
    useState<ReactNode[]>();
  const dispatch = useDispatch();
  const sysDataTypes = useSelector(selectSysDataTypes);
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

  useMemo(() => {
    const newOptions: ReactNode[] = [];
    sysDataTypes.forEach((dataType) => {
      newOptions.push(
        <Option key={dataType.idDataType} value={dataType.idDataType}>
          {dataType.displayName}
        </Option>,
      );
    });
    setAttributeTypeOptions(newOptions);
  }, []);

  const handleChange = async () => {
    const values = await form.validateFields();
    const findDataType = sysDataTypes.find(
      (dataType) => dataType.idDataType === values.idAttributeType,
    );
    if (!findDataType) {
      return;
    }
    const newAttribute: TDtoComputationAttribute = {
      ...attribute,
      idAttributeType: findDataType.idDataType,
      attributeTypeName: findDataType.displayName,
    };
    dispatch(actions.updateComputationAttribute(newAttribute));
  };

  return (
    <>
      <Space direction="horizontal" size={2}>
        <Form form={form}>
          <Form.Item name={'idAttributeType'} noStyle>
            <Select
              onChange={handleChange}
              placeholder={'请选择'}
              style={{ maxWidth: '150px' }}
            >
              {attributeTypeOptions}
            </Select>
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};

export default AttributeTypePickerInput;
