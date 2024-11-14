import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TComponentModule, TTree } from '../models';
import { EnumTreeNodeType, moduleName } from '../conf';
import { initialState, rootTree } from './initial-state';
import * as reducers from './actions';
import {
  addComponent,
  addComponentModule,
  fetchComponentProjectTree,
  removeComponent,
  removeComponentModule,
  searchTreeNode,
  updateComponentModule,
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
import {
  TComponent,
  TComponentEntity,
  TComponentEnum,
} from '../../ComponentDesign/models';
import { Key } from 'react';
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
        | EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION
        | EnumTreeNodeType.COMPONENT_EO_COLLECTION
      >,
    ) => {
      state.componentType = action.payload;
    },
    ...reducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponentProjectTree.pending, (state, action) => {})
      .addCase(fetchComponentProjectTree.rejected, (state, action) => {})
      .addCase(fetchComponentProjectTree.fulfilled, (state, action) => {
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
      .addCase(addComponentModule.pending, (state, action) => {})
      .addCase(addComponentModule.rejected, (state, action) => {})
      .addCase(addComponentModule.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TComponentModule = {
          key: saveAfter.idComponentModule!,
          id: saveAfter.idComponentModule!,
          idParent: saveAfter.idSubProject,
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.COMPONENT_MODULE,
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
      .addCase(updateComponentModule.pending, (state, action) => {})
      .addCase(updateComponentModule.rejected, (state, action) => {})
      .addCase(updateComponentModule.fulfilled, (state, action) => {
        const saveAfter = action.payload;
        const treeNode: TTree & TComponentModule = {
          key: saveAfter.idComponentModule!,
          id: saveAfter.idComponentModule!,
          idParent: saveAfter.idSubProject,
          title: saveAfter.displayName,
          displayName: saveAfter.displayName,
          level: EnumTreeNodeType.COMPONENT_MODULE,
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
      .addCase(removeComponentModule.pending, (state, action) => {})
      .addCase(removeComponentModule.rejected, (state, action) => {})
      .addCase(removeComponentModule.fulfilled, (state, action) => {
        const componentModule = action.payload;
        const newSourceTreeData = removeNodeByKey(
          componentModule.idComponentModule!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          componentModule.idComponentModule!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== componentModule.idComponentModule,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== componentModule.idComponentModule,
        );
      })
      .addCase(addComponent.pending, (state, action) => {})
      .addCase(addComponent.rejected, (state, action) => {})
      .addCase(addComponent.fulfilled, (state, action) => {
        const { status, data, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const component = data as TComponent;
        const treeNode: TTree = {
          key: component.idComponent!,
          id: component.idComponent!,
          idParent: component.idComponentModule,
          title: component.displayName,
          displayName: component.displayName,
          level: EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION,
          componentType: component.componentType as any,
          children: [],
        };
        const newSourceTreeData = addNodeByParentKey(
          treeNode,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = addNodeByParentKey(treeNode, state.treeData);
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        if (!state.expandedKeys.includes(component.idComponentModule!)) {
          state.expandedKeys.push(component.idComponentModule!);
        }
        state.selectedNode = treeNode;
        state.selectedKeys = [treeNode.key];
      })
      .addCase(removeComponent.pending, (state, action) => {})
      .addCase(removeComponent.rejected, (state, action) => {})
      .addCase(removeComponent.fulfilled, (state, action) => {
        const { status, data: component, message } = action.payload;
        if (status !== 0) {
          return;
        }
        const newSourceTreeData = removeNodeByKey(
          component.idComponent!,
          state.sourchTreeData,
        );
        state.sourchTreeData = JSON.parse(JSON.stringify(newSourceTreeData));
        const newTreeData = removeNodeByKey(
          component.idComponent!,
          state.treeData,
        );
        state.treeData = JSON.parse(JSON.stringify(newTreeData));
        state.expandedKeys = state.expandedKeys.filter(
          (k) => k !== component.idComponent,
        );
        state.selectedKeys = state.selectedKeys.filter(
          (k) => k !== component.idComponent,
        );
      });
  },
});

const fillEntityResult = (treeData: TTree[], entities: TComponentEntity[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    entities.forEach((compEntity) => {
      if (t.id === compEntity.idComponent) {
        const tAdd: TTree = {
          ...compEntity,
          id: compEntity.idComponentEntity,
          idParent: tree.id,
          key: compEntity.idComponentEntity!,
          displayName:
            compEntity.ddEntity?.tableName +
            ' ' +
            compEntity.ddEntity?.displayName,
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

const fillEnumResult = (treeData: TTree[], enums: TComponentEnum[]) => {
  const result: TTree[] = [];
  treeData.forEach((tree) => {
    const t: TTree = deepCopy(tree);
    t.children = [];
    enums.forEach((compEnum) => {
      const tAdd: TTree = {
        ...compEnum,
        id: compEnum.idComponentEnum,
        idParent: tree.id,
        key: compEnum.idComponentEnum!,
        displayName:
          compEnum.ddEnum?.className + ' ' + compEnum.ddEnum?.displayName,
        level: EnumTreeNodeType.ENUM_LEVEL,
      };
      if (t.id === compEnum.idComponent) {
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
