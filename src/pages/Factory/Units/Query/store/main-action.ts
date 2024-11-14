import { CaseReducer, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TModuleStore, TQueryContent } from '../model';
import {
  TBillSearchRef,
  TDescriptionInfo,
} from '@/pages/Factory/Units/common/model';

export const setCurrent: CaseReducer<
  TModuleStore,
  PayloadAction<{
    type: 'field' | 'panel';
    id: string;
  }>
> = (state, action) => {
  state.current = action.payload;
};

export const setMetaData: CaseReducer<
  TModuleStore,
  PayloadAction<{ metaData: TDescriptionInfo[] }>
> = (state, action) => {
  state.data.metaData = action.payload.metaData;
};

/**修改查询模板基础数据 */
export const updateBaseQueryTemplate: CaseReducer<
  TModuleStore,
  PayloadAction<TQueryContent>
> = (state, action) => {
  state.data.idComponent = action.payload.idComponent;
  state.data.componentName = action.payload.componentName;
  state.data.idQuery = action.payload.idQuery;
  state.data.name = action.payload.name;
  state.data.displayName = action.payload.displayName;
};

export const addCondition: CaseReducer<
  TModuleStore,
  PayloadAction<TBillSearchRef>
> = (state, action) => {
  const id = nanoid();
  const billSearchRef: TBillSearchRef = {
    ...action.payload,
    idBillSearchRef: id,
    showOrder: state.data.searchRefs.length,
  };
  state.data.searchRefs?.push(billSearchRef);
  state.current = {
    type: 'field',
    id,
  };
};

export const updateCondition: CaseReducer<
  TModuleStore,
  PayloadAction<TBillSearchRef>
> = (state, action) => {
  const billSearchRef: TBillSearchRef = action.payload;
  state.data.searchRefs = state.data.searchRefs?.map((s) => {
    if (s.idBillSearchRef === billSearchRef.idBillSearchRef) {
      return {
        ...s,
        ...billSearchRef,
      };
    }
    return s;
  });
};

export const deleteCondition: CaseReducer<
  TModuleStore,
  PayloadAction<TBillSearchRef>
> = (state, action) => {
  const billSearchRef: TBillSearchRef = action.payload;
  state.data.searchRefs = state.data.searchRefs?.filter((s) => {
    if (s.idBillSearchRef === billSearchRef.idBillSearchRef) {
      return false;
    }
    return true;
  });
  //重新变更顺序号码
  state.data.searchRefs = state.data.searchRefs.map((searchRef, index) => {
    let searchRefNew = { ...searchRef };
    searchRefNew.showOrder = index;
    return searchRefNew;
  });
};

/**修改控件序号 */
export const switchConditionOrder: CaseReducer<
  TModuleStore,
  PayloadAction<{
    drag: TBillSearchRef;
    hover: TBillSearchRef;
  }>
> = (state, action) => {
  const { drag, hover } = action.payload;
  state.data.searchRefs = state.data.searchRefs
    .map((s) => {
      let newS = { ...s };
      if (s.idBillSearchRef === drag.idBillSearchRef) {
        newS.showOrder = hover.showOrder;
      }
      if (s.idBillSearchRef === hover.idBillSearchRef) {
        newS.showOrder = drag.showOrder;
      }
      return newS;
    })
    .sort((s1, s2) => s1.showOrder - s2.showOrder);
};
