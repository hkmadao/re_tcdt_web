import { CaseReducer, PayloadAction, nanoid } from '@reduxjs/toolkit';
import {
  TDirection,
  TModuleStore,
  TLayout,
  TLayoutType,
  TPage,
  TPageAssoLayout,
  TUiFactoryContent,
  TComponentType,
  TModleType,
} from '../model';
import {
  buildAsso,
  findLayout,
  findLayoutAutoIndex,
  findLayoutBycompType,
} from './util';
import { message } from 'antd';

/**修改基础数据 */
export const updateBaseMain: CaseReducer<
  TModuleStore,
  PayloadAction<TUiFactoryContent>
> = (state, action) => {
  state.data.idFactory = action.payload.idFactory;
  state.data.name = action.payload.name;
  state.data.displayName = action.payload.displayName;
};

/**修改模型数据 */
export const updateModelTyps: CaseReducer<
  TModuleStore,
  PayloadAction<TModleType>
> = (state, action) => {
  state.data.modleType = action.payload;
};

export const setCurrentPageId: CaseReducer<
  TModuleStore,
  PayloadAction<string>
> = (state, action) => {
  state.currentPageId = action.payload;
  state.currentLayoutId = undefined;
};

export const setCurrentLayoutId: CaseReducer<
  TModuleStore,
  PayloadAction<string>
> = (state, action) => {
  state.currentLayoutId = action.payload;
};

export const addPage: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  const regex = new RegExp(`^页面([0-9]){1,}$`);
  const numberRegex = /([0-9]){1,}/;
  const codeRegex = new RegExp(`^page([0-9]){1,}$`);
  let maxIndex = 0;
  let codeMaxIndex = 0;
  for (let i = 0; i < state.data.pages.length; i++) {
    let l = state.data.pages[i];
    if (l.name && l.name.search(regex) === 0) {
      const orderStr = l.name.match(numberRegex)?.toString();
      if (orderStr && parseInt(orderStr) > maxIndex) {
        maxIndex = parseInt(orderStr);
      }
    }
  }
  for (let i = 0; i < state.data.pages.length; i++) {
    let l = state.data.pages[i];
    if (l.name && l.name.search(codeRegex) === 0) {
      const orderStr = l.name.match(numberRegex)?.toString();
      if (orderStr && parseInt(orderStr) > maxIndex) {
        maxIndex = parseInt(orderStr);
      }
    }
  }
  const idPage = nanoid();
  const page: TPage = {
    key: idPage,
    id: idPage,
    code: 'page' + (codeMaxIndex + 1),
    name: '页面' + (maxIndex + 1),
  };
  const assos = buildAsso(idPage, state.data.layouts);
  state.data.pages.push(page);
  state.data.assos.push(...assos);
};

export const updatePage: CaseReducer<TModuleStore, PayloadAction<TPage>> = (
  state,
  action,
) => {
  const updatePage = action.payload;
  state.data.pages = state.data.pages.map((p) => {
    if (updatePage.id === p.id) {
      return { ...p, ...updatePage, key: p.id };
    }
    return p;
  });
};

export const removePage: CaseReducer<TModuleStore, PayloadAction<TPage>> = (
  state,
  action,
) => {
  const updatePage = action.payload;
  state.data.pages = state.data.pages.filter((p) => {
    if (updatePage.id === p.id) {
      return false;
    }
    return true;
  });
  state.data.assos = state.data.assos.filter(
    (asso) => asso.idPage !== updatePage.id,
  );
};

export const addLayout: CaseReducer<
  TModuleStore,
  PayloadAction<{ idParent: string; direction: TDirection; type: TLayoutType }>
> = (state, action) => {
  const { idParent, direction, type } = action.payload;
  const idLayout1 = nanoid();
  const idLayout2 = nanoid();
  const currentLayout = findLayout(idParent, state.data.layouts);
  const maxAutoOrder = findLayoutAutoIndex('布局', state.data.layouts);
  if (currentLayout) {
    currentLayout.direction = direction;
    currentLayout.children.push({
      key: idLayout1,
      id: idLayout1,
      title: '布局' + (maxAutoOrder + 1),
      idParent,
      order: 1,
      type,
      direction: 'row',
      flexType: 'auto',
      flexStr: '1 1 auto',
      children: [],
    });
    currentLayout.children.push({
      key: idLayout2,
      id: idLayout2,
      title: '布局' + (maxAutoOrder + 2),
      idParent,
      order: 2,
      type,
      direction: 'row',
      flexType: 'auto',
      flexStr: '1 1 auto',
      children: [],
    });
    state.currentLayoutId = idParent;
    const assos: TPageAssoLayout[] = [];
    for (let index = 0; index < state.data.pages.length; index++) {
      const page = state.data.pages[index];
      const asso1: TPageAssoLayout = {
        idPage: page.id,
        idLayout: idLayout1,
        hidden: false,
        disabled: false,
      };
      const asso2: TPageAssoLayout = {
        idPage: page.id,
        idLayout: idLayout2,
        hidden: false,
        disabled: false,
      };
      assos.push(asso1, asso2);
    }
    state.data.assos.push(...assos);
  }
};

export const addSingleLayout: CaseReducer<
  TModuleStore,
  PayloadAction<{ idParent: string; type: TLayoutType }>
> = (state, action) => {
  const { idParent, type } = action.payload;
  const idLayout1 = nanoid();
  const currentLayout = findLayout(idParent, state.data.layouts);
  const maxAutoOrder = findLayoutAutoIndex('布局', state.data.layouts);
  if (currentLayout) {
    currentLayout.children.push({
      key: idLayout1,
      id: idLayout1,
      title: '布局' + (maxAutoOrder + 1),
      idParent,
      order: 1,
      type,
      direction: 'row',
      flexType: 'auto',
      flexStr: '1 1 auto',
      children: [],
    });
    state.currentLayoutId = idLayout1;
    const assos: TPageAssoLayout[] = [];
    for (let index = 0; index < state.data.pages.length; index++) {
      const page = state.data.pages[index];
      const asso1: TPageAssoLayout = {
        idPage: page.id,
        idLayout: idLayout1,
        hidden: false,
        disabled: false,
      };
      assos.push(asso1);
    }
    state.data.assos.push(...assos);
  }
};

/**
 * 修改布局
 * @param state
 * @param action
 */
export const updateLayout: CaseReducer<TModuleStore, PayloadAction<TLayout>> = (
  state,
  action,
) => {
  const {
    id: id,
    direction,
    flexType,
    flexStr,
    title,
    component,
    pageMaps,
  } = action.payload;
  const currentLayout = findLayout(id, state.data.layouts);
  if (currentLayout) {
    currentLayout.direction = direction;
    currentLayout.flexType = flexType;
    currentLayout.flexStr = flexStr;
    currentLayout.title = title;
    currentLayout.component = component;
    currentLayout.pageMaps = pageMaps;
  }
  state.currentLayoutId = id;
};

/**
 * 修改组件类型
 * @param state
 * @param action
 */
export const updateLayoutCompType: CaseReducer<
  TModuleStore,
  PayloadAction<{ id: string; componentType: TComponentType }>
> = (state, action) => {
  const { id, componentType } = action.payload;
  if (componentType && componentType !== 'custom') {
    const l = findLayoutBycompType(componentType, state.data.layouts);
    if (l) {
      if (componentType === 'viewBillform') {
        message.error('不能添加多个列表组件！');
      }
      if (componentType === 'editBillform') {
        message.error('不能添加多个表单组件！');
      }
      if (componentType === 'search') {
        message.error('不能添加多个查询组件！');
      }
      if (componentType === 'tree') {
        message.error('不能添加多个树组件！');
      }
      if (componentType === 'viewButton') {
        message.error('不能添加多个列表按钮组件！');
      }
      if (componentType === 'editButton') {
        message.error('不能添加多个表单按钮组件！');
      }
      return;
    }
  }
  const currentLayout = findLayout(id, state.data.layouts);
  if (currentLayout) {
    currentLayout.component = {
      componentType: componentType,
    };
  }
  state.currentLayoutId = id;
};

/**
 * 切换为布局
 * @param state
 * @param action
 */
export const toggleLayout: CaseReducer<
  TModuleStore,
  PayloadAction<{ id: string; componentType?: TComponentType }>
> = (state, action) => {
  const { id, componentType } = action.payload;
  const currentLayout = findLayout(id, state.data.layouts);
  if (currentLayout) {
    if (currentLayout.type === 'component') {
      currentLayout.type = 'layout';
      currentLayout.component = undefined;
    } else {
      if (componentType && componentType !== 'custom') {
        const l = findLayoutBycompType(componentType, state.data.layouts);
        if (l) {
          if (componentType === 'viewBillform') {
            message.error('不能添加多个列表组件！');
          }
          if (componentType === 'editBillform') {
            message.error('不能添加多个表单组件！');
          }
          if (componentType === 'search') {
            message.error('不能添加多个查询组件！');
          }
          if (componentType === 'tree') {
            message.error('不能添加多个树组件！');
          }
          if (componentType === 'viewButton') {
            message.error('不能添加多个列表按钮组件！');
          }
          if (componentType === 'editButton') {
            message.error('不能添加多个表单按钮组件！');
          }
          return;
        }
      }
      currentLayout.type = 'component';
      currentLayout.component = {
        componentType: componentType ?? 'custom',
      };
    }
  }
  state.currentLayoutId = id;
};

/**
 * 切换为组件
 * @param state
 * @param action
 */
// export const changeToComponent: CaseReducer<TModuleStore, PayloadAction<{ id: string; componentType: TComponentType }>> = (
//   state,
//   action,
// ) => {
//   const { id: id, componentType, } = action.payload;
//   const currentLayout = findLayout(id, state.data.layouts);
//   if (currentLayout) {
//     currentLayout.type = 'component';
//     currentLayout.component = {
//       componentType,
//     }
//   }
//   state.currentLayoutId = id;
// };

export const removeLayout: CaseReducer<
  TModuleStore,
  PayloadAction<{ idParent: string; id: string }>
> = (state, action) => {
  const { idParent, id } = action.payload;
  const currentLayout = findLayout(idParent, state.data.layouts);
  if (currentLayout) {
    currentLayout.children =
      currentLayout.children.filter((l) => l.id !== id) || [];
    currentLayout.children = currentLayout.children.map((l, index) => {
      return { ...l, order: index + 1 };
    });
  }
  state.currentLayoutId = idParent;
  state.data.assos = state.data.assos.filter((asso) => asso.idLayout !== id);
};

// /**
//  * 添加组件
//  * @param state
//  * @param action
//  */
// export const addComponent: CaseReducer<
//   TModuleStore,
//   PayloadAction<Pick<TLayout, 'idParent'> & Pick<TComponent, 'componentType'>>
// > = (state, action) => {
//   const { idParent, componentType } = action.payload;
//   if (!idParent) {
//     console.error('缺少idParent参数！');
//     return;
//   }
//   const currentLayout = findLayout(idParent, state.data.layouts);
//   const maxAutoOrder = findLayoutAutoIndex('组件', state.data.layouts);
//   if (currentLayout) {
//     const id = nanoid();
//     currentLayout.children.push({
//       key: id,
//       id: id,
//       title: '组件' + (maxAutoOrder + 1),
//       idParent,
//       component: {
//         componentType: componentType ?? 'custom',
//       },
//       direction: 'row',
//       type: 'component',
//       flexType: 'auto',
//       flexStr: '1 1 auto',
//       children: [],
//       order: 1,
//     });
//     const assos: TPageAssoLayout[] = [];
//     for (let index = 0; index < state.data.pages.length; index++) {
//       const page = state.data.pages[index];
//       const asso: TPageAssoLayout = {
//         idPage: page.id,
//         idLayout: id,
//         hidden: false,
//         disabled: false,
//       };
//       assos.push(asso);
//     }
//     state.data.assos.push(...assos);
//     state.currentLayoutId = id;
//   }
// };

// /**
//  * 更新组件
//  * @param state
//  * @param action
//  */
// export const updateComponent: CaseReducer<
//   TModuleStore,
//   PayloadAction<TLayout>
// > = (state, action) => {
//   const { id: id, direction, flexType, flexStr, title } = action.payload;
//   if (!id) {
//     console.error('缺少id参数！');
//     return;
//   }
//   const currentLayout = findLayout(id, state.data.layouts);
//   if (currentLayout) {
//     currentLayout.direction = direction;
//     currentLayout.flexType = flexType;
//     currentLayout.flexStr = flexStr;
//     currentLayout.title = title;
//   }
//   state.currentLayoutId = id;
// };

// export const removeComponent: CaseReducer<
//   TModuleStore,
//   PayloadAction<{ idParent: string; id: string }>
// > = (state, action) => {
//   const { idParent, id } = action.payload;
//   const currentLayout = findLayout(idParent, state.data.layouts);
//   if (currentLayout) {
//     currentLayout.children =
//       currentLayout.children.filter((l) => l.id !== id) || [];
//     currentLayout.children = currentLayout.children.map((l, index) => {
//       return { ...l, order: index + 1 };
//     });
//     state.data.assos = state.data.assos.filter((asso) => asso.idLayout !== id);
//   }
//   state.currentLayoutId = idParent;
// };

export const updateAsso: CaseReducer<
  TModuleStore,
  PayloadAction<TPageAssoLayout>
> = (state, action) => {
  const assoUpdate = action.payload;
  state.data.assos = state.data.assos.map((asso) => {
    if (
      asso.idPage === assoUpdate.idPage &&
      asso.idLayout === assoUpdate.idLayout
    ) {
      return { ...asso, ...assoUpdate };
    }
    return asso;
  });
};
