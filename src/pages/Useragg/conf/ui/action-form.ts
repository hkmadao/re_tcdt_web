import { TActionContent } from '@/models';

const actionFormConf: TActionContent | undefined = {
  action: 1,
  idButtonAction: '0000-e17f1494-779f-46a2-9096-03598277a0f9',
  name: 'table_edit_action',
  displayName: '表单编辑按钮',
  idProject: '0000-8a8546d0-895e-414b-a722-4f70bfae3548',
  idSubProject: '0000-a4bb91a0-5ab4-41fb-b5c9-0accd88c6ad7',
  subProjectName: '模型管理',
  gap: '10px',
  justifyContent: 'start',
  buttons: [
    {
      label: '保存',
      clickEventName: 'handleSave',
      disableScript: '',
      idButton: 'sI5tS0d7ihw9j5-YG0r1B',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
    },
    {
      label: '保存并新增',
      clickEventName: 'handleAddAgain',
      disableScript: '',
      hiddenScript: '!fgAdd',
      idButton: 'ug5xSgA8KYPlF_vQXB4hn',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
    },
    {
      label: '取消',
      clickEventName: 'handleCancel',
      disableScript: '',
      idButton: 'Gs8JqPNCBIi4DGkpI2fjT',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
    },
    {
      label: '刷新',
      clickEventName: 'handleReflesh',
      disableScript: '',
      hiddenScript: '!fgAdd',
      idButton: 'HMzkOgJVcEj1a6x8oUFBn',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 3,
    },
  ],
};

export { actionFormConf };
