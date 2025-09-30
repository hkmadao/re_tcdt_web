import React, { FC } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'antd';
import { ItemTypes } from '../../../common/conf';
import FormItem from './FormItem';
import { actions } from '../../store';
import {
  TBillRef,
  TBillRefColumn,
  TBillSearchRef,
  TEnumColumn,
  TDescriptionInfo,
  TEnumRef,
} from '@/pages/Factory/Units/common/model';
import { nanoid } from '@reduxjs/toolkit';
import { firstToLower } from '@/util/name-convent';
import { useSearchRefs } from '../../hooks';

const DropBody: FC = () => {
  const searchRefs = useSearchRefs();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [{ canDrop, isOverCurrent, isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.Tree],
      drop: (nodeData: TDescriptionInfo, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }

        const billSearchRef: TBillSearchRef = {
          idBillSearchRef: '',
          operatorCode: nodeData.webInputType === 'Input' ? 'like' : 'equal',
          /**搜索框label */
          label: nodeData.displayName,
          /**输入框属性名称 */
          attributeName: nodeData.attributeName,
          /**搜索框属性 */
          searchAttributes: nodeData.attributeName
            ? [nodeData.attributeName]
            : [],
          /**搜索框类型 */
          htmlInputType: nodeData.webInputType,
          valueType: 'String',
          defaultValue: '',
          /**搜索框枚举值类型，valueType为select时有效 */
          enumConfig: undefined,
          refConfig: undefined,
          showOrder: 0,
        };

        //引用属性
        if (nodeData.attributeTypeCode && nodeData.entityInfo) {
          if (
            nodeData.attributeTypeCode === 'InternalRef' ||
            nodeData.attributeTypeCode === 'InternalSingleRef'
          ) {
            //拾取器初始化配置
            let refConfig: TBillRef | undefined = undefined;
            if (nodeData.entityInfo) {
              billSearchRef.htmlInputType = 'Ref';
              const refColumns: TBillRefColumn[] = [];
              nodeData.entityInfo?.attributes?.forEach((attr) => {
                //主属性不添加
                if (attr.fgPrimaryKey) {
                  // newBillformB.name = attr.attributeName;
                  return;
                }
                //添加两个属性
                if (refColumns.length > 1) {
                  return;
                }
                const refColumn: TBillRefColumn = {
                  idBillRefColumn: nanoid(),
                  name: attr.attributeName!,
                  displayName: attr.displayName!,
                  dataType: attr.dataType!,
                };
                refColumns.push(refColumn);
              });
              const pkAttr = nodeData.entityInfo?.attributes?.find(
                (attr) => attr.fgPrimaryKey,
              );
              const firstAttr = nodeData.entityInfo?.attributes?.find(
                (attr) => attr.sn === 2,
              );
              refConfig = {
                idBillRef: nanoid(),
                refStyle: 'table',
                backWriteProp: pkAttr
                  ? pkAttr.attributeName!
                  : nodeData.attributeName!,
                displayProp: firstAttr
                  ? firstAttr.attributeName!
                  : 'displayName',
                title: nodeData.entityInfo?.displayName!,
                tableRef: {
                  tableMainProp: pkAttr
                    ? pkAttr.attributeName!
                    : nodeData.attributeName!,
                  fgPage: true,
                  dataUri:
                    '/' +
                    firstToLower(nodeData.entityInfo?.className!) +
                    '/aqPage',
                  refColumns,
                  idComponentEntity: nodeData.entityInfo?.idCompEntity,
                  ceDisplayName: nodeData.entityInfo?.displayName,
                },
              };
              billSearchRef.refConfig = refConfig;
              billSearchRef.refAttributeName = nodeData.attributeName;
              billSearchRef.attributeName = nodeData.innerInfo?.attributeName;
            }

            dispatch(actions.addCondition(billSearchRef));
            return;
          }
        }

        if (nodeData.enumInfo) {
          const enumInfo: TEnumRef = {
            idEnumRef: nanoid(),
            enumColumns: [],
          };
          nodeData.enumInfo.attributes?.forEach((enumAttr) => {
            const enumAttrInfo: TEnumColumn = {
              idEnumColumn: nanoid(),
              displayName: enumAttr.displayName!,
              enumValue: enumAttr.enumValue!,
              code: enumAttr.code,
            };
            enumInfo.enumColumns?.push(enumAttrInfo);
          });
          billSearchRef.htmlInputType = 'Select';
          billSearchRef.enumConfig = enumInfo;
        }

        if (nodeData.webInputType === 'Checkbox') {
          const enumInfo: TEnumRef = {
            idEnumRef: nanoid(),
            enumColumns: [],
          };
          const allEnumAttrInfo: TEnumColumn = {
            idEnumColumn: nanoid(),
            displayName: '全部',
            enumValue: 'all',
            code: 'all',
          };
          enumInfo.enumColumns?.push(allEnumAttrInfo);
          const yesEnumAttrInfo: TEnumColumn = {
            idEnumColumn: nanoid(),
            displayName: '是',
            enumValue: 'true',
            code: 'true',
          };
          enumInfo.enumColumns?.push(yesEnumAttrInfo);
          const noEnumAttrInfo: TEnumColumn = {
            idEnumColumn: nanoid(),
            displayName: '否',
            enumValue: 'false',
            code: 'false',
          };
          enumInfo.enumColumns?.push(noEnumAttrInfo);
          billSearchRef.valueType = 'Bool';
          billSearchRef.defaultValue = 'all';
          billSearchRef.htmlInputType = 'Select';
          billSearchRef.enumConfig = enumInfo;
        }

        dispatch(actions.addCondition(billSearchRef));
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  );

  const handleClick = (e: any) => {
    e.stopPropagation();
  };

  const handleDelete = (e: any) => {};

  let backgroundColor = 'white';

  if (isOverCurrent) {
    backgroundColor = 'darkgreen';
  }
  return (
    <div
      ref={drop}
      onClick={handleClick}
      style={{
        flex: 'auto',
        backgroundColor,
      }}
    >
      <Form
        form={form}
        name={'form'}
        layout={'inline'}
        labelCol={{ style: { padding: '10px 10px 10px 10px' } }}
        wrapperCol={{ style: { padding: '10px 10px 10px 0px' } }}
        autoComplete="off"
        style={{
          border:
            searchRefs && searchRefs.length > 0
              ? '1px dashed black'
              : undefined,
        }}
      >
        {searchRefs?.map((data, i) => {
          return (
            <FormItem
              key={data.idBillSearchRef}
              form={form}
              billSearchRef={data}
            />
          );
        })}
        {searchRefs && searchRefs.length > 0 ? (
          <>
            <Form.Item
              style={{
                margin: 0,
              }}
              label={''}
            >
              <Button>重置</Button>
            </Form.Item>
            <Form.Item
              style={{
                margin: 0,
              }}
              label={''}
            >
              <Button>搜索</Button>
            </Form.Item>
          </>
        ) : undefined}
      </Form>
    </div>
  );
};

export default DropBody;
