import type { FC, MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  DatePicker,
  TimePicker,
  Upload,
  Select,
  message,
  Space,
} from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FormInstance } from '@ant-design/pro-form';
import { ItemTypes } from '../../../common/conf';
import { actions } from '../../store';
import { TBillSearchRef } from '@/pages/Factory/Units/common/model';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './styles.less';

export type TFormItemProps = {
  form: FormInstance<any>;
  billSearchRef: TBillSearchRef;
};

const FormItem: FC<TFormItemProps> = ({ form, billSearchRef }) => {
  const inputRef = useRef<any>(null);
  const [childNode, setChildNode] = useState(<Input />);
  const ref = useRef<HTMLDivElement>(null);
  const propsRef = useRef<TBillSearchRef>();
  const dispatch = useDispatch();

  useEffect(() => {
    boxContent();
    let newValue;
    switch (billSearchRef.htmlInputType) {
      case 'Date':
        newValue = billSearchRef.defaultValue
          ? moment(billSearchRef.defaultValue, 'YYYY-MM-DD')
          : null;
        break;
      case 'Time':
        newValue = billSearchRef.defaultValue
          ? moment(billSearchRef.defaultValue, 'HH:mm:ss')
          : null;
        break;
      case 'DateTime':
        newValue = billSearchRef.defaultValue
          ? moment(billSearchRef.defaultValue, 'YYYY-MM-DD HH:mm:ss')
          : null;
        break;
      case 'Checkbox':
        newValue = !!billSearchRef.defaultValue;
        break;
      default:
        newValue = billSearchRef.defaultValue;
    }

    form.setFields([{ name: billSearchRef.attributeName!, value: newValue }]);
    propsRef.current = billSearchRef;
  }, [billSearchRef]);

  useEffect(() => {
    drag(drop(ref));
  }, []);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (dragItemRef: MutableRefObject<TBillSearchRef>) => {
      if (!ref.current) {
        return { name: billSearchRef.label };
      }
      let dragItem = dragItemRef.current;
      if (dragItem.idBillSearchRef === billSearchRef.idBillSearchRef) {
        return { name: billSearchRef.label };
      }
      dispatch(
        actions.switchConditionOrder({
          drag: dragItem,
          hover: billSearchRef,
        }),
      );

      return billSearchRef;
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover() {},
  });

  const [, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: propsRef, //此处存在闭包捕获问题，需要传递引用
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<TBillSearchRef>();
      if (item && dropResult) {
        // console.log(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const boxContent = () => {
    let childNodeTemp = (
      <Form.Item
        style={{
          margin: 0,
        }}
        label={billSearchRef.label}
        name={billSearchRef.attributeName}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    );

    switch (billSearchRef.htmlInputType) {
      case 'Ref':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <Input
              readOnly
              placeholder={'请选择'}
              suffix={
                <Space direction="horizontal" size={5}>
                  <SearchOutlined />
                </Space>
              }
            />
          </Form.Item>
        );
        break;
      case 'Input':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
        break;
      case 'Select':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <Select
              style={{ minWidth: '100px' }}
              value={billSearchRef.defaultValue}
              placeholder={'请选择'}
            >
              {billSearchRef.enumConfig?.enumColumns?.map((ve) => (
                <Select.Option key={ve.idEnumColumn} value={ve.enumValue}>
                  {ve.displayName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
        break;
      case 'Text':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <Input
              type="Text"
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'InputNumber':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
        break;
      case 'Checkbox':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
            valuePropName="checked"
          >
            <Checkbox ref={inputRef} onChange={save}></Checkbox>
          </Form.Item>
        );
        break;
      case 'Date':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <DatePicker ref={inputRef} format="YYYY-MM-DD" onChange={save} />
          </Form.Item>
        );
        break;
      case 'Time':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <TimePicker ref={inputRef} format="HH:mm:ss" onChange={save} />
          </Form.Item>
        );
        break;
      case 'DateTime':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <DatePicker
              ref={inputRef}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={true}
              onChange={save}
            />
          </Form.Item>
        );
        break;
      case 'Image':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
            initialValue={billSearchRef.defaultValue}
          >
            <Upload listType="picture-card" className="avatar-uploader">
              Upload
            </Upload>
          </Form.Item>
        );
        break;
      default:
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billSearchRef.label}
            name={billSearchRef.attributeName}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
    }
    setChildNode(childNodeTemp);
  };

  // 保存
  const save = async () => {
    try {
      const values = await form.validateFields();

      const billFormBNew: TBillSearchRef = { ...billSearchRef };

      let newValue;
      switch (billSearchRef.htmlInputType) {
        case 'Date':
          newValue = values[billSearchRef.attributeName!].format('YYYY-MM-DD');
          break;
        case 'Time':
          newValue = values[billSearchRef.attributeName!].format('HH:mm:ss');
          break;
        case 'DateTime':
          newValue = values[billSearchRef.attributeName!].format(
            'YYYY-MM-DD HH:mm:ss',
          );
          break;
        default:
          newValue = values[billSearchRef.attributeName!];
      }
      billFormBNew.defaultValue = newValue;
      dispatch(actions.updateCondition(billFormBNew));
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Save failed:', errInfo);
    }
  };

  // 删除
  const handleDelete = () => {
    dispatch(actions.deleteCondition(billSearchRef));
    message.warning('删除[' + billSearchRef.label + ']控件！');
  };

  /**点击字段 */
  const fieldClick = (e: any) => {
    e.stopPropagation();
    dispatch(
      actions.setCurrent({
        type: 'field',
        id: billSearchRef.idBillSearchRef,
      }),
    );
  };

  /**字段键盘事件 */
  const fieldKeyUp = (e: any) => {
    e.stopPropagation();
    const ke = e as KeyboardEvent;
    if (ke.code === 'Delete') {
      dispatch(actions.deleteCondition(billSearchRef));
      message.warning('删除[' + billSearchRef.label + ']控件！');
    }
  };

  return (
    <>
      <span
        ref={ref}
        data-handler-id={handlerId}
        onClick={fieldClick}
        onKeyUp={fieldKeyUp}
      >
        <div className={styles['component']}>
          {childNode}
          <div className={styles['component-delete']} onClick={handleDelete}>
            <DeleteOutlined className={styles['component-delete-icon']} />
          </div>
        </div>
      </span>
    </>
  );
};

export default FormItem;
