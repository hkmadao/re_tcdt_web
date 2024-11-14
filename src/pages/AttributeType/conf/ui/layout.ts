import { TUiFactoryContent } from '@/models';

const layoutConf: TUiFactoryContent = {
  action: 1,
  componentModuleName: '公共属性',
  componentName: null,
  displayName: '数据类型',
  fgTemplate: true,
  idComponent: '0000-115f0f9f-1acf-4113-9d63-534cedc06fe8',
  idComponentModule: '0000-ae91cf86-2dba-4906-8fbc-b5e35d71909a',
  idFactory: 'WFIUQH0Vr2No1M2guQqXS',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'AttributeType',
  projectName: '模板代码设计工具RUST',
  refIdContent: null,
  subProjectName: '模型管理',
  pages: [
    { key: 'index', id: 'index', code: 'index', name: '首页' },
    {
      key: 'UIi8B9aPjjT25SuLEqrL3',
      id: 'UIi8B9aPjjT25SuLEqrL3',
      code: 'edit',
      name: '编辑页',
    },
  ],
  layouts: [
    {
      key: 'root',
      id: 'root',
      title: 'root',
      idParent: null,
      order: 1,
      type: 'layout',
      direction: 'row',
      flexType: 'auto',
      flexStr: '1 1 auto',
      children: [
        {
          key: 'x_hgeXRhAkHsQE60jNb5o',
          id: 'x_hgeXRhAkHsQE60jNb5o',
          title: '树',
          idParent: 'root',
          order: 1,
          type: 'component',
          direction: 'row',
          flexType: 'custom',
          flexStr: '0 0 300px',
          children: [],
          component: {
            componentType: 'tree',
            idRef: 'Jxkn00elnxi1FksUPg9qQ',
            name: '项目一级平铺树',
          },
        },
        {
          key: 'WpqWtGYtXJAx2D650A4iP',
          id: 'WpqWtGYtXJAx2D650A4iP',
          title: '右布局',
          idParent: 'root',
          order: 2,
          type: 'layout',
          direction: 'column',
          flexType: 'auto',
          flexStr: '1 1 auto',
          children: [
            {
              key: 'n2Jgu2vIU1NyjpvnPwJQc',
              id: 'n2Jgu2vIU1NyjpvnPwJQc',
              title: '查询',
              idParent: 'WpqWtGYtXJAx2D650A4iP',
              order: 1,
              type: 'component',
              direction: 'row',
              flexType: 'notGrow',
              flexStr: '0 1 auto',
              children: [],
              component: {
                componentType: 'search',
                idRef: '4C5vcely9fF66SZ1nST5Y',
                name: '数据类型',
              },
            },
            {
              key: 'l0y4IQ8ZKIfgtEg-a7Lxs',
              id: 'l0y4IQ8ZKIfgtEg-a7Lxs',
              title: '列表按钮',
              idParent: 'WpqWtGYtXJAx2D650A4iP',
              order: 2,
              type: 'component',
              direction: 'row',
              flexType: 'notGrow',
              flexStr: '0 1 auto',
              children: [],
              component: {
                componentType: 'viewButton',
                idRef: '0000-4f072373-519c-4e78-9509-f0761fce4197',
                name: '树表单列表按钮',
              },
              pageMaps: [
                {
                  idPageMap: 'e335192a-81cb-48c7-9c9d-d29613a03384',
                  componentStateCode: 'list',
                  pageCode: 'index',
                },
                {
                  idPageMap: '220efd88-7ab2-477f-9621-9df77530e88d',
                  componentStateCode: 'form',
                  pageCode: 'edit',
                },
              ],
            },
            {
              key: '6Qe5HdllWwHQCzhoEvVhV',
              id: '6Qe5HdllWwHQCzhoEvVhV',
              title: '列表',
              idParent: 'WpqWtGYtXJAx2D650A4iP',
              order: 1,
              type: 'component',
              direction: 'row',
              flexType: 'auto',
              flexStr: '1 1 auto',
              children: [],
              component: {
                componentType: 'viewBillform',
                idRef: '7Qr7imQHM2bULYzpDez6L',
                name: '数据类型',
              },
            },
            {
              key: 'QNUvZrFbaazGu_Y4hRvYE',
              id: 'QNUvZrFbaazGu_Y4hRvYE',
              title: '表单按钮',
              idParent: 'WpqWtGYtXJAx2D650A4iP',
              order: 1,
              type: 'component',
              direction: 'row',
              flexType: 'notGrow',
              flexStr: '0 1 auto',
              children: [],
              component: {
                componentType: 'editButton',
                idRef: '0000-0be2b951-041d-4d59-b4ee-6aee87dd6942',
                name: '树表单表单按钮',
              },
            },
            {
              key: 'SfvegLl-GhKk3YVpiVQWh',
              id: 'SfvegLl-GhKk3YVpiVQWh',
              title: '表单',
              idParent: 'WpqWtGYtXJAx2D650A4iP',
              order: 2,
              type: 'component',
              direction: 'row',
              flexType: 'auto',
              flexStr: '1 1 auto',
              children: [],
              component: {
                componentType: 'editBillform',
                idRef: '7Qr7imQHM2bULYzpDez6L',
                name: '数据类型',
              },
              pageMaps: [
                {
                  idPageMap: 'f6a0ca1c-6f70-4900-a6f1-f401112312e7',
                  componentStateCode: 'list',
                  pageCode: 'index',
                },
                {
                  idPageMap: 'ff98e8fd-a826-45d1-8c70-ff3b5e160806',
                  componentStateCode: 'form',
                  pageCode: 'edit',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  assos: [
    { idPage: 'index', idLayout: 'root', hidden: false, disabled: false },
    {
      idPage: 'index',
      idLayout: 'x_hgeXRhAkHsQE60jNb5o',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: 'WpqWtGYtXJAx2D650A4iP',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: 'n2Jgu2vIU1NyjpvnPwJQc',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: 'l0y4IQ8ZKIfgtEg-a7Lxs',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: '6Qe5HdllWwHQCzhoEvVhV',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'x_hgeXRhAkHsQE60jNb5o',
      hidden: false,
      disabled: true,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'n2Jgu2vIU1NyjpvnPwJQc',
      hidden: true,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'l0y4IQ8ZKIfgtEg-a7Lxs',
      hidden: true,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: '6Qe5HdllWwHQCzhoEvVhV',
      hidden: true,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'WpqWtGYtXJAx2D650A4iP',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'root',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: 'QNUvZrFbaazGu_Y4hRvYE',
      hidden: true,
      disabled: false,
    },
    {
      idPage: 'index',
      idLayout: 'SfvegLl-GhKk3YVpiVQWh',
      hidden: true,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'QNUvZrFbaazGu_Y4hRvYE',
      hidden: false,
      disabled: false,
    },
    {
      idPage: 'UIi8B9aPjjT25SuLEqrL3',
      idLayout: 'SfvegLl-GhKk3YVpiVQWh',
      hidden: false,
      disabled: false,
    },
  ],
};

export { layoutConf };