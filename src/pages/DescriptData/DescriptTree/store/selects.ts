import { DOStatus } from '@/models/enums';
import { moduleName } from '../conf';
import { TModuleStore } from '../models';
/**选择模块数据 */
export const selectModuleStore = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName];
};

/**选择组件树 */
export const selectDescriptTree = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].treeData;
};
