import { nanoid } from '@reduxjs/toolkit';
import {
  EInputType,
  TBillRef,
  TBillRefColumn,
  TDescriptionInfo,
} from '../../common/model';
import { TBillFormField } from '../model';
import { firstToLower } from '@/util';

/**获取带参照配置的控件 */
export function getRefBillFormB(treeData: TDescriptionInfo, index: number) {
  const newBillformB: TBillFormField = {
    idBillFormField: treeData.id,
    name: treeData.innerInfo?.attributeName,
    dataType: treeData.attributeTypeCode,
    displayName: treeData.displayName,
    fgMainProperty: !!treeData.fgPrimaryKey,
    showOrder: index,
    refAttributeName: treeData.attributeName,
    readonly: false,
  };
  //拾取器初始化配置
  let refConfig: TBillRef | undefined = undefined;
  if (treeData.entityInfo) {
    newBillformB.inputType = 'Ref';
    const refColumns: TBillRefColumn[] = [];
    treeData.entityInfo?.attributes?.forEach((attr) => {
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
    const pkAttr = treeData.entityInfo?.attributes?.find(
      (attr) => attr.fgPrimaryKey,
    );
    const firstAttr = treeData.entityInfo?.attributes?.find(
      (attr) => attr.sn === 2,
    );
    refConfig = {
      idBillRef: nanoid(),
      refStyle: 'table',
      backWriteProp: pkAttr ? pkAttr.attributeName! : treeData.attributeName!,
      displayProp: firstAttr ? firstAttr.attributeName! : 'displayName',
      title: treeData.entityInfo?.displayName!,
      tableRef: {
        dataUri:
          '/' + firstToLower(treeData.entityInfo?.className!) + '/aqPage',
        fgPage: true,
        tableMainProp: pkAttr ? pkAttr.attributeName! : treeData.attributeName!,
        refColumns,
        idComponentEntity: treeData.entityInfo?.idCompEntity,
        ceDisplayName: treeData.entityInfo?.displayName,
      },
    };
  }
  newBillformB.refConfig = refConfig;
  return newBillformB;
}
