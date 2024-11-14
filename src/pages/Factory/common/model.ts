export type TCompUpTreeInfo = {
  /**组件类型 */
  componentType?: 'Single' | 'Combination';
  compDisplayName?: string;
  idComponent?: string;
  componentName?: string;
  idComponentModule?: string;
  componentModuleName?: string;
  idSubProject?: string;
  subProjectName?: string;
  idProject?: string;
  projectName?: string;
};

export type TSubProjectUpTreeInfo = {
  idSubProject?: string;
  subProjectName?: string;
  idProject?: string;
  projectName?: string;
};

/**
 * 模块的类型
 */
export type TModuleType = {
  id: string;
  /**ts类型的类名 */
  className: string;
  /**ts类型的类注释名 */
  displayName: string;
  attributes: TAttribute[];
  /**是否主实体 */
  fgMain: boolean;
  mainProperty: string;
};

/**
 * 类型下的属性
 */
export type TAttribute = {
  id: string;
  attributeName: string;
  displayName: string;
  attributeType: string;
  fgPk: boolean;
};
