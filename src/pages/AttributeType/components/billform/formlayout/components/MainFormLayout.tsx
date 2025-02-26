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
import { TDataType } from '../../../../models';
import { getRefByAttr } from '@/util';
import { billformConf, subject } from '../../../../conf';
import { actions, toEdit, save, reflesh } from '../store';
import {
  useEditStatusInfo,
  useFormData,
  useIdUiConf,
  useFgDisabled,
} from '../hooks';
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
      topic: 'cancel',
      consumerId: idUiConf,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idUiConf)) {
          return;
        }
        dispatch(actions.cancel());
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

  const handleValuesChange = (changedValues: any, values: TDataType) => {
    const newValues = { ...values };
    if (!newValues.project) {
      newValues.idProject = undefined;
    } else {
      newValues.idProject = newValues.project.idProject;
    }
    dispatch(actions.updateFormData(newValues));
  };

  return (
    <>
      <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
        <Space direction="horizontal" size={2} wrap={true}>
          <Form.Item
            label={'数据类型id'}
            name={'idDataType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled || true}
              allowClear
              placeholder={'请输入数据类型id'}
            />
          </Form.Item>
          <Form.Item
            label={'数据类型编码'}
            name={'code'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入数据类型编码'}
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
            label={'备注'}
            name={'note'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入备注'}
            />
          </Form.Item>
          <Form.Item
            label={'序列号'}
            name={'sn'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入序列号'} />
          </Form.Item>
          <Form.Item
            label={'长度'}
            name={'len'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入长度'} />
          </Form.Item>
          <Form.Item
            label={'精度'}
            name={'pcs'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <InputNumber readOnly={fgDisabled} placeholder={'请输入精度'} />
          </Form.Item>
          <Form.Item
            label={'字段类型'}
            name={'columnType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入字段类型'}
            />
          </Form.Item>
          <Form.Item
            label={'对象类型名称'}
            name={'objectType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入对象类型名称'}
            />
          </Form.Item>
          <Form.Item
            label={'对象类型包名'}
            name={'objectTypePackage'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入对象类型包名'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性1'}
            name={'ext1'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性1'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性2'}
            name={'ext2'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性2'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性3'}
            name={'ext3'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性3'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性4'}
            name={'ext4'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性4'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性5'}
            name={'ext5'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性5'}
            />
          </Form.Item>
          <Form.Item
            label={'扩展属性6'}
            name={'ext6'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入扩展属性6'}
            />
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
            label={'必填标志'}
            name={'fgMandatory'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
          <Form.Item
            label={'TypeScript类型'}
            name={'typeScriptType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入TypeScript类型'}
            />
          </Form.Item>
          <Form.Item
            label={'HTML5输入框类型'}
            name={'webInputType'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入HTML5输入框类型'}
            />
          </Form.Item>
          <Form.Item
            label={'系统预置数据标识'}
            name={'fgPreset'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
          <Form.Item
            label={'项目'}
            name={'project'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <RefPicker
              {...getRefByAttr(
                EPartName.Header,
                'dataType',
                'idProject',
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
