import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import {
  EAttrTypes,
  EPartName,
  TTableBillFormField,
  TTableBillFormTab,
  TModuleStore,
  TBillFormSelectData,
  TTableBillFormUriConf,
  TTableBillFormSelectData,
} from '../model';

/**列表设置当前选中数据 */
export const setTableCurrent: CaseReducer<
  TModuleStore,
  PayloadAction<TBillFormSelectData>
> = (state, action) => {
  if (state.current) {
    if (state.current.attrType === EAttrTypes.Panel) {
      if (action.payload.attrType === EAttrTypes.Panel) {
        const oldTab = state.current.data as TTableBillFormTab;
        const newTab = action.payload.data as TTableBillFormTab;
        //选中相同，不做处理
        if (newTab.idBillFormTab === oldTab.idBillFormTab) {
          return;
        }
      }
    }
    if (state.current.attrType === EAttrTypes.Field) {
      if (action.payload.attrType === EAttrTypes.Field) {
        const oldField = state.current.data as TTableBillFormField;
        const newField = action.payload.data as TTableBillFormField;
        //选中相同，不做处理
        if (oldField.idBillFormField === newField.idBillFormField) {
          return;
        }
      }
    }
  }
  state.current = action.payload;
};

/**列表添加Tab信息 */
export const addTableBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; billFormTab: TTableBillFormTab }>
> = (state, action) => {
  const { name, billFormTab } = action.payload;
  const existBillformTab = state.data.configList![action.payload.name]?.find(
    (billFormTabFind) => billFormTabFind.tabCode === billFormTab.tabCode,
  );
  if (existBillformTab) {
    message.error('编号已存在！');
    return;
  }
  let newBillformTab: TTableBillFormTab = {
    ...billFormTab,
    billFormFields: [],
    idBillFormTab: nanoid(),
  };
  state.data.configList![name]?.push(newBillformTab);
  state.data.configList![name]?.forEach(
    (billFormTab, index) => (billFormTab.tabIndex = index),
  );
  state.current = undefined;
};

/**列表更新Tab信息 */
export const updateTableBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; dto: TTableBillFormTab }>
> = (state, action) => {
  const { name, dto } = action.payload;
  const existBillformTab = state.data.configList![action.payload.name]?.find(
    (billFormTabFind) =>
      billFormTabFind.tabCode === dto.tabCode &&
      billFormTabFind.idBillFormTab !== dto.idBillFormTab,
  );
  if (existBillformTab) {
    message.error('编号已存在！');
    return;
  }
  const newTabs = state.data.configList![name]?.map((bt) => {
    if (bt.idBillFormTab === dto.idBillFormTab) {
      bt = { ...bt, ...dto };
    }
    return bt;
  });

  state.data.configList![name] = newTabs;

  const newTab = newTabs?.find(
    (item) => item.idBillFormTab === dto.idBillFormTab,
  );
  if (state.current && newTab) {
    state.current.data = newTab;
  }
};

/**列表删除Tab信息 */
export const removeTableBillFormTab: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; idBillFormTab: string }>
> = (state, action) => {
  let newBillformTabs = state.data.configList![action.payload.name]?.filter(
    (billFormTab) => {
      return billFormTab.idBillFormTab !== action.payload.idBillFormTab;
    },
  );
  switch (action.payload.name) {
    case 'header':
      state.data.configList!.header = newBillformTabs as TTableBillFormTab[];
      break;
    case 'body':
      state.data.configList!.body = newBillformTabs as TTableBillFormTab[];
      break;
    case 'tail':
      state.data.configList!.tail = newBillformTabs as TTableBillFormTab[];
      break;
  }
  state.current = undefined;
};

/**列表新增控件 */
export const addTableBillFormFields: CaseReducer<
  TModuleStore,
  PayloadAction<{
    name: EPartName;
    tabCode: string;
    dtos: TTableBillFormField[];
  }>
> = (state, action) => {
  const { name, tabCode, dtos } = action.payload;
  const billformbs =
    state.data.configList![name]?.find(
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
    state.data.configList![name]!.find(
      (billFormTab) => billFormTab.tabCode === tabCode,
    )!.billFormFields = newBillformbs;
  }
  state.current = undefined;
};

/**列表修改控件序号 */
export const switchOrderTableBillFormFields: CaseReducer<
  TModuleStore,
  PayloadAction<{
    name: EPartName;
    tabCode: string;
    drag: TTableBillFormField;
    hover: TTableBillFormField;
  }>
> = (state, action) => {
  const { name, tabCode, drag, hover } = action.payload;
  state.data.configList![name]?.forEach((billFormTab) => {
    if (billFormTab.tabCode === tabCode) {
      billFormTab.billFormFields = billFormTab.billFormFields
        ?.map((item) => {
          let newS = { ...item };
          if (item.idBillFormField === drag.idBillFormField) {
            newS.showOrder = hover.showOrder! + 1;
            return newS;
          }
          if (item.showOrder! > hover.showOrder!) {
            newS.showOrder = newS.showOrder! + 1;
          }
          return newS;
        })
        .sort((s1, s2) => s1.showOrder! - s2.showOrder!)
        .map((item, index) => {
          item.showOrder = index;
          return item;
        });
    }
  });
  const curData = state.data
    .configList![name]?.find((item) => item.tabCode === tabCode)
    ?.billFormFields?.find(
      (item) => item.idBillFormField === drag.idBillFormField,
    );
  if (curData) {
    const current: TTableBillFormSelectData = {
      attrType: EAttrTypes.Field,
      name: name,
      tabCode: tabCode,
      data: curData,
    };
    state.current = current;
  }
};

/**列表更新控件信息 */
export const updateTableBillFormField: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; tabCode: string; dto: TTableBillFormField }>
> = (state, action) => {
  const { name, tabCode, dto } = action.payload;
  const billformFields = state.data.configList![name]?.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )?.billFormFields;
  const newBillformFields = billformFields?.map((billFormB) => {
    if (billFormB.idBillFormField === dto.idBillFormField) {
      billFormB = { ...dto };
    }
    return billFormB;
  });
  state.data.configList![name]!.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )!.billFormFields = newBillformFields;

  const newFiled = newBillformFields?.find(
    (item) => item.idBillFormField === dto.idBillFormField,
  );

  if (state.current && newFiled) {
    state.current.data = newFiled;
  }
};

/**列表删除控件信息 */
export const deleteTableBillFormField: CaseReducer<
  TModuleStore,
  PayloadAction<{ name: EPartName; tabCode: string; dto: TTableBillFormField }>
> = (state, action) => {
  const { name, tabCode, dto } = action.payload;
  const billformFields = state.data.configList![name]?.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )?.billFormFields;
  const newBillformFields = billformFields?.filter(
    (billFormB) => billFormB.idBillFormField !== dto.idBillFormField,
  );
  state.data.configList![name]!.find(
    (billFormTab) => billFormTab.tabCode === tabCode,
  )!.billFormFields = newBillformFields;
};

/**表单URI信息更新 */
export const updateViewUriConf: CaseReducer<
  TModuleStore,
  PayloadAction<TTableBillFormUriConf>
> = (state, action) => {
  const viewUriConf = action.payload;
  if (state.data.configList) {
    state.data.configList.uriConf = viewUriConf;
  }
};
