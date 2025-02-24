import type { FC, MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  DatePicker,
  TimePicker,
  message,
} from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import rightStyles from './edittable.less';
import moment from 'moment';
import { FormInstance } from '@ant-design/pro-form';
import { actions } from '@/pages/Factory/Units/Form/store';
import {
  EAttrTypes,
  EPartName,
  TBillFormField,
  TBillFormTab,
} from '@/pages/Factory/Units/Form/model';
import { EInputType } from '@/pages/Factory/Units/common/model';
import { ItemTypes } from '@/pages/Factory/Units/common/conf';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './styles.less';

export type TTableColumnProps = {
  form: FormInstance<any>;
  partName: EPartName;
  billformT: TBillFormTab;
  billformB: TBillFormField;
};

const TableColumn: FC<TTableColumnProps> = ({
  form,
  partName,
  billformT,
  billformB,
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(billformB.defaultValue);
  const inputRef = useRef<any>();
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

    form.setFields([{ name: billformB.name as string, value: newValue }]);

    setInputValue(billformB.defaultValue);
    propsRef.current = billformB;
  }, [billformB]);

  useEffect(() => {
    boxContent();
  }, [editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current ? inputRef.current.focus() : '';
    }
  }, [childNode]);

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

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const editingBoxContent = (): JSX.Element => {
    let childNodeTemp = (
      <Form.Item
        className={rightStyles['form-item']}
        colon={true}
        name={billformB.name}
      >
        <Input
          ref={inputRef}
          className={rightStyles['table-td-input']}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    );
    switch (billformB.dataType) {
      case 'Input':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <Input
              className={rightStyles['table-td-input']}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'Text':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <Input
              type="Text"
              ref={inputRef}
              className={rightStyles['table-td-input']}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'InputNumber':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <InputNumber
              ref={inputRef}
              className={rightStyles['table-td-input']}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'Checkbox':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
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
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <DatePicker
              ref={inputRef}
              className={rightStyles['table-td-input']}
              format="YYYY-MM-DD"
              onChange={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'Time':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <TimePicker
              ref={inputRef}
              className={rightStyles['table-td-input']}
              format="HH:mm:ss"
              onChange={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'DateTime':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <DatePicker
              ref={inputRef}
              className={rightStyles['table-td-input']}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={true}
              onChange={save}
              onBlur={save}
            />
          </Form.Item>
        );
        break;
      case 'Image':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
            initialValue={billformB.defaultValue}
          >
            <div
              className={rightStyles['editable-cell-value-wrap']}
              onClick={toggleEdit}
            >
              {inputValue}
            </div>
          </Form.Item>
        );
        break;
      default:
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
          >
            <Input
              ref={inputRef}
              className={rightStyles['table-td-input']}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        );
    }
    return childNodeTemp;
  };

  const textBoxContent = (): JSX.Element => {
    let childNodeTemp = (
      <div
        className={rightStyles['editable-cell-value-wrap']}
        onClick={toggleEdit}
      >
        {inputValue}
      </div>
    );
    switch (billformB.dataType) {
      case 'Input':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'Text':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'InputNumber':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'Checkbox':
        childNodeTemp = (
          <Form.Item
            className={rightStyles['form-item']}
            colon={true}
            name={billformB.name}
            valuePropName="checked"
            initialValue={billformB.defaultValue}
          >
            <Checkbox ref={inputRef} onChange={save}></Checkbox>
          </Form.Item>
        );
        break;
      case 'Date':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'Time':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'DateTime':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      case 'Image':
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
        break;
      default:
        childNodeTemp = (
          <div
            className={rightStyles['editable-cell-value-wrap']}
            onClick={toggleEdit}
          >
            {inputValue}
          </div>
        );
    }
    return childNodeTemp;
  };

  const boxContent = () => {
    if (editing) {
      setChildNode(editingBoxContent());
    } else {
      setChildNode(textBoxContent());
    }
  };

  // 保存
  const save = async () => {
    try {
      const values = await form.validateFields();
      const billFormBNew: TBillFormField = { ...billformB };
      let newValue;
      switch (billformB.dataType) {
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
      setInputValue(billFormBNew.defaultValue);
      toggleEdit();
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
        tabCode: billformT.tabCode,
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
    <div
      ref={ref}
      data-handler-id={handlerId}
      onClick={fieldClick}
      onKeyUp={fieldKeyUp}
      tabIndex={-1}
      className={rightStyles['bdb-content']}
    >
      <div className={styles['component']}>
        <div>
          <div className={rightStyles['table-th']}>{billformB.displayName}</div>
          <div className={rightStyles['editable-row']}>{childNode}</div>
        </div>
        <div className={styles['component-delete']} onClick={handleDelete}>
          <DeleteOutlined className={styles['component-delete-icon']} />
        </div>
      </div>
    </div>
  );
};

export default TableColumn;
