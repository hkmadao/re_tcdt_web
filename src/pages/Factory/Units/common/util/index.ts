import { nanoid } from '@reduxjs/toolkit';
import { TDescriptionInfo } from '../model';

export const fillTreeDatas = (
  treeDatas: TDescriptionInfo[],
  parentAttr: string | undefined,
) => {
  treeDatas.forEach((treeData) => {
    treeData.key = nanoid();
    if (treeData.children) {
      //为空，根属性
      if (!parentAttr) {
        fillTreeDatas(treeData.children, treeData.attributeName!);
      } else {
        fillTreeDatas(
          treeData.children,
          parentAttr + '.' + treeData.attributeName,
        );
      }
    }
  });
};
