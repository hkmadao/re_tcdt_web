import { TActionContent } from '@/models';

const actionTableConf: TActionContent | undefined = {
  action: 1,
  displayName: '树表单列表按钮',
  idButtonAction: '0000-4f072373-519c-4e78-9509-f0761fce4197',
  idProject: '0000-8a8546d0-895e-414b-a722-4f70bfae3548',
  idSubProject: '0000-a4bb91a0-5ab4-41fb-b5c9-0accd88c6ad7',
  name: 'tree_table_list_action',
  projectName: '模板代码设计工具',
  subProjectName: '模型管理',
  buttons: [
    {
      label: '新增',
      clickEventName: 'handleToAdd',
      disableScript: '',
      idButton: 'k2iRCg3iOfisxH1RSaVgL',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
      nameScript: "'新增'",
    },
    {
      label: '编辑',
      clickEventName: 'handleToEdit',
      disableScript: 'selectRows?.length !== 1',
      idButton: 'GXOO6sN6sfo4_Cb9uyADv',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
      nameScript: "'编辑'",
    },
    {
      label: '删除',
      clickEventName: 'handleRowsDelete',
      disableScript: 'selectRows?.length == 0',
      idButton: '3TuGkHSTfsfHu_BZ_hLGo',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
      nameScript: "'删除'",
    },
    {
      label: '单选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'radio'",
      idButton: '4hL9QGB7OIbdIWVAR3w2f',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 3,
      nameScript: "'单选'",
    },
    {
      label: '多选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'checkbox'",
      idButton: 'U7iJt9UmZycN5sMcZJYvH',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 4,
      nameScript: "'多选'",
    },
    {
      label: '刷新',
      clickEventName: 'handleReflesh',
      disableScript: '',
      hiddenScript: '',
      idButton: 'AQtjiv8ScrTb5lPd3M0Ga',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 5,
      nameScript: "'刷新'",
    },
  ],
  gap: '10px',
  justifyContent: 'start',
};

export { actionTableConf };
