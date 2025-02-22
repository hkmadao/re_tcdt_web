import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import {
  EAttrTypes,
  EPartName,
  TBillFormField,
  TBillFormTab,
  TModuleStore,
  TBillFormSelectData,
  TBillFormUriConf,
} from '../model';

/**设置当前选中数据 */
export const setCurrent: CaseReducer<
  TModuleStore,
  PayloadAction<TBillFormSelectData>
> = (state, action) => {
  if (state.current) {
    if (state.current.attrType === EAttrTypes.Panel) {
      if (action.payload.attrType === EAttrTypes.Panel) {
        const oldTab = state.current.data as TBillFormTab;
        const newTab = action.payload.data as TBillFormTab;
        //选中相同，不做处理
        if (newTab.idBillFormTab === oldTab.idBillFormTab) {
          return;
        }
      }
    }
    if (state.current.attrType === EAttrTypes.Field) {
      if (action.payload.attrType === EAttrTypes.Field) {
        const oldField = state.current.data as TBillFormField;
        const newField = action.payload.data as TBillFormField;
        //选中相同，不做处理
        if (oldField.idBillFormField === newField.idBillFormField) {
          return;
        }
      }
    }
  }
  state.current = action.payload;
};

/**添加Tab信息 */
export const addBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; billFormTab: TBillFormTab }>
> = (state, action) => {
  const { name, billFormTab } = action.payload;
  const existBillFormTab = state?.data.configForm![action.payload.name]?.find(
    (billFormTabFind) => billFormTabFind.tabCode === billFormTab.tabCode,
  );
  if (existBillFormTab) {
    message.error('编号已存在！');
    return;
  }
  let newBillFormTab: TBillFormTab = {
    ...billFormTab,
    billFormFields: [],
    idBillFormTab: nanoid(),
  };
  state?.data.configForm![name]?.push(newBillFormTab);
  state?.data.configForm![name]?.forEach(
    (billFormTab, index) => (billFormTab.tabIndex = index),
  );
  state.current = undefined;
};

/**更新Tab信息 */
export const updateBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; dto: TBillFormTab }>
> = (state, action) => {
  const { name, dto } = action.payload;
  const existBillFormTab = state?.data.configForm![action.payload.name]?.find(
    (billFormTabFind) =>
      billFormTabFind.tabCode === dto.tabCode &&
      billFormTabFind.idBillFormTab !== dto.idBillFormTab,
  );
  if (existBillFormTab) {
    message.error('编号已存在！');
    return;
  }
  state!.data.configForm![name] = state?.data.configForm![name]?.map((bt) => {
    if (bt.idBillFormTab === dto.idBillFormTab) {
      bt = { ...bt, ...dto };
    }
    return bt;
  });
};

/**删除Tab信息 */
export const removeBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; idBillFormTab: string }>
> = (state, action) => {
  let newBillFormTabs = state.data.configForm![action.payload.name]?.filter(
    (billFormTab) => {
      return billFormTab.idBillFormTab !== action.payload.idBillFormTab;
    },
  );
  switch (action.payload.name) {
    case 'header':
      state.data.configForm!.header = newBillFormTabs as TBillFormTab[];
      break;
    case 'body':
      state.data.configForm!.body = newBillFormTabs as TBillFormTab[];
      break;
    case 'tail':
      state.data.configForm!.tail = newBillFormTabs as TBillFormTab[];
      break;
  }
  state.current = undefined;
};

/**新增控件 */
export const addBillFormFields: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; tabCode: string; dtos: TBillFormField[] }>
> = (state, action) => {
  const { name, tabCode, dtos } = action.payload;
  const billformbs =
    state.data.configForm![name]?.find(
      (billFormTab) => billFormTab.tabCode === tabCode,
    )?.billFormFields || [];
  billformbs.forEach((billformb, index) => {
    billformb.showOrder = index;
  });
  if (dtos) {
    dtos.forEach((dto, index) => {
      dto.showOrder = billformbs.length + index;
    });
    const newBillformbs = billformbs.concat(dtos);
    state.data.configForm![name]!.find(
      (billFormTab) => billFormTab.tabCode === tabCode,
    )!.billFormFields = newBillformbs;
  }
  state.current = undefined;
};

/**修改控件序号 */
export const switchOrderBillFormFields: CaseReducer<
  TModuleStore,
  PayloadAction<{
    name: EPartName;
    tabCode: string;
    drag: TBillFormField;
    hover: TBillFormField;
  }>
> = (state, action) => {
  const { name, tabCode, drag, hover } = action.payload;
  state.data.configForm![name]?.forEach((billFormTab) => {
    if (billFormTab.tabCode === tabCode) {
      billFormTab.billFormFields = billFormTab.billFormFields
        ?.map((s) => {
          let newS = { ...s };
          if (s.idBillFormField === drag.idBillFormField) {
            newS.showOrder = hover.showOrder;
          }
          if (s.idBillFormField === hover.idBillFormField) {
            newS.showOrder = drag.showOrder;
          }
          return newS;
        })
        .sort((s1, s2) => s1.showOrder! - s2.showOrder!);
    }
  });
};

/**更新控件信息 */
export const updateBillFormField: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; tabCode: string; dto: TBillFormField }>
> = (state, action) => {
  const { name, tabCode, dto } = action.payload;
  const billformFields = state.data.configForm![name]?.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )?.billFormFields;
  const newBillformFields = billformFields?.map((billFormB) => {
    if (billFormB.idBillFormField === dto.idBillFormField) {
      billFormB = { ...dto };
    }
    return billFormB;
  });
  state.data.configForm![name]!.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )!.billFormFields = newBillformFields;
};

/**删除控件信息 */
export const deleteBillFormField: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; tabCode: string; dto: TBillFormField }>
> = (state, action) => {
  const { name, tabCode, dto } = action.payload;
  const billformFields = state.data.configForm![name]?.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )?.billFormFields;
  const newBillformFields = billformFields?.filter(
    (billFormB) => billFormB.idBillFormField !== dto.idBillFormField,
  );
  state.data.configForm![name]!.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )!.billFormFields = newBillformFields;
  state.current = undefined;
};

/**表单URI信息更新 */
export const updateEditUriConf: CaseReducer<
  TModuleStore,
  PayloadAction<TBillFormUriConf>
> = (state, action) => {
  const editUriConf = action.payload;
  if (state.data.configForm) {
    state.data.configForm.uriConf = editUriConf;
  }
};
