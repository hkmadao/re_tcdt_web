import { createAsyncThunk } from '@reduxjs/toolkit';
import TemplateFileAPI from '../api';
import { componentName } from '../conf';
import { TDomainStore } from './models';
import { TProject, TTemplateFile } from '../models';
import { message } from 'antd';
import { TTree } from '@/models';
import { Key } from 'react';

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
    return templateFile;
  },
);

export const fetchFile = createAsyncThunk(
  `/fetchFile`,
  async (param: { keys: Key[]; node: TTree }, thunkAPI) => {
    const { keys, node } = param;
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const idProject = state.currentProject?.idProject;
    if (idProject === undefined) {
      message.error('未选择项目');
      throw new Error('未选择项目');
    }
    const templateFile: TTemplateFile = await TemplateFileAPI.getFileByPath({
      idProject,
      filePath: node.filePathName,
    });
    return { keys, templateFile };
  },
);

export const addFile = createAsyncThunk(
  `/addFile`,
  async (templateFile: TTemplateFile, thunkAPI) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const idProject = state.currentProject?.idProject;
    if (idProject === undefined) {
      message.error('未选择项目');
      throw new Error('未选择项目');
    }
    const filePathName =
      templateFile.parentPathName + '/' + templateFile.fileName;
    const saveData: TTemplateFile = await TemplateFileAPI.add({
      ...templateFile,
      idProject,
      filePathName,
    });
    return saveData;
  },
);

export const saveFileStat = createAsyncThunk(
  `/saveFileStat`,
  async (
    templateFile: Omit<TTemplateFile, 'content' | 'children'>,
    thunkAPI,
  ) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const idProject = state.currentProject?.idProject;
    if (idProject === undefined) {
      message.error('未选择项目');
      throw new Error('未选择项目');
    }
    const selectedNode = state.selectedNode;
    const oldFilePathName = templateFile.filePathName;
    const filePathName =
      oldFilePathName.substring(0, oldFilePathName.lastIndexOf('/') + 1) +
      templateFile.fileName;
    const saveData: TTemplateFile = await TemplateFileAPI.updateStat({
      ...templateFile,
      idProject,
      oldFilePathName,
      filePathName,
    });
    let afterSave: TTemplateFile = {
      ...saveData,
    };
    if (selectedNode) {
      afterSave.content = selectedNode.content;
    }
    return afterSave;
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
    const idProject = state.currentProject?.idProject;
    if (idProject === undefined) {
      message.error('未选择项目');
      throw new Error('未选择项目');
    }
    const saveData: TTemplateFile = await TemplateFileAPI.updateContent({
      idProject,
      ...templateFile,
    });
    return saveData;
  },
);

export const removeFile = createAsyncThunk(
  `/removeFile`,
  async (param: void, thunkAPI) => {
    const state: TDomainStore = (thunkAPI.getState() as any)[componentName];
    const idProject = state.currentProject?.idProject;
    if (idProject === undefined) {
      message.error('未选择项目');
      throw new Error('未选择项目');
    }
    const selectNode = state.selectedNode;
    if (!selectNode) {
      message.error('未选中节点');
      throw new Error('未选中节点');
    }
    const saveData: TTemplateFile = await TemplateFileAPI.remove(
      treeNodeConvertTemplateFile(idProject, selectNode),
    );
    return saveData;
  },
);

const treeNodeConvertTemplateFile = (
  idProject: string,
  treeNode: any,
): TTemplateFile => {
  return {
    idProject,
    parentPathName: treeNode.parentPathName,
    filePathName: treeNode.filePathName,
    fileName: treeNode.fileName,
    fgFile: treeNode.fgFile,
    content: treeNode.content,
    children: [],
  };
};
