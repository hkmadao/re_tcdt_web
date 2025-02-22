import { firstToLower, firstToUpper } from '@/util/name-convent';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import {
  TBillFormConfigForm,
  TBillFormField,
  TBillFormTab,
  TModuleStore,
  TTableBillFormTab,
  TTip,
  TBillFormContent,
  TTableBillFormConfigList,
} from '../model';
import { initialState } from './initial-state';
import {
  EInputType,
  TBillSearchRef,
  TBillTreeRef,
  TEnumColumn,
} from '@/pages/Factory/Units/common/model';
import {
  getBillFormUriConf,
  getRefBillFormB,
  getTableBillFormUriConf,
} from '../util';

/**重置默认信息 */
export const reset: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.data = initialState.data;
};

/**设置Tip信息 */
export const setTip: CaseReducer<TModuleStore, PayloadAction<TTip>> = (
  state,
  action,
) => {
  state.tip = action.payload;
};

/**设置是否表单 */
export const setFgForm: CaseReducer<TModuleStore, PayloadAction<boolean>> = (
  state,
  action,
) => {
  state.fgForm = action.payload;
  state.current = undefined;
};

/**设置左树信息 */
export const setTreeRef: CaseReducer<
  TModuleStore,
  PayloadAction<TBillTreeRef>
> = (state, action) => {
  state.data.treeRef = action.payload;
};

/**设置搜索控件 */
export const setSearchRefs: CaseReducer<
  TModuleStore,
  PayloadAction<TBillSearchRef[]>
> = (state, action) => {
  state.data.searchRefs = action.payload;
};

/**同步表单数据到表格配置 */
export const syncFromForm: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  const configForm: TBillFormConfigForm = JSON.parse(
    JSON.stringify(state.data.configForm),
  );
  configForm.header?.forEach((h) => {
    h.billFormFields?.forEach((b) => {
      // b.refConfig = undefined;
    });
  });
  configForm.body?.forEach((h) => {
    h.billFormFields?.forEach((b) => {
      // b.refConfig = undefined;
    });
  });
  state.data.configList = JSON.parse(JSON.stringify(configForm));
  if (state.data.configList) {
    state.data.configList.uriConf = getTableBillFormUriConf(
      state.data.metaData?.entityInfo?.className!,
      state.data.billFormType ?? 'Single',
    );
  }
  state.current = undefined;
};

/**同步表格数据到表单配置 */
export const syncFromTable: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  const configList: TTableBillFormConfigList = JSON.parse(
    JSON.stringify(state.data.configList),
  );
  configList.header?.forEach((h) => {
    h.billFormFields?.forEach((b) => {
      // b.refConfig = undefined;
    });
  });
  configList.body?.forEach((h) => {
    h.billFormFields?.forEach((b) => {
      // b.refConfig = undefined;
    });
  });
  state.data.configForm = JSON.parse(JSON.stringify(configList));
  if (state.data.configForm) {
    state.data.configForm.uriConf = getBillFormUriConf(
      state.data.metaData?.entityInfo?.className!,
      state.data.billFormType ?? 'Single',
    );
  }
  state.current = undefined;
};

/**从元数据创建表单数据 */
export const createFromMetaData: CaseReducer<
  TModuleStore,
  PayloadAction<void>
> = (state, action) => {
  const configForm: TBillFormConfigForm = {
    ...state.data.configForm,
    mainClass: '',
    mainProperty: '',
    uriConf: undefined,
    header: [],
    body: [],
    tail: [],
  };
  const metaData = state.data.metaData;
  if (!metaData) {
    return;
  }
  const t1 = metaData;
  //第一层，主表
  const ht: TBillFormTab = {
    idBillFormTab: nanoid(),
    entityTypeName: t1.entityInfo?.className,
    tabCode: t1.attributeName,
    firstUpperTabCode: firstToUpper(t1.attributeName || ''),
    tabName: t1.displayName,
    metadataAttrName: t1.id,
    tabClassName: t1.entityInfo?.className,
    firstLowerTabClassName: firstToLower(t1.entityInfo?.className || ''),
    tabAttrName: t1.attributeName || '',
    firstUpperTabAttrName: firstToUpper(t1.attributeName || ''),
    billFormFields: [],
    refType: 'Array',
    orderInfoList: [
      {
        idOrderInfo: nanoid(),
        orderProperty: t1.entityInfo?.pkAttributeInfo?.attributeName!,
        orderType: 'ASC',
      },
    ],
    orderProperty: t1.entityInfo?.pkAttributeInfo?.attributeName,
    orderType: 'ASC',
    fgDefaultTab: true,
  };

  //第二层，主表属性
  t1.children?.forEach((t2, index2) => {
    //基本属性
    if (!t2.entityInfo || t2.fgPrimaryKey) {
      //控件属性配置
      const newBillformB: TBillFormField = {
        idBillFormField: t2.id,
        name: t2.attributeName,
        dataType: t2.attributeTypeCode,
        displayName: t2.displayName,
        fgMainProperty: !!t2.fgPrimaryKey,
        showOrder: index2,
        fgTreeAttr: false,
        fgDisplay: true,
        readonly: false,
        inputType: t2.webInputType || 'Input',
        typeScriptType: t2.typeScriptType || 'string',
      };
      if (t2.enumInfo) {
        newBillformB.enumConfig = {
          idEnumRef: nanoid(),
          enumColumns: [],
          label: t2.enumInfo.displayName,
          propertyName: firstToLower(t2.enumInfo.className!),
          title: t2.enumInfo.displayName,
        };
        t2.enumInfo.attributes?.forEach((enumAttr) => {
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
      if (t2.fgPrimaryKey) {
        ht.mainProperty = t2.attributeName;
        ht.orderProperty = t2.attributeName;
        ht.orderType = 'ASC';
        newBillformB.fgDisplay = false;
      }
      ht.billFormFields?.push(newBillformB);
    } else if (t2.fgPartner) {
      //子属性
      const bt: TTableBillFormTab = {
        idBillFormTab: nanoid(),
        entityTypeName: t2.entityInfo?.className,
        tabCode: t2.attributeName,
        firstUpperTabCode: firstToUpper(t2.attributeName || ''),
        tabName: t2.displayName,
        metadataAttrName: t2.id,
        tabClassName: t2.entityInfo?.className,
        firstLowerTabClassName: firstToLower(t2.entityInfo?.className || ''),
        tabAttrName: t2.attributeName,
        firstUpperTabAttrName: firstToUpper(t2.attributeName || ''),
        refType: t2.attributeTypeCode === 'InternalArray' ? 'Array' : 'Single',
        billFormFields: [],
        orderInfoList: [
          {
            idOrderInfo: nanoid(),
            orderProperty: t2.entityInfo?.pkAttributeInfo?.attributeName!,
            orderType: 'ASC',
          },
        ],
        orderProperty: t2.entityInfo?.pkAttributeInfo?.attributeName,
        orderType: 'ASC',
        fgDefaultTab: false,
      };

      //第三层，子表属性
      t2.children?.forEach((t3, index3) => {
        if (!t3.entityInfo || t3.fgPrimaryKey) {
          //控件属性配置
          const subBillformB: TBillFormField = {
            idBillFormField: t3.id,
            name: t3.attributeName,
            dataType: t3.attributeTypeCode,
            displayName: t3.displayName,
            fgMainProperty: !!t3.fgPrimaryKey,
            showOrder: index3,
            fgTreeAttr: false,
            fgDisplay: true,
            readonly: false,
            inputType: t3.webInputType || 'Input',
            typeScriptType: t3.typeScriptType || 'string',
          };
          if (t3.enumInfo) {
            subBillformB.enumConfig = {
              idEnumRef: nanoid(),
              enumColumns: [],
              label: t3.enumInfo.displayName,
              propertyName: firstToLower(t3.enumInfo.className!),
              title: t3.enumInfo.displayName,
            };
            t3.enumInfo.attributes?.forEach((enumAttr) => {
              const enumAttrInfo: TEnumColumn = {
                idEnumColumn: nanoid(),
                code: enumAttr.code,
                displayName: enumAttr.displayName,
                enumValue: enumAttr.enumValue,
              };
              subBillformB.enumConfig?.enumColumns?.push(enumAttrInfo);
            });
            subBillformB.inputType = 'Select';
          }
          if (t3.fgPrimaryKey) {
            bt.mainProperty = t3.attributeName;
            bt.orderProperty = t3.attributeName;
            bt.orderType = 'ASC';
            subBillformB.fgDisplay = false;
          }
          bt.billFormFields?.push(subBillformB);
        } else if (!t3.fgPartner) {
          //关联属性
          //控件属性配置
          const newBillformB: TBillFormField = getRefBillFormB(t3, index3);
          bt.billFormFields?.push(newBillformB);
        }
      });
      configForm.body?.push(bt);
    } else {
      //关联属性
      //控件属性配置
      const newBillformB: TBillFormField = getRefBillFormB(t2, index2);
      ht.billFormFields?.push(newBillformB);
    }
  });

  configForm.mainProperty = ht.mainProperty ?? '';
  configForm.mainClass = ht.entityTypeName ?? '';
  configForm.header?.push(ht);

  configForm.header?.forEach((ht) => {
    ht.idBillFormTab = nanoid();
    ht.billFormFields?.forEach((b) => {
      b.idBillFormField = nanoid();
    });
  });
  configForm.body?.forEach((bt) => {
    bt.idBillFormTab = nanoid();
    bt.billFormFields?.forEach((b) => {
      b.idBillFormField = nanoid();
    });
  });
  //设置顺序
  configForm.header?.forEach((ht, index) => {
    ht.tabIndex = index;
    ht.fgDefaultTab = index === 0;
  });
  configForm.body?.forEach((bt, index) => {
    bt.tabIndex = index;
    bt.fgDefaultTab = index === 0;
  });
  state.data.configForm = configForm;
  state.data.configForm.uriConf = getBillFormUriConf(
    metaData.entityInfo?.className!,
    state.data.billFormType ?? 'Single',
  );
  state.data.configList = JSON.parse(JSON.stringify(configForm));
  if (state.data.configList) {
    state.data.configList.uriConf = getTableBillFormUriConf(
      metaData.entityInfo?.className!,
      state.data.billFormType ?? 'Single',
    );
  }
  state.current = undefined;
};

/**修改表单基础数据 */
export const updateBaseBillForm: CaseReducer<
  TModuleStore,
  PayloadAction<TBillFormContent>
> = (state, action) => {
  state.data.billFormType = action.payload.billFormType;
  state.data.name = action.payload.name;
  state.data.displayName = action.payload.displayName;
};
