import * as API from '@/api';
import { TTemplateFile } from '../models';
const TemplateFileAPI = {
  getFileTreeByProjectId: (params: {
    idProject: string;
  }): Promise<TTemplateFile> => {
    return API.GET(`/templateFile/getTreeByProjectId`, params);
  },
  getFileByPath: (params: {
    idProject: string;
    filePath: string;
  }): Promise<TTemplateFile> => {
    return API.GET(`/templateFile/getFileByPath`, params);
  },
  add: (params: TTemplateFile): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/add`, params);
  },
  updateStat: (
    params: Omit<TTemplateFile, 'content' | 'children'>,
  ): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/updateStat`, params);
  },
  updateContent: (
    params: Pick<
      TTemplateFile,
      'idProject' | 'parentPathName' | 'fileName' | 'content'
    >,
  ): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/updateContent`, params);
  },
  remove: (params: TTemplateFile): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/remove`, params);
  },
};

export default TemplateFileAPI;
