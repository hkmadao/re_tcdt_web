import { TModuleStore, TLayout, TPage, TPageAssoLayout } from '../model';

export const generateInitData = () => {
  const idPage = 'index';
  const page: TPage = {
    key: idPage,
    id: idPage,
    code: 'index',
    name: '首页',
  };
  const idLayoutRoot = 'root';
  const layoutData: TLayout[] = [
    {
      key: idLayoutRoot,
      id: idLayoutRoot,
      title: 'root',
      idParent: null,
      order: 1,
      type: 'layout',
      direction: 'column',
      flexType: 'auto',
      flexStr: '1 1 auto',
      children: [],
    },
  ];
  const assos: TPageAssoLayout[] = [
    {
      idPage,
      idLayout: idLayoutRoot,
      hidden: false,
      disabled: false,
    },
  ];
  return {
    currentPageId: idPage,
    currentLayoutId: undefined,
    data: {
      modleType: undefined,
      pages: [page],
      layouts: layoutData,
      assos,
    },
  };
};

export const initialState: TModuleStore = {
  status: 'idle',
  ...generateInitData(),
};
