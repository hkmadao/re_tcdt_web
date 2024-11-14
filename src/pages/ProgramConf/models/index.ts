export const moduleReducerName = 'programConfReducer';

export type TModuleData = {
  idCurrent?: string;
  confDataList: TCodeGenerateConfig[];
};

/**代码目录配置 */
export type TCodeGenerateConfig = {
  id: string;
  name: string;
  fgActive: boolean;
  /**实体组合生成 */
  entityFullPaths: TSubPath[];
  /**实体分散生成 */
  entityPartPaths: TSubPath[];
  /**组合实体组件 */
  componentCombinationPaths: TSubPath[];
  /**单实体组件 */
  componentSinglePaths: TSubPath[];
  /**枚举组件组合生成 */
  componentEnumFullPaths: TSubPath[];
  /**枚举组件分散生成 */
  componentEnumPartPaths: TSubPath[];
  /**DTO 入参组合生成 */
  dtoInputFullPaths: TSubPath[];
  /**DTO 入参分散生成 */
  dtoInputPartPaths: TSubPath[];
  /**DTO 出参组合生成 */
  dtoOutputFullPaths: TSubPath[];
  /**DTO 出参分散生成 */
  dtoOutputPartPaths: TSubPath[];
  /**表单设计 前端生成 */
  uiFactoryPaths: TSubPath[];
};

export type TSubPath = {
  id?: string;
  /**源目录 */
  sourceDir?: string;
  /**目的目录 */
  targetDir: string;
};

export type GenerateType = keyof Omit<
  TCodeGenerateConfig,
  'id' | 'name' | 'fgActive'
>;

export type TPageCode = 'list' | 'form';

export type TDomainStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**当前页面编号 */
  pageCode?: TPageCode;
  data: TModuleData;
};
