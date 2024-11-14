import { DOStatus } from '@/models/enums';
import { moduleName } from '../conf';
import { TModuleStore } from '../models';
/**选择模块数据 */
export const selectModuleStore = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName];
};

/**选择组件树 */
export const selectComponentTree = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].treeData;
};

/**选择组件类型 */
export const selectComponentType = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].componentType;
};
