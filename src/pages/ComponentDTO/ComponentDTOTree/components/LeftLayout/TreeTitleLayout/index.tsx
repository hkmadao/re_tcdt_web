import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnumTreeNodeType } from '@/pages/ComponentDTO/ComponentDTOTree/conf';
import { TTree } from '@/pages/ComponentDTO/ComponentDTOTree/models';
import RootTitleLayout from './RootTitleLayout';
import ProjecTitleLayout from './ProjecTitleLayout';
import ModuleTitleLayout from './ModuleTitleLayout';
import EntityCollectionTitleLayout from './EntityCollectionTitleLayout';
import { selectDescriptTree } from '../../../store';
import DtoModuleTitleLayout from './DtoModuleTitleLayout';
import EntityTitleLayout from './EntityitleLayout';

type TTreeTitilePros = {
  fetchData: () => void;
} & TTree;

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

const TreeTitileLayout: FC<TTreeTitilePros> = ({ fetchData, ...treeData }) => {
  const [titleLayout, setTitleLayout] = useState<ReactNode>();
  const componentTree = useSelector(selectDescriptTree);
  const dispatch = useDispatch();

  useEffect(() => {
    const tree = findTreeData(treeData.id!, componentTree);
    if (!tree) {
      return;
    }
    const newTreeData: TTreeTitilePros = { ...tree, fetchData };
    if (treeData.level === EnumTreeNodeType.ROOT) {
      setTitleLayout(<RootTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.PROJECT) {
      setTitleLayout(<ProjecTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.SUB_PROJECT) {
      setTitleLayout(<ModuleTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.DTO_MODULE) {
      setTitleLayout(<DtoModuleTitleLayout {...newTreeData} />);
      return;
    }
    if (treeData.level === EnumTreeNodeType.DTO_COLLECTION) {
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

  return (
    <>
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {titleLayout}
      </span>
    </>
  );
};

export default TreeTitileLayout;
