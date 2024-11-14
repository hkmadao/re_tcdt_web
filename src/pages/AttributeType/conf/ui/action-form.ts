import { TActionContent } from '@/models';

const actionFormConf: TActionContent | undefined = {
  action: 1,
  displayName: '树表单表单按钮',
  idButtonAction: '0000-0be2b951-041d-4d59-b4ee-6aee87dd6942',
  idProject: '0000-8a8546d0-895e-414b-a722-4f70bfae3548',
  idSubProject: '0000-a4bb91a0-5ab4-41fb-b5c9-0accd88c6ad7',
  name: 'tree_table_edit_action',
  projectName: null,
  subProjectName: '模型管理',
  buttons: [
    {
      label: '保存',
      clickEventName: 'handleSave',
      disableScript: '',
      idButton: 'ueHq5gJXKio3jiy5P-bcI',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
    },
    {
      label: '保存并新增',
      clickEventName: 'handleAddAgain',
      disableScript: '',
      hiddenScript: '!fgAdd',
      idButton: 'DU4_-4ekx5Jc-Z5BmIPxD',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
    },
    {
      label: '取消',
      clickEventName: 'handleCancel',
      disableScript: '',
      idButton: '9TxQkPfN6Xyukc1lyD9_u',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
    },
    {
      label: '刷新',
      clickEventName: 'handleReflesh',
      disableScript: '',
      hiddenScript: 'fgAdd',
      idButton: '4Sjb4fJ21fhztQMH3JuQt',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 3,
    },
  ],
  gap: '10px',
  justifyContent: 'start',
};

export { actionFormConf };
