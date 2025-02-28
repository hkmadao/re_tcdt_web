import { TActionContent } from '@/models';

const actionTableConf: TActionContent | undefined = {
  action: 1,
  displayName: '表单列表按钮',
  idButtonAction: '0000-be9070b2-6fb9-487a-8fcc-0abc34fdbf39',
  idProject: '0000-8a8546d0-895e-414b-a722-4f70bfae3548',
  idSubProject: '0000-a4bb91a0-5ab4-41fb-b5c9-0accd88c6ad7',
  name: 'table_list_action',
  projectName: '模板代码设计工具',
  subProjectName: '模型管理',
  buttons: [
    {
      label: '新增',
      clickEventName: 'handleToAdd',
      disableScript: '',
      idButton: 'Yaemso7Bx8TnTKyAL5p08',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
      nameScript: "'新增'",
    },
    {
      label: '编辑',
      clickEventName: 'handleToEdit',
      disableScript: 'selectRows?.length !== 1',
      idButton: 'xbjAsQ1gFa9KcJaMNGIRw',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
      nameScript: "'编辑'",
    },
    {
      label: '单选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'radio'",
      idButton: 'NNJXyz0Rnc5_v6K8DKAIi',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
      nameScript: "'单选'",
    },
    {
      label: '多选',
      clickEventName: 'handleRowSelectType',
      disableScript: '',
      hiddenScript: "rowSelectionType === 'checkbox'",
      idButton: 'XbFycueAxA7_07UuDg8SW',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 3,
      nameScript: "'多选'",
    },
    {
      label: '删除',
      clickEventName: 'handleRowsDelete',
      disableScript: 'selectRows?.length == 0',
      idButton: 'ptRZSv-d68ViqVt7iqJdj',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 4,
      nameScript: "'删除'",
    },
    {
      label: '刷新',
      clickEventName: 'handleReflesh',
      disableScript: '',
      hiddenScript: '',
      idButton: '54GGZiQyODGo3UkDLYj3A',
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
