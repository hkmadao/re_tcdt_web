import { TActionContent } from '@/models';

const actionFormConf: TActionContent | undefined = {
  action: 1,
  displayName: '树表单按钮',
  idButtonAction: '_cWBpq9kJwJMQbnRf2oe4',
  idProject: '0000-fe135b87-fb33-481f-81a6-53dff1808f43',
  idSubProject: '0000-bb004a40-3b38-4c9c-9f30-b69a543b0598',
  name: 'TreeFormAction',
  projectName: null,
  subProjectName: '模型管理',
  gap: '10px',
  justifyContent: 'start',
  buttons: [
    {
      label: '保存',
      clickEventName: 'handleSave',
      disableScript: 'componentFgDiabled',
      idButton: 'oCen_AWx0nenqL9oRVJSS',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 0,
    },
    {
      label: '取消',
      clickEventName: 'handleCancel',
      disableScript: 'componentFgDiabled',
      idButton: 'vgfMdkaa96AKvualg8Idn',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 1,
    },
    {
      label: '刷新',
      clickEventName: 'handleReflesh',
      disableScript: 'componentFgDiabled',
      hiddenScript: '!fgAdd',
      idButton: '9ydSqUoHcwjDQuBsXzimj',
      buttonSize: 'middle',
      type: 'primary',
      showOrder: 2,
    },
  ],
};

export { actionFormConf };
