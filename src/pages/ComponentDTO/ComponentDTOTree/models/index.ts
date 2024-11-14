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
};

export type TModuleStore = {
  /**组件类型 */
  componentType:
    | EnumTreeNodeType.DTO_COLLECTION
    | EnumTreeNodeType.SD_COLLECTION;
  /**树的原始数据 */
  sourchTreeData?: TTree[];
  /**当前树的数据 */
  treeData: TTree[];
  selectedNode?: TTree;
  selectedKeys: Key[];
  expandedKeys: Key[];
  foundKeys: Key[];
};
