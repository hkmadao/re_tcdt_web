import { createAsyncThunk } from '@reduxjs/toolkit';
import TemplateFileAPI from '../api';
import { componentName } from '../conf';
import { TDomainStore } from './models';
import { TProject, TTemplateFile } from '../models';
import { message } from 'antd';

export const fetchTreeByProject = createAsyncThunk(
  `/fetchTreeByProject`,
  async (param: TProject, thunkAPI) => {
    const templateFile: TTemplateFile =
      await TemplateFileAPI.getFileTreeByProjectId({
        idProject: param.idProject!,
      });
    return { templateFile, project: param };
  },
);

export const fetchTree = createAsyncThunk(
  `/fetchTree`,
  async (param: void, thunkAPI) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    if (!state.currentProject) {
      message.error('请先选择项目');
      throw new Error('请先选择项目');
    }
    const templateFile: TTemplateFile =
      await TemplateFileAPI.getFileTreeByProjectId({
        idProject: state.currentProject.idProject!,
      });
    // let templateFile: TTemplateFile = {
    //   parentPathName: undefined,
    //   filePathName: 'tcdt_rust',
    //   fileName: 'tcdt_rust',
    //   fgFile: false,
    //   content: '',
    //   children: [
    //     {
    //       parentPathName: 'tcdt_rust',
    //       filePathName: 'tcdt_rust/app_full',
    //       fileName: 'app_full',
    //       fgFile: false,
    //       content: '',
    //       children: [
    //         {
    //           parentPathName: 'tcdt_rust/app_full',
    //           filePathName: 'tcdt_rust/app_full/mysql_template.sql',
    //           fileName: 'mysql_template.sql',
    //           fgFile: true,
    //           content: '-- mysql template\n'.repeat(50),
    //           children: []
    //         }
    //       ]
    //     },
    //     {
    //       parentPathName: 'tcdt_rust',
    //       filePathName: 'tcdt_rust/app_part',
    //       fileName: 'app_part',
    //       fgFile: false,
    //       content: '',
    //       children: [
    //         {
    //           parentPathName: 'tcdt_rust/app_part',
    //           filePathName: 'tcdt_rust/app_part/--_mysql_template.sql',
    //           fileName: '--_mysql_template.sql',
    //           fgFile: true,
    //           content: '-- mysql template',
    //           children: []
    //         }
    //       ]
    //     }
    //   ]
    // };
    return templateFile;
  },
);

export const fetchFile = createAsyncThunk(
  `/fetchFile`,
  async (param: { filePath: string }, thunkAPI) => {
    const templateFile: TTemplateFile = await TemplateFileAPI.getFileByPath(
      param,
    );
    return templateFile;
  },
);

export const addFile = createAsyncThunk(
  `/addFile`,
  async (templateFile: TTemplateFile, thunkAPI) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const saveData: TTemplateFile = await TemplateFileAPI.add(templateFile);
    return saveData;
  },
);

export const saveFileStatis = createAsyncThunk(
  `/saveFileStatis`,
  async (
    templateFile: Omit<TTemplateFile, 'content' | 'children'>,
    thunkAPI,
  ) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const saveData: TTemplateFile = await TemplateFileAPI.updateStatis(
      templateFile,
    );
    return saveData;
  },
);

export const saveFileContent = createAsyncThunk(
  `/updateContent`,
  async (
    templateFile: Pick<
      TTemplateFile,
      'parentPathName' | 'fileName' | 'content'
    >,
    thunkAPI,
  ) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const saveData: TTemplateFile = await TemplateFileAPI.updateContent(
      templateFile,
    );
    return saveData;
  },
);

export const removeFile = createAsyncThunk(
  `/removeFile`,
  async (param: void, thunkAPI) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const selectNode = state.selectedNode;
    if (!selectNode) {
      message.error('未选中节点');
      throw new Error('未选中节点');
    }
    const saveData: TTemplateFile = await TemplateFileAPI.remove(
      treeNodeConvertTemplateFile(selectNode),
    );
    return saveData;
  },
);

const treeNodeConvertTemplateFile = (treeNode: any): TTemplateFile => {
  return {
    parentPathName: treeNode.parentPathName,
    filePathName: treeNode.filePathName,
    fileName: treeNode.fileName,
    fgFile: treeNode.fgFile,
    content: treeNode.content,
    children: [],
  };
};
