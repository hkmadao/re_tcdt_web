import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TDtoModule, TSimpleDtoEntityCollection, TTree } from '../models';
import { EnumTreeNodeType, moduleName } from '../conf';
import { initialState, rootTree } from './initial-state';
import {
  addCollection,
  addDtoModule,
  fetchDtoProjectTree,
  removeCollection,
  removeDtoModule,
  searchTreeNode,
  updateDtoModule,
} from './async-thunk';
import {
  addNodeByParentKey,
  deepCopy,
  fillTreeKey,
  getTreeByKeys,
  getTreeParentKeys,
  removeNodeByKey,
  updateNode,
} from '@/util';
import { TDtoEntity, TDtoEnum } from '../../ComponentDTODesign/models';
import { Key } from 'react';
import * as reducers from './actions';

export * from './async-thunk';
export * from './selects';

export const treeSlice = createSlice({
  name: moduleName,
  initialState,
  reducers: {
    /**设置树节点类型 */
    setComponentTypes: (
      state,
      action: PayloadAction<
        EnumTreeNodeType.DTO_COLLECTION | EnumTreeNodeType.SD_COLLECTION
      >,
    ) => {
      state.componentType = action.payload;
    },
    ...reducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDtoProjectTree.pending, (state, action) => {})
      .addCase(fetchDtoProjectTree.rejected, (state, action) => {})
      .addCase(fetchDtoProjectTree.fulfilled, (state, action) => {
        const treeArr = action.payload;
        const datas = fillTreeKey(treeArr);
        const newTreeData = [{ ...rootTree, children: datas }];
        state.sourchTreeData = JSON.parse(JSON.stringify(newTreeData));
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = [rootTree.key];
      })
      .addCase(searchTreeNode.pending, (state, action) => {})
      .addCase(searchTreeNode.rejected, (state, action) => {})
      .addCase(searchTreeNode.fulfilled, (state, action) => {
        const { searchValue, entities, enums } = action.payload;
        if (!searchValue) {
          return;
        }
        const treeData1 = fillEntityResult(
          state.sourchTreeData ?? [],
          entities ?? [],
        );
        const treeData2 = fillEnumResult(treeData1 ?? [], enums ?? []);
        const foundKeys = getMatchKeys(searchValue, treeData2 || []);
        const foundTree = getTreeByKeys(foundKeys, treeData2 || []);
        state.expandedKeys = getTreeParentKeys(foundTree);
        state.foundKeys = foundKeys;
        state.treeData = foundTree;
        if (foundTree.length === 0) {
          const newTreeData: TTree[] = [{ ...rootTree, children: [] }];
          state.treeData = newTreeData;
        }
      })
      .addCase(addDtoModule.pending, (state, action) => {})
      .addCase(addDtoModule.rejected, (state, action) => {})
      .addCase(addDtoModule.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TDtoModule = {
          key: saveAfter.idDtoModule!,
          id: saveAfter.idDtoModule!,
          idParent: saveAfter.idSubProject,
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.DTO_MODULE,
          path: saveAfter.path,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes(saveAfter.idSubProject!)) {
          state.expandedKeys.push(saveAfter.idSubProject!);
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(updateDtoModule.pending, (state, action) => {})
      .addCase(updateDtoModule.rejected, (state, action) => {})
      .addCase(updateDtoModule.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TDtoModule = {
          key: saveAfter.idDtoModule!,
          id: saveAfter.idDtoModule!,
          idParent: saveAfter.idSubProject,
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.DTO_MODULE,
          path: saveAfter.path,
          children: [],
        };
        const newSourceTreeData = updateNode(treeNode, state.sourchTreeData);
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = updateNode(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeDtoModule.pending, (state, action) => {})
      .addCase(removeDtoModule.rejected, (state, action) => {})
      .addCase(removeDtoModule.fulfilled, (state, action) => {
        const removeData = action.payload;
        const newSourceTreeData = removeNodeByKey(
          removeData.idDtoModule!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          removeData.idDtoModule!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== removeData.idDtoModule,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== removeData.idDtoModule,
        );
      })
      .addCase(addCollection.pending, (state, action) => {})
      .addCase(addCollection.rejected, (state, action) => {})
      .addCase(addCollection.fulfilled, (state, action) => {
        const { status, data, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const saveAfter = data as TSimpleDtoEntityCollection;
        const treeNode: TTree = {
          key: saveAfter.idDtoEntityCollection!,
          id: saveAfter.idDtoEntityCollection!,
          idParent: saveAfter.idDtoModule,
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.DTO_COLLECTION,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes(saveAfter.idDtoModule!)) {
          state.expandedKeys.push(saveAfter.idDtoModule!);
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeCollection.pending, (state, action) => {})
      .addCase(removeCollection.rejected, (state, action) => {})
      .addCase(removeCollection.fulfilled, (state, action) => {
        const { status, data: removeData, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const newSourceTreeData = removeNodeByKey(
          removeData.idDtoEntityCollection!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          removeData.idDtoEntityCollection!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== removeData.idDtoEntityCollection,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== removeData.idDtoEntityCollection,
        );
      });
  },
});

const fillEntityResult = (treeData: TTree[], entities: TDtoEntity[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    entities.forEach((entity) => {
      if (t.id === entity.idDtoEntityCollection) {
        const tAdd: TTree = {
          ...entity,
          id: entity.idDtoEntity,
          idParent: tree.id,
          key: entity.idDtoEntity,
          displayName: entity.tableName + ' ' + entity.displayName,
          level: EnumTreeNodeType.ENTITY_LEVEL,
        };
        t.children?.push(deepCopy(tAdd));
      }
    });
    const childResult = fillEntityResult(tree.children ?? [], entities);
    t.children?.push(...childResult);
    result.push(t);
  });
  return result;
};

const fillEnumResult = (treeData: TTree[], enums: TDtoEnum[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    enums.forEach((entity) => {
      const tAdd: TTree = {
        ...entity,
        id: entity.idDtoEnum,
        idParent: tree.id,
        key: entity.idDtoEnum,
        displayName: entity.className + ' ' + entity.displayName,
        level: EnumTreeNodeType.ENUM_LEVEL,
      };
      if (t.id === entity.idDtoEntityCollection) {
        t.children?.push(deepCopy(tAdd));
      }
    });
    const childResult = fillEnumResult(tree.children ?? [], enums);
    t.children?.push(...childResult);
    result.push(t);
  });
  return result;
};

export const getMatchKeys = (searchValue: string, tree: TTree[]): Key[] => {
  const foundKeys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const childResult = getMatchKeys(searchValue, node.children ?? []);
    if (childResult.length > 0) {
      foundKeys.push(...childResult);
    }
    if (
      node.level === EnumTreeNodeType.ENTITY_LEVEL ||
      node.level === EnumTreeNodeType.ENUM_LEVEL
    ) {
      if (!foundKeys.includes(node.key)) {
        foundKeys.push(node.key);
      }
    } else {
      if (node.displayName && node.displayName.indexOf(searchValue) > -1) {
        if (!foundKeys.includes(node.key)) {
          foundKeys.push(node.key);
        }
      }
    }
  }
  return foundKeys;
};

export const actions = treeSlice.actions;

export default treeSlice;
