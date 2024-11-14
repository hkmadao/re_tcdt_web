import { TTree } from '@/models';
import { Key } from 'react';

export const getChildTree: (
  childKey: Key,
  treeDatas?: TTree[],
) => TTree[] | undefined = (childKey, treeDatas) => {
  if (!treeDatas) {
    return;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    if (t.key === childKey) {
      return JSON.parse(JSON.stringify(t.children || []));
    }
    const childTree = getChildTree(childKey, t.children);
    if (childTree) {
      return childTree;
    }
  }
  return;
};

export const fillTreeKey = (treeDatas?: TTree[]) => {
  const result: TTree[] = [];
  if (!treeDatas) {
    return result;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    const children = fillTreeKey(t.children);
    result.push({ ...t, key: t.id, title: t.displayName, children });
  }
  return result;
};

export const getUpKeysByKey = (key: Key, treeDatas: TTree[]) => {
  const result: Key[] = [];
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    if (key === t.key) {
      result.push(t.key);
    }
    const childrenKeys = getUpKeysByKey(key, t.children ?? []);
    if (childrenKeys.length > 0) {
      result.push(...[...childrenKeys, t.key]);
    }
  }
  return result;
};

export const addNodeByParentKey = (addNode: TTree, treeDatas?: TTree[]) => {
  const result: TTree[] = [];
  if (!treeDatas) {
    return result;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    const newT: TTree = { ...t };
    const childResult = addNodeByParentKey(addNode, t.children);
    newT.children = childResult;
    result.push(newT);
    if (t.key === addNode.idParent) {
      const addT: TTree = { ...addNode };
      newT.children.push(addT);
    }
  }
  return result;
};

export const updateNode = (updateTree: TTree, treeDatas?: TTree[]) => {
  const result: TTree[] = [];
  if (!treeDatas) {
    return result;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    const childResult = updateNode(updateTree, t.children);
    if (t.key === updateTree.key) {
      const newT: TTree = { ...updateTree, children: childResult };
      result.push(newT);
      continue;
    }
    result.push({ ...t, children: childResult });
  }
  return result;
};

export const removeNodeByKey = (key: Key, treeDatas?: TTree[]) => {
  const result: TTree[] = [];
  if (!treeDatas) {
    return result;
  }
  for (let i = 0; i < treeDatas.length; i++) {
    const t = treeDatas[i];
    if (t.key !== key) {
      const newT: TTree = { ...t, children: [] };
      const childResult = removeNodeByKey(key, t.children);
      newT.children = childResult;
      result.push(newT);
    }
  }
  return result;
};

export const getMatchKeys = (
  searchProps: string[],
  searchValue: string,
  tree: TTree[],
): Key[] => {
  const foundKeys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const childResult = getMatchKeys(
      searchProps,
      searchValue,
      node.children ?? [],
    );
    if (childResult.length > 0) {
      foundKeys.push(...childResult);
    }
    let fg = false;
    for (let i = 0; i < searchProps.length; i++) {
      const prop = searchProps[i];
      if (node[prop].indexOf(searchValue) > -1) {
        fg = true;
      }
    }
    if (fg) {
      if (!foundKeys.includes(node.key)) {
        foundKeys.push(node.key);
      }
    }
  }
  return foundKeys;
};

/**获取节点的数据及上级节点数据 */
export const getTreeByKeys = (keys: Key[], sourceTree: TTree[]): TTree[] => {
  const foundTree: TTree[] = [];
  for (let i = 0; i < sourceTree.length; i++) {
    const node = sourceTree[i];
    const childResult = getTreeByKeys(keys, node.children ?? []);
    if (keys.includes(node.key) || childResult.length > 0) {
      foundTree.push({
        ...JSON.parse(JSON.stringify(node)),
        children: childResult,
      });
    }
  }
  return foundTree;
};

export const getTreeKeys = (tree: TTree[]): Key[] => {
  const keys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const childResult = getTreeKeys(node.children ?? []);
    keys.push(...childResult);
    keys.push(node.key);
  }
  return keys;
};

export const getTreeParentKeys = (tree: TTree[]): Key[] => {
  const keys: Key[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children && node.children.length > 0) {
      const childResult = getTreeParentKeys(node.children);
      keys.push(...childResult);
      keys.push(node.key);
    }
  }
  return keys;
};

export const arrToTree = (
  parentProp: string,
  keyProp: string,
  titleProp: string,
  arr: any[],
  fgRoot: boolean,
  parentKey: string | null,
  parentRefProp?: string,
  parent?: TTree,
): TTree[] => {
  const tree: TTree[] = [];
  for (let i = 0; i < arr.length; i++) {
    const node = arr[i];
    if (node[parentProp] === parentKey || (fgRoot && !node[parentProp])) {
      let currentNode: TTree = {
        ...node,
        key: node[keyProp],
        id: node[keyProp],
        title: node[titleProp],
        children: [],
      };
      if (parentRefProp) {
        currentNode[parentRefProp] = parent;
      }
      const children = arrToTree(
        parentProp,
        keyProp,
        titleProp,
        arr,
        false,
        node[keyProp],
        parentRefProp,
        { ...currentNode },
      );
      currentNode.children = children;
      tree.push(currentNode);
    }
  }
  return tree;
};

/**根据keys获取树节点数据 */
export const getSelectedNodes = (
  selectedKesys: Key[],
  tree: TTree[],
): TTree[] => {
  const selectedNodes: TTree[] = [];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (selectedKesys.includes(node.id)) {
      selectedNodes.push({ ...node });
    }
    const childResult = getSelectedNodes(selectedKesys, node.children ?? []);
    selectedNodes.push(...childResult);
  }
  return selectedNodes;
};
