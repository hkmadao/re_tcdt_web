import { FC, useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, Checkbox, Space, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EPartName, TTree } from '@/models';
import { Observer, TMessage } from '@/util/observer';
import RefPicker from '@/components/Ref';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import { TCommonAttribute } from '../../../models';
import { getRefByAttr } from '@/util';
import { billformConf, subject } from '../../../conf';
import { actions, toEdit, save, reflesh } from './store';
import {
  useEditStatusInfo,
  useFormData,
  useIdUiConf,
  useFgDisabled,
} from './hooks';
const MainFormLayout: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const idUiConf = useIdUiConf();
  const fgDisabled = useFgDisabled();
  const moduleData = useFormData();
  const editStatus = useEditStatusInfo();

  useEffect(() => {
    if (editStatus) {
      form.resetFields();
      form.setFieldsValue(moduleData);
    }
  }, [editStatus]);

  useEffect(() => {
    if (!idUiConf) {
      return;
    }

    const cancleObserver: Observer = {
      topic: 'cancle',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(actions.cancle());
      },
    };
    subject.subscribe(cancleObserver);

    const toAddObserver: Observer = {
      topic: 'toAdd',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(
          actions.addFormData({ nodeData: message.data.treeSelectedNode }),
        );
      },
    };
    subject.subscribe(toAddObserver);

    const addObserver: Observer = {
      topic: 'add',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'add' }));
        })();
      },
    };
    subject.subscribe(addObserver);

    const addAgainObserver: Observer = {
      topic: 'addAgain',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'addAgain' }));
        })();
      },
    };
    subject.subscribe(addAgainObserver);

    const toEditObserver: Observer = {
      topic: 'toEdit',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(
            toEdit({
              nodeData: message.data.treeSelectedNode,
              selectedRow: message.data.selectedRow,
            }),
          );
        })();
      },
    };
    subject.subscribe(toEditObserver);

    const editObserver: Observer = {
      topic: 'edit',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          const data = await form.validateFields();
          dispatch(save({ actionType: 'edit' }));
        })();
      },
    };
    subject.subscribe(editObserver);

    const detailRefleshObserver: Observer = {
      topic: 'detailReflesh',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        (async () => {
          if (message.consumerIds.includes(idUiConf)) {
            return;
          }
          dispatch(reflesh());
        })();
      },
    };
    subject.subscribe(detailRefleshObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(cancleObserver);
      subject.unsubsribe(toAddObserver);
      subject.unsubsribe(addObserver);
      subject.unsubsribe(addAgainObserver);
      subject.unsubsribe(toEditObserver);
      subject.unsubsribe(editObserver);
      subject.unsubsribe(detailRefleshObserver);
    };
  }, [idUiConf]);

  const handleValuesChange = (changedValues: any, values: TCommonAttribute) => {
    const newValues = { ...values };
    if (!values.dataType) {
      newValues.idDataType = undefined;
    }
    if (changedValues.dataType) {
      newValues.idDataType = changedValues.dataType.idDataType;
    }
    if (!values.project) {
      newValues.idProject = undefined;
    }
    if (changedValues.project) {
      newValues.idProject = changedValues.project.idProject;
    }
    if (!values.refEntity) {
      newValues.idRefEntity = undefined;
    }
    if (changedValues.refEntity) {
      newValues.idRefEntity = changedValues.refEntity.idEntity;
    }
    dispatch(actions.updateFormData(newValues));
  };

  return (
    <>
      <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
        <Space direction="horizontal" size={2} wrap={true}>
          <Form.Item
            label={'属性id'}
            name={'idCommonAttribute'}
            style={{ padding: '5px 0px 5px 0px' }}
            hidden
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入属性id'}
            />
          </Form.Item>
          <Form.Item
            label={'属性名称'}
            name={'attributeName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入属性名称'}
            />
          </Form.Item>
          <Form.Item
            label={'显示名称'}
            name={'displayName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入显示名称'}
            />
          </Form.Item>
          <Form.Item
            label={'字段名称'}
            name={'columnName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入字段名称'}
            />
          </Form.Item>
          <Form.Item
            label={'数据类型'}
            name={'dataType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <RefPicker
              {...getRefByAttr(
                EPartName.Header,
                'commonAttribute',
                'idDataType',
                billformConf!,
              )!}
            />
          </Form.Item>
          <Form.Item
            label={'项目'}
            name={'project'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <RefPicker
              {...getRefByAttr(
                EPartName.Header,
                'commonAttribute',
                'idProject',
                billformConf!,
              )!}
            />
          </Form.Item>
          <Form.Item
            label={'数据长度'}
            name={'len'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入数据长度'} />
          </Form.Item>
          <Form.Item
            label={'精度'}
            name={'pcs'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入精度'} />
          </Form.Item>
          <Form.Item
            label={'是否必填'}
            name={'fgMandatory'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
          <Form.Item
            label={'序号'}
            name={'sn'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入序号'} />
          </Form.Item>
          <Form.Item
            label={'默认值'}
            name={'defaultValue'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入默认值'}
            />
          </Form.Item>
          <Form.Item
            label={'引用属性显示名称'}
            name={'refDisplayName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入引用属性显示名称'}
            />
          </Form.Item>
          <Form.Item
            label={'属性类别'}
            name={'category'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入属性类别'}
            />
          </Form.Item>
          <Form.Item
            label={'引用属性名称'}
            name={'refAttributeName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入引用属性名称'}
            />
          </Form.Item>
          <Form.Item
            label={'上级实体信息'}
            name={'refEntity'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <RefPicker
              {...getRefByAttr(
                EPartName.Header,
                'commonAttribute',
                'idRefEntity',
                billformConf!,
              )!}
            />
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default MainFormLayout;
