import { CaseReducer, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TModuleStore, TActionContent } from '../model';
import { TButton } from '../model';

export const setCurrent: CaseReducer<
  TModuleStore,
  PayloadAction<{
    type: 'field' | 'panel';
    id: string;
  }>
> = (state, action) => {
  state.current = action.payload;
};

/**修改查询模板基础数据 */
export const updateBase: CaseReducer<
  TModuleStore,
  PayloadAction<TActionContent>
> = (state, action) => {
  state.data.idProject = action.payload.idProject;
  state.data.idSubProject = action.payload.idSubProject;
  state.data.subProjectName = action.payload.subProjectName;
  state.data.idButtonAction = action.payload.idButtonAction;
  state.data.name = action.payload.name;
  state.data.displayName = action.payload.displayName;
};

export const addCondition: CaseReducer<
  TModuleStore,
  PayloadAction<
    Pick<TButton, 'clickEventName' | 'label' | 'disableScript' | 'hiddenScript'>
  >
> = (state, action) => {
  const id = nanoid();
  const buttonData: TButton = {
    ...action.payload,
    idButton: id,
    buttonSize: 'middle',
    type: 'primary',
    showOrder: state.data.buttons.length,
  };
  state.data.buttons?.push(buttonData);
  state.current = {
    type: 'field',
    id,
  };
};

export const updateCondition: CaseReducer<
  TModuleStore,
  PayloadAction<TButton>
> = (state, action) => {
  const buttonData: TButton = action.payload;
  state.data.buttons = state.data.buttons?.map((s) => {
    if (s.idButton === buttonData.idButton) {
      return {
        ...s,
        ...buttonData,
      };
    }
    return s;
  });
};

export const deleteCondition: CaseReducer<
  TModuleStore,
  PayloadAction<TButton>
> = (state, action) => {
  const buttonData: TButton = action.payload;
  state.data.buttons = state.data.buttons?.filter((s) => {
    if (s.idButton === buttonData.idButton) {
      return false;
    }
    return true;
  });
  //重新变更顺序号码
  state.data.buttons = state.data.buttons.map((searchRef, index) => {
    let searchRefNew = { ...searchRef };
    searchRefNew.showOrder = index;
    return searchRefNew;
  });
};

/**修改控件序号 */
export const switchConditionOrder: CaseReducer<
  TModuleStore,
  PayloadAction<{
    drag: TButton;
    hover: TButton;
  }>
> = (state, action) => {
  const { drag, hover } = action.payload;
  state.data.buttons = state.data.buttons
    .map((s) => {
      let newS = { ...s };
      if (s.idButton === drag.idButton) {
        newS.showOrder = hover.showOrder;
      }
      if (s.idButton === hover.idButton) {
        newS.showOrder = drag.showOrder;
      }
      return newS;
    })
    .sort((s1, s2) => s1.showOrder - s2.showOrder);
};
