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
  message,
} from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FormInstance } from '@ant-design/pro-form';
import {
  EAttrTypes,
  EPartName,
  TBillFormField,
  TBillFormTab,
} from '@/pages/Factory/Units/Form/model';
import { actions } from '@/pages/Factory/Units/Form/store';
import { EInputType } from '@/pages/Factory/Units/common/model';
import { ItemTypes } from '@/pages/Factory/Units/common/conf';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { useTableBillFormField } from '../../../hooks';

export type TFormItemProps = {
  form: FormInstance<any>;
  partName: EPartName;
  billformT: TBillFormTab;
  billformB: TBillFormField;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}
const FormItem: FC<TFormItemProps> = ({
  form,
  partName,
  billformT,
  billformB,
}) => {
  const billFormField = useTableBillFormField();
  const inputRef = useRef<any>(null);
  const [childNode, setChildNode] = useState(<Input />);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const propsRef = useRef<TBillFormField>();

  useEffect(() => {
    boxContent();
    let newValue;
    switch (billformB.dataType) {
      case 'Date':
        newValue = billformB.defaultValue
          ? moment(billformB.defaultValue, 'YYYY-MM-DD')
          : null;
        break;
      case 'Time':
        newValue = billformB.defaultValue
          ? moment(billformB.defaultValue, 'HH:mm:ss')
          : null;
        break;
      case 'DateTime':
        newValue = billformB.defaultValue
          ? moment(billformB.defaultValue, 'YYYY-MM-DD HH:mm:ss')
          : null;
        break;
      case 'Checkbox':
        newValue = !!billformB.defaultValue;
        break;
      default:
        newValue = billformB.defaultValue;
    }

    form.setFields([{ name: billformB.name!, value: newValue }]);
    propsRef.current = billformB;
  }, [billformB]);

  useEffect(() => {
    drag(drop(ref));
  }, []);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (dragItemRef: MutableRefObject<TBillFormField>) => {
      if (!ref.current) {
        return { name: billformB.displayName };
      }
      let dragItem = dragItemRef.current;
      if (dragItem.idBillFormField === billformB.idBillFormField) {
        return { name: billformB.displayName };
      }

      dispatch(
        actions.switchOrderTableBillFormFields({
          name: partName,
          tabCode: billformT.tabCode!,
          drag: dragItem,
          hover: billformB,
        }),
      );

      return billformB;
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
      const dropResult = monitor.getDropResult<TBillFormField>();
      if (item && dropResult) {
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
        label={billformB.displayName}
        name={billformB.name}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    );

    switch (billformB.dataType) {
      case 'Input':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billformB.displayName}
            name={billformB.name}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
        break;
      case 'Text':
        childNodeTemp = (
          <Form.Item
            style={{
              margin: 0,
            }}
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
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
            label={billformB.displayName}
            name={billformB.name}
            initialValue={billformB.defaultValue}
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
            label={billformB.displayName}
            name={billformB.name}
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

      const billFormBNew: TBillFormField = { ...billformB };

      let newValue;
      switch (billformB.inputType) {
        case 'Date':
          newValue = values[billformB.name!].format('YYYY-MM-DD');
          break;
        case 'Time':
          newValue = values[billformB.name!].format('HH:mm:ss');
          break;
        case 'DateTime':
          newValue = values[billformB.name!].format('YYYY-MM-DD HH:mm:ss');
          break;
        default:
          newValue = values[billformB.name!];
      }
      billFormBNew.defaultValue = newValue;
      dispatch(
        actions.updateTableBillFormField({
          name: partName,
          tabCode: billformT.tabCode!,
          dto: billFormBNew,
        }),
      );
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.error('Save failed:', errInfo);
    }
  };

  // 删除
  const handleDelete = () => {
    dispatch(
      actions.deleteTableBillFormField({
        name: partName,
        tabCode: billformT.tabCode!,
        dto: billformB,
      }),
    );
    message.warning('删除[' + billformB.displayName + ']控件！');
  };

  /**点击字段 */
  const fieldClick = (e: any) => {
    e.stopPropagation();
    dispatch(
      actions.setCurrent({
        attrType: EAttrTypes.Field,
        name: partName,
        tabCode: billformT.tabCode!,
        data: billformB,
      }),
    );
  };

  /**字段键盘事件 */
  const fieldKeyUp = (e: any) => {
    e.stopPropagation();
    const ke = e as KeyboardEvent;
    if (ke.code === 'Delete') {
      dispatch(
        actions.deleteTableBillFormField({
          name: partName,
          tabCode: billformT.tabCode!,
          dto: billformB,
        }),
      );
      message.warning('删除[' + billformB.displayName + ']控件！');
    }
  };

  return (
    <span
      ref={ref}
      style={{
        border:
          billFormField?.idBillFormField === billformB.idBillFormField
            ? '1px solid #1890ff'
            : undefined,
      }}
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
  );
};

export default FormItem;
