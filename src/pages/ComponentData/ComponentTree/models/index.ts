import { Key } from 'react';
import { EnumTreeNodeType } from '../conf';

export * from './project';

/**
 * 项目树
 */
export type TTree = {
  key: string;
  title?: string;
  /**树id */
  id?: string;
  /**父模块id */
  idParent?: string;
  /**子模块集合 */
  children?: TTree[];
  /** 树级别 */
  level?: EnumTreeNodeType;
  /**是否禁用 */
  disabled?: boolean;
  /**名称 */
  name?: string;
  /**显示名称 */
  displayName?: string;
  /**子项目路径 */
  path?: string;
  /**组件类型 */
  componentType?: 'Single' | 'Combination' | 'Enum';
  /**包名称 */
  packageName?: string;
};

export type TModuleStore = {
  /**子项目ui信息 */
  // moduleUi: TModuleUi;
  /**组件类型 */
  componentType:
    | EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION
    | EnumTreeNodeType.COMPONENT_EO_COLLECTION;
  /**树的原始数据 */
  sourchTreeData?: TTree[];
  /**当前树的数据 */
  treeData: TTree[];
  selectedNode?: TTree;
  selectedKeys: Key[];
  expandedKeys: Key[];
  foundKeys: Key[];
};
