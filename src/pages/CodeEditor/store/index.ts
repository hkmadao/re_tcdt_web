import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from '@reduxjs/toolkit';
import { initialState } from './initial-state';
import { componentName } from '../conf';
import {
  addFile,
  fetchFile,
  fetchTree,
  fetchTreeByProject,
  removeFile,
  saveFileContent,
  saveFileStatis,
} from './async-thunk';
import {
  addNodeByParentKey,
  fillTreeKeyByFieldName,
  getChildTree,
  removeNodeByKey,
  updateNode,
} from '@/util';
import { TTree } from '@/models';
import * as reducers from './actions';

export * from './async-thunk';

export const slice = createSlice({
  name: componentName,
  initialState,
  reducers: {
    ...reducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreeByProject.pending, (state, action) => {})
      .addCase(fetchTreeByProject.rejected, (state, action) => {})
      .addCase(fetchTreeByProject.fulfilled, (state, action) => {
        const { templateFile, project } = action.payload;
        const treeData = fillTreeKeyByFieldName(
          'parentPathName',
          'filePathName',
          'fileName',
          [templateFile],
        );
        state.currentProject = project;
        state.sourchTreeData = treeData;
        state.treeData = treeData;
        if (
          treeData &&
          treeData.length > 0 &&
          state.expandedKeys.length === 0
        ) {
          state.expandedKeys = [treeData[0].key];
        }
      })
      .addCase(fetchTree.pending, (state, action) => {})
      .addCase(fetchTree.rejected, (state, action) => {})
      .addCase(fetchTree.fulfilled, (state, action) => {
        const treeData = fillTreeKeyByFieldName(
          'parentPathName',
          'filePathName',
          'fileName',
          [action.payload],
        );
        state.sourchTreeData = treeData;
        state.treeData = treeData;
        if (
          treeData &&
          treeData.length > 0 &&
          state.expandedKeys.length === 0
        ) {
          state.expandedKeys = [treeData[0].key];
        }
      })
      .addCase(fetchFile.pending, (state, action) => {})
      .addCase(fetchFile.rejected, (state, action) => {})
      .addCase(fetchFile.fulfilled, (state, action) => {
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children = getChildTree(treeNode.key, state.sourchTreeData);
          treeNode.children = children;
        }
        updateNode(treeNode, state.sourchTreeData);
        updateNode(treeNode, state.treeData);
      })
      .addCase(addFile.pending, (state, action) => {})
      .addCase(addFile.rejected, (state, action) => {})
      .addCase(addFile.fulfilled, (state, action) => {
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children = getChildTree(treeNode.key, state.sourchTreeData);
          treeNode.children = children;
        }
        addNodeByParentKey(treeNode, state.sourchTreeData);
        addNodeByParentKey(treeNode, state.treeData);
      })
      .addCase(saveFileStatis.pending, (state, action) => {})
      .addCase(saveFileStatis.rejected, (state, action) => {})
      .addCase(saveFileStatis.fulfilled, (state, action) => {
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children =
            getChildTree(treeNode.key, state.sourchTreeData) || [];
          const newChildren = children.map((child) => {
            return recursionUpdateStatis(treeNode, child);
          });
          treeNode.children = newChildren;
        } else {
          state.currentFile = templateFile;
        }
        updateNode(treeNode, state.sourchTreeData);
        updateNode(treeNode, state.treeData);

        state.fgEdit = false;
      })
      .addCase(saveFileContent.pending, (state, action) => {})
      .addCase(saveFileContent.rejected, (state, action) => {})
      .addCase(saveFileContent.fulfilled, (state, action) => {
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          children: [],
        };

        updateNode(treeNode, state.sourchTreeData);
        updateNode(treeNode, state.treeData);

        state.currentFile = templateFile;
        state.fgEdit = false;
      })
      .addCase(removeFile.pending, (state, action) => {})
      .addCase(removeFile.rejected, (state, action) => {})
      .addCase(removeFile.fulfilled, (state, action) => {
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          children: [],
        };
        removeNodeByKey(treeNode.key, state.sourchTreeData);
        removeNodeByKey(treeNode.key, state.treeData);
        state.selectedKeys = [];
        state.currentFile = undefined;
      });
  },
});

export const actions = slice.actions;

const reducer: any = {};
reducer[slice.name] = slice.reducer;

export default configureStore({
  reducer: {
    ...reducer,
  },
});

const recursionUpdateStatis = (parentTemplateFile: TTree, child: TTree) => {
  return {
    ...child,
    idParent: parentTemplateFile.filePathName,
    key: parentTemplateFile.filePathName + '/' + child.fileName,
    parentPathName: parentTemplateFile.filePathName,
    filePathName: parentTemplateFile.filePathName + '/' + child.fileName,
  };
};
