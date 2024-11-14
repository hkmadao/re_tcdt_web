import { EnumTreeNodeType } from '../conf';
import { TModuleStore, TTree } from '../models';

export const rootTree: TTree = {
  key: '0',
  title: '系统合集',
  id: '0',
  displayName: '系统合集',
  children: [],
  level: EnumTreeNodeType.ROOT,
};

export const initialState: TModuleStore = {
  componentType: EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION,
  selectedKeys: [],
  expandedKeys: [],
  foundKeys: [],
  sourchTreeData: [{ ...rootTree, children: [] }],
  treeData: [{ ...rootTree, children: [] }],
};