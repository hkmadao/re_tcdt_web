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
import { TUser } from '../../../models';
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

  const handleValuesChange = (changedValues: any, values: TUser) => {
    const newValues = { ...values };
    dispatch(actions.updateFormData(newValues));
  };

  return (
    <>
      <Form form={form} layout={'inline'} onValuesChange={handleValuesChange}>
        <Space direction="horizontal" size={2} wrap={true}>
          <Form.Item
            label={'系统用户id'}
            name={'idUser'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled || true}
              allowClear
              placeholder={'请输入系统用户id'}
            />
          </Form.Item>
          <Form.Item
            label={'登录账号 '}
            name={'account'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入登录账号 '}
            />
          </Form.Item>
          <Form.Item
            label={'用户密码 '}
            name={'userPwd'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入用户密码 '}
            />
          </Form.Item>
          <Form.Item
            label={'手机号码'}
            name={'phone'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入手机号码'}
            />
          </Form.Item>
          <Form.Item
            label={'邮箱'}
            name={'email'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入邮箱'}
            />
          </Form.Item>
          <Form.Item
            label={'姓名 '}
            name={'name'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入姓名 '}
            />
          </Form.Item>
          <Form.Item
            label={'昵称'}
            name={'nickName'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Input
              readOnly={fgDisabled}
              allowClear
              placeholder={'请输入昵称'}
            />
          </Form.Item>
          <Form.Item
            label={'性别'}
            name={'gender'}
            style={{ padding: '5px 0px 5px 0px' }}
          >
            <Select placeholder={'请选择'} disabled={fgDisabled}>
              <Select.Option value={'female'}>女</Select.Option>
              <Select.Option value={'unknown'}>未知</Select.Option>
              <Select.Option value={'male'}>男</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={'启用标志'}
            name={'fgActive'}
            style={{ padding: '5px 0px 5px 0px' }}
            valuePropName="checked"
          >
            <Checkbox disabled={fgDisabled} />
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default MainFormLayout;
