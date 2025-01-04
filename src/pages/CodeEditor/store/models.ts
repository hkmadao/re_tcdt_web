import { TTree } from '@/models';
import { TProject, TTemplateFile } from '../models';
import { Key } from 'react';

export type TDomainStore = {
  /**页面状态 */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /**项目列表 */
  projects: TProject[];
  currentProject?: TProject;
  /**文件树 */
  fileTree?: TTemplateFile;
  /**树的原始数据 */
  sourchTreeData?: TTree[];
  /**当前树的数据 */
  treeData?: TTree[];
  selectedNode?: TTree;
  selectedKeys: Key[];
  expandedKeys: Key[];
  foundKeys: Key[];
  fgEdit: boolean;
};
