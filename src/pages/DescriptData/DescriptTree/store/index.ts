import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumTreeNodeType, moduleName } from '../conf';
import {
  addNodeByParentKey,
  deepCopy,
  fillTreeKey,
  getTreeByKeys,
  getTreeParentKeys,
  removeNodeByKey,
  updateNode,
} from '@/util';
import { initialState, rootTree } from './initial-state';
import {
  addCollection,
  addModule,
  addProject,
  fetchEntityProjectTree,
  removeCollection,
  removeModule,
  removeProject,
  searchTreeNode,
  updateModule,
  updateProject,
} from './async-thunk';
import { TProject, TSimpleEntityCollection, TTree } from '../models';
import { TEntity, TEnum } from '../../DescriptDesign/models';
import { Key } from 'react';
import * as reducers from './actions';
import { TcdtType } from '@/models';

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
        EnumTreeNodeType.ENTITY_COLLECTION | EnumTreeNodeType.SD_COLLECTION
      >,
    ) => {
      state.componentType = action.payload;
    },
    ...reducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntityProjectTree.pending, (state, action) => {})
      .addCase(fetchEntityProjectTree.rejected, (state, action) => {})
      .addCase(fetchEntityProjectTree.fulfilled, (state, action) => {
        const treeArr = action.payload;

        const datas = fillTreeKey(treeArr);
        const newTreeData: TTree[] = [{ ...rootTree, children: datas }];
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
      .addCase(addProject.pending, (state, action) => {})
      .addCase(addProject.rejected, (state, action) => {})
      .addCase(addProject.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TProject = {
          key: saveAfter.idProject!,
          id: saveAfter.idProject!,
          idParent: '0',
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.PROJECT,
          templateCode: saveAfter.templateCode,
          webTemplateCode: saveAfter.webTemplateCode,
          fileNameType: saveAfter.fileNameType,
          code: saveAfter.code,
          note: saveAfter.note,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes('0')) {
          state.expandedKeys.push('0');
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(updateProject.pending, (state, action) => {})
      .addCase(updateProject.rejected, (state, action) => {})
      .addCase(updateProject.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TProject = {
          key: saveAfter.idProject!,
          id: saveAfter.idProject!,
          idParent: '0',
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.PROJECT,
          templateCode: saveAfter.templateCode,
          webTemplateCode: saveAfter.webTemplateCode,
          fileNameType: saveAfter.fileNameType,
          code: saveAfter.code,
          note: saveAfter.note,
          children: [],
        };
        const newSourceTreeData = updateNode(treeNode, state.sourchTreeData);
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = updateNode(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeProject.pending, (state, action) => {})
      .addCase(removeProject.rejected, (state, action) => {})
      .addCase(removeProject.fulfilled, (state, action) => {
        const removeData = action.payload;
        const newSourceTreeData = removeNodeByKey(
          removeData.idProject!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          removeData.idProject!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== removeData.idProject,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== removeData.idProject,
        );
      })
      .addCase(addModule.pending, (state, action) => {})
      .addCase(addModule.rejected, (state, action) => {})
      .addCase(addModule.fulfilled, (state, action) => {
        const componentModule = action.payload;
        const treeNode: TTree = {
          key: componentModule.idSubProject!,
          id: componentModule.idSubProject!,
          idParent: componentModule.idProject,
          title: componentModule.displayName,
          displayName: componentModule.displayName,
          level: EnumTreeNodeType.SUB_PROJECT,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes(componentModule.idProject!)) {
          state.expandedKeys.push(componentModule.idProject!);
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(updateModule.pending, (state, action) => {})
      .addCase(updateModule.rejected, (state, action) => {})
      .addCase(updateModule.fulfilled, (state, action) => {
        const componentModule = action.payload;
        const treeNode: TTree = {
          key: componentModule.idSubProject!,
          id: componentModule.idSubProject!,
          idParent: componentModule.idProject,
          title: componentModule.displayName,
          displayName: componentModule.displayName,
          level: EnumTreeNodeType.SUB_PROJECT,
          children: [],
        };
        const newSourceTreeData = updateNode(treeNode, state.sourchTreeData);
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = updateNode(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeModule.pending, (state, action) => {})
      .addCase(removeModule.rejected, (state, action) => {})
      .addCase(removeModule.fulfilled, (state, action) => {
        const componentModule = action.payload;
        const newSourceTreeData = removeNodeByKey(
          componentModule.idSubProject!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          componentModule.idSubProject!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== componentModule.idSubProject,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== componentModule.idSubProject,
        );
      })
      .addCase(addCollection.pending, (state, action) => {})
      .addCase(addCollection.rejected, (state, action) => {})
      .addCase(addCollection.fulfilled, (state, action) => {
        const { status, data, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const component = data as TSimpleEntityCollection;
        const treeNode: TTree = {
          key: component.idEntityCollection!,
          id: component.idEntityCollection!,
          idParent: component.idSubProject,
          title: component.displayName,
          displayName: component.displayName,
          level: EnumTreeNodeType.ENTITY_COLLECTION,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes(component.idSubProject!)) {
          state.expandedKeys.push(component.idSubProject!);
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeCollection.pending, (state, action) => {})
      .addCase(removeCollection.rejected, (state, action) => {})
      .addCase(removeCollection.fulfilled, (state, action) => {
        const { status, data: component, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const newSourceTreeData = removeNodeByKey(
          component.idEntityCollection!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          component.idEntityCollection!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== component.idEntityCollection,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== component.idEntityCollection,
        );
      });
  },
});

const fillEntityResult = (treeData: TTree[], entities: TEntity[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    entities.forEach((entity) => {
      if (t.id === entity.idEntityCollection) {
        const tAdd: TTree = {
          ...entity,
          id: entity.idEntity,
          idParent: tree.id,
          key: entity.idEntity,
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

const fillEnumResult = (treeData: TTree[], enums: TEnum[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    enums.forEach((entity) => {
      const tAdd: TTree = {
        ...entity,
        id: entity.idEnum,
        idParent: tree.id,
        key: entity.idEnum,
        displayName: entity.className + ' ' + entity.displayName,
        level: EnumTreeNodeType.ENUM_LEVEL,
      };
      if (t.id === entity.idEntityCollection) {
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
