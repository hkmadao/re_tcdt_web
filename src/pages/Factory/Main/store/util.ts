import {
  TComponentType,
  TLayout,
  TLayoutType,
  TPageAssoLayout,
} from '../model';

export const findLayout: (
  layoutId: string,
  layouts: TLayout[],
) => TLayout | undefined = (layoutId: string, layouts: TLayout[]) => {
  for (let i = 0; i < layouts.length; i++) {
    let l = layouts[i];
    if (l.id === layoutId) {
      return l;
    }
    const cl = findLayout(layoutId, l.children);
    if (cl) {
      return cl;
    }
  }
};

export const findLayoutBycompType: (
  compType: TComponentType,
  layouts: TLayout[],
) => TLayout | undefined = (compType: TComponentType, layouts: TLayout[]) => {
  for (let i = 0; i < layouts.length; i++) {
    let l = layouts[i];
    if (l.component && l.component.componentType === compType) {
      return l;
    }
    const cl = findLayoutBycompType(compType, l.children);
    if (cl) {
      return cl;
    }
  }
};

export const buildAsso: (
  idPage: string,
  layouts: TLayout[],
) => TPageAssoLayout[] = (idPage: string, layouts: TLayout[]) => {
  const assos: TPageAssoLayout[] = [];
  for (let index = 0; index < layouts.length; index++) {
    const layout = layouts[index];
    if (layout.children.length > 0) {
      const assos1 = buildAsso(idPage, layout.children);
      assos.push(...assos1);
    }
    const asso: TPageAssoLayout = {
      idPage,
      idLayout: layout.id,
      hidden: false,
      disabled: false,
    };
    assos.push(asso);
  }
  return assos;
};

export const findLayoutAutoIndex: (
  preStr: string,
  layouts: TLayout[],
) => number = (preStr: string, layouts: TLayout[]) => {
  const regex = new RegExp(`^\\${preStr}([0-9]){1,}$`);
  const numberRegex = /([0-9]){1,}/;
  let maxIndex = 0;
  for (let i = 0; i < layouts.length; i++) {
    let l = layouts[i];
    if (l.title && l.title.search(regex) === 0) {
      const orderStr = l.title.match(numberRegex)?.toString();
      if (orderStr && parseInt(orderStr) > maxIndex) {
        maxIndex = parseInt(orderStr);
      }
    }
    const childOrder = findLayoutAutoIndex(preStr, l.children);
    if (childOrder > maxIndex) {
      maxIndex = childOrder;
    }
  }
  return maxIndex;
};
