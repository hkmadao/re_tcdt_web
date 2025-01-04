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
  saveFileStat,
} from './async-thunk';
import {
  addNodeByParentKey,
  fillTreeKeyByFieldName,
  getChildTree,
  getTreeKeys,
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
      .addCase(fetchTreeByProject.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTreeByProject.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchTreeByProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
        state.selectedKeys = [];
        state.selectedNode = undefined;
        if (treeData && treeData.length > 0) {
          state.expandedKeys = [treeData[0].key];
        } else {
          state.expandedKeys = [];
        }
      })
      .addCase(fetchTree.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTree.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchTree.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
      .addCase(fetchFile.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFile.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { keys, templateFile } = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          title: templateFile.fileName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children = getChildTree(treeNode.key, state.sourchTreeData);
          treeNode.children = children;
        }
        state.selectedNode = treeNode;
        state.selectedKeys = keys;
        state.sourchTreeData = updateNode(treeNode, state.sourchTreeData);
        state.treeData = updateNode(treeNode, state.treeData);
      })
      .addCase(addFile.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addFile.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(addFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          content: '',
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          title: templateFile.fileName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children = getChildTree(treeNode.key, state.sourchTreeData);
          treeNode.children = children;
        }
        state.sourchTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.treeData = addNodeByParentKey(treeNode, state.treeData);
      })
      .addCase(saveFileStat.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(saveFileStat.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(saveFileStat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          title: templateFile.fileName,
          filePathName: templateFile.filePathName,
          children: [],
        };
        if (!templateFile.fgFile) {
          const children =
            getChildTree(templateFile.oldFilePathName!, state.sourchTreeData) ||
            [];
          const childrenKeys = getTreeKeys(children);
          state.expandedKeys = state.expandedKeys.filter(
            (k) => !childrenKeys.includes(k),
          );
          const newChildren = children.map((child) => {
            return recursionUpdateStat(treeNode, child);
          });
          treeNode.children = newChildren;
        }

        //remove old node
        state.sourchTreeData = removeNodeByKey(
          templateFile.oldFilePathName!,
          state.sourchTreeData,
        );
        state.treeData = removeNodeByKey(
          templateFile.oldFilePathName!,
          state.treeData,
        );
        //add new node
        state.sourchTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.treeData = addNodeByParentKey(treeNode, state.treeData);

        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
        if (state.expandedKeys.includes(templateFile.oldFilePathName!)) {
          state.expandedKeys = state.expandedKeys.filter(
            (k) => k !== templateFile.oldFilePathName!,
          );
          state.expandedKeys.push(treeNode.key);
        }

        state.fgEdit = false;
      })
      .addCase(saveFileContent.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(saveFileContent.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(saveFileContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          title: templateFile.fileName,
          children: [],
        };

        state.sourchTreeData = updateNode(treeNode, state.sourchTreeData);
        state.treeData = updateNode(treeNode, state.treeData);

        state.selectedNode = treeNode;
        state.fgEdit = false;
      })
      .addCase(removeFile.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(removeFile.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(removeFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const templateFile = action.payload;
        let treeNode: TTree = {
          ...templateFile,
          key: templateFile.filePathName,
          idParent: templateFile.parentPathName,
          title: templateFile.fileName,
          children: [],
        };
        state.sourchTreeData = removeNodeByKey(
          treeNode.key,
          state.sourchTreeData,
        );
        state.treeData = removeNodeByKey(treeNode.key, state.treeData);
        state.selectedKeys = [];
        state.selectedNode = undefined;
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== treeNode.key,
        );
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

const recursionUpdateStat = (parentTemplateFile: TTree, child: TTree) => {
  let newChild: TTree = {
    ...child,
    idParent: parentTemplateFile.filePathName,
    key: parentTemplateFile.filePathName + '/' + child.fileName,
    parentPathName: parentTemplateFile.filePathName,
    filePathName: parentTemplateFile.filePathName + '/' + child.fileName,
  };
  if (child.children) {
    newChild.children = child.children.map((c) => {
      return recursionUpdateStat(newChild, c);
    });
  }
  return newChild;
};
