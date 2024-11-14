import { TTree } from '../models';

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
