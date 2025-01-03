import { TProject } from '../models';
import { TDomainStore } from './models';

// const initProject: TProject = {
//   code: 'demo',
//   fileNameType: 'camelCase',
//   templateCode: 'demo_template',
//   idProject: '1',
// };

export const initialState: TDomainStore = {
  status: 'idle',
  fileTree: undefined,
  projects: [],
  selectedKeys: [],
  expandedKeys: [],
  foundKeys: [],
  fgEdit: false,
  // currentProject: initProject,
};
