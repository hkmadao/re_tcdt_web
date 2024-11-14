import type { FC } from 'react';
import { useEffect } from 'react';
import { Form, message } from 'antd';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import TableColumn from './TableColumn';
import { nanoid } from '@reduxjs/toolkit';

import {
  EPartName,
  TBillFormField,
  TBillFormTab,
  EAttrTypes,
} from '@/pages/Factory/Units/Form/model';
import {
  TDescriptionInfo,
  EInputType,
  TEnumColumn,
} from '@/pages/Factory/Units/common/model';
import { actions } from '@/pages/Factory/Units/Form/store';
import { firstToLower } from '@/util/name-convent';
import { useFormBillformbs } from '@/pages/Factory/Units/Form/store/hooks';
import { ItemTypes } from '@/pages/Factory/Units/common/conf';
import styles from '@/pages/Factory/Units/Form/less/styles.less';
import { getRefBillFormB } from '../../../util';

export type TTableDropBoxProps = {
  partName: EPartName;
  billformT: TBillFormTab;
};

const TableDropBox: FC<TTableDropBoxProps> = ({ partName, billformT }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const billformbs = useFormBillformbs(partName, billformT.tabCode);

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.Tree],
      drop: (nodeData: TDescriptionInfo, monitor) => {
        let selectedNodeLocal: TDescriptionInfo[];
        if (nodeData.fgPartner) {
          const childrenData = nodeData.children?.filter(
            (child) =>
              child.attributeTypeCode !== 'InternalArray' &&
              child.attributeTypeCode !== 'InternalSingle',
          );
          selectedNodeLocal = childrenData || [];
        } else {
          selectedNodeLocal = [nodeData];
        }
        const newBillformBs: TBillFormField[] = [];
        selectedNodeLocal.forEach((selectedNode, index) => {
          const find = billformbs?.find((billformB) => {
            return billformB.name === selectedNode.attributeName;
          });
          if (find) {
            message.error(`控件[ ${selectedNode.attributeName} ]已存在`);
            return;
          }
          //引用属性
          if (selectedNode.attributeTypeCode && selectedNode.entityInfo) {
            if (
              selectedNode.attributeTypeCode === 'InternalRef' ||
              selectedNode.attributeTypeCode === 'InternalSingleRef'
            ) {
              const newBillformB = getRefBillFormB(selectedNode, index);
              newBillformB.fgDisplay = true;
              newBillformBs.push(newBillformB);
              return;
            }
          }
          //控件属性配置
          const newBillformB: TBillFormField = {
            idBillFormField: nanoid(),
            name: selectedNode.attributeName,
            displayName: selectedNode.displayName,
            fgMainProperty: !!selectedNode.fgPrimaryKey,
            showOrder: index,
            readonly: false,
            dataType: selectedNode.attributeTypeCode,
            inputType: selectedNode.webInputType || 'Input',
            fgDisplay: true,
          };
          if (selectedNode.enumInfo) {
            newBillformB.enumConfig = {
              idEnumRef: nanoid(),
              enumColumns: [],
              label: selectedNode.enumInfo.displayName,
              propertyName: firstToLower(selectedNode.enumInfo.className!),
              title: selectedNode.enumInfo.displayName,
            };
            selectedNode.enumInfo.attributes?.forEach((enumAttr) => {
              const enumAttrInfo: TEnumColumn = {
                idEnumColumn: nanoid(),
                code: enumAttr.code,
                displayName: enumAttr.displayName,
                enumValue: enumAttr.enumValue,
              };
              newBillformB.enumConfig?.enumColumns?.push(enumAttrInfo);
            });
            newBillformB.inputType = 'Select';
          }
          newBillformBs.push(newBillformB);
        });
        dispatch(
          actions.addBillFormFields({
            name: partName,
            tabCode: billformT.tabCode!,
            dtos: newBillformBs,
          }),
        );
        return { name: billformT.tabName, partName };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [billformbs],
  );
  useEffect(() => {}, []);

  const isActive = canDrop && isOver;
  let className:
    | 'dragboxtarget'
    | 'dragboxtargetActive'
    | 'dragboxtargetCanDrop' = 'dragboxtarget';
  if (isActive) {
    className = 'dragboxtargetActive';
  } else if (canDrop) {
    className = 'dragboxtargetCanDrop';
  }

  const panelClick = () => {
    dispatch(
      actions.setCurrent({
        attrType: EAttrTypes.Panel,
        name: partName,
        tabCode: billformT.tabCode,
        data: billformT,
      }),
    );
  };

  return (
    <div
      ref={drop}
      role={'DragBoxTarget'}
      className={styles[className]}
      onClick={panelClick}
    >
      <div
        style={{
          textAlign: 'left',
          border: '1px solid gray',
          width: '100%',
          height: '100px',
          // overflowX: 'auto',
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
        }}
      >
        <Form
          form={form}
          name={billformT.tabCode}
          layout={'vertical'}
          // labelCol={{ style: { padding: '10px 10px 10px 10px' } }}
          // wrapperCol={{ style: { padding: '10px 10px 10px 0px' ,width:'100px',height:'20px'} }}
          autoComplete="off"
        >
          <div
            style={{
              verticalAlign: 'middle',
            }}
          >
            {billformbs?.map((data, i) => {
              return (
                <TableColumn
                  key={i}
                  form={form}
                  partName={partName}
                  billformT={billformT}
                  billformB={data}
                />
              );
            })}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TableDropBox;
