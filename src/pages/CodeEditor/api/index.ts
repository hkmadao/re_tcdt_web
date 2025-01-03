import * as API from '@/api';
import { TTemplateFile } from '../models';
const TemplateFileAPI = {
  getFileTreeByProjectId: (params: {
    idProject: string;
  }): Promise<TTemplateFile> => {
    return API.GET(`/templateFile/fetchTreeByProjectId`, params);
  },
  getFileByPath: (params: { filePath: string }): Promise<TTemplateFile> => {
    return API.GET(`/templateFile/getFileByPath`, params);
  },
  add: (params: TTemplateFile): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/add`, params);
  },
  updateStatis: (
    params: Omit<TTemplateFile, 'content' | 'children'>,
  ): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/updateStatis`, params);
  },
  updateContent: (
    params: Pick<TTemplateFile, 'parentPathName' | 'fileName' | 'content'>,
  ): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/updateContent`, params);
  },
  remove: (params: TTemplateFile): Promise<TTemplateFile> => {
    return API.POST(`/templateFile/remove`, params);
  },
};

export default TemplateFileAPI;
