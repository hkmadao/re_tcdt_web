/**按钮配置 */
export type TButton = {
  idButton: string;
  buttonSize: 'small' | 'middle' | 'large' | undefined;
  type: string;
  label: string;
  clickEventName: string;
  nameScript: string;
  disableScript: string;
  hiddenScript: string;
  showOrder: number;
};

type TActionCommon = {
  idButtonAction?: string;
  /**所属项目id */
  idProject?: string;
  projectName?: string;
  /**所属子项目id */
  idSubProject?: string;
  subProjectName?: string;
  /**所属组件模块id */
  idComponentModule?: string;
  componentModuleName?: string;
  /**所属方案id */
  idComponent?: string;
  /**组件名称 */
  componentName?: string;
  name?: string;
  displayName?: string;
};

export type TAction = {
  content?: string;
} & TActionCommon;

export type TActionContent = {
  /**按钮间的间隔 */
  gap: string;
  /**内容排列方式 */
  justifyContent: string;
  /**按钮配置 */
  buttons: TButton[];
} & TActionCommon;

export type TModuleStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  data: TActionContent;
  current?: {
    type: 'field' | 'panel';
    id: string;
  };
};

export type DropResult = {
  name: string;
};
