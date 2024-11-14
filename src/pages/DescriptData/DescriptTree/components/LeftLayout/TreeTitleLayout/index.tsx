import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnumTreeNodeType } from '@/pages/DescriptData/DescriptTree/conf';
import { TTree } from '@/pages/DescriptData/DescriptTree/models';
import RootTitleLayout from './RootTitleLayout';
import ProjecTitleLayout from './ProjecTitleLayout';
import SubProjectTitleLayout from './SubProjectTitleLayout';
import EntityCollectionTitleLayout from './EntityCollectionTitleLayout';
import { selectDescriptTree } from '../../../store';
import EntityTitleLayout from './EntityitleLayout';

type TTreeTitilePros = {} & TTree;

const findTreeData: (
  id: string,
  componentTree: TTree[],
) => TTree | undefined = (id, componentTree) => {
  for (let i = 0; i < componentTree.length; i++) {
    const treeData = componentTree[i];
    if (id === treeData.id) {
      return treeData;
    }
    if (treeData.children) {
      const childTreeData = findTreeData(id, treeData.children);
      if (childTreeData) {
        return childTreeData;
      }
    }
  }
};

const TreeTitileLayout: FC<TTreeTitilePros> = ({ ...treeData }) => {
  const [titleLayout, setTitleLayout] = useState<ReactNode>();
  const componentTree = useSelector(selectDescriptTree);
  const dispatch = useDispatch();

  useEffect(() => {
    const tree = findTreeData(treeData.id!, componentTree);
    if (!tree) {
      return;
    }
    const newTreeData: TTreeTitilePros = { ...tree };
    if (treeData.level === EnumTreeNodeType.ROOT) {
      setTitleLayout(<RootTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.PROJECT) {
      setTitleLayout(<ProjecTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.SUB_PROJECT) {
      setTitleLayout(<SubProjectTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.ENTITY_COLLECTION) {
      setTitleLayout(<EntityCollectionTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.ENTITY_LEVEL) {
      setTitleLayout(<EntityTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.ENUM_LEVEL) {
      setTitleLayout(<EntityTitleLayout {...newTreeData} />);
      return;
    }
  }, [componentTree]);

  return <>{titleLayout}</>;
};

export default TreeTitileLayout;
