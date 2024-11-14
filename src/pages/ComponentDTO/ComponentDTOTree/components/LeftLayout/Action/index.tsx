import { FC, ReactNode } from 'react';
import { useSelectedNode } from '../../../hooks';
import { EnumTreeNodeType } from '../../../conf';
import RootAction from './Root';
import ProjectNodeAction from './ProjectNode';
import EntityCollectionAction from './EntityCollection';
import SubProjectAction from './SubProject';
import EmptyAction from './EmptyAction';
import DtoModuleAction from './DtoModuleAction';

const NodeAction: FC = () => {
  const selectedNode = useSelectedNode();

  let content: ReactNode = <EmptyAction />;
  if (selectedNode?.level === EnumTreeNodeType.ROOT) {
    content = <RootAction />;
  }
  if (selectedNode?.level === EnumTreeNodeType.PROJECT) {
    content = <ProjectNodeAction />;
  }
  if (selectedNode?.level === EnumTreeNodeType.SUB_PROJECT) {
    content = <SubProjectAction />;
  }
  if (selectedNode?.level === EnumTreeNodeType.DTO_MODULE) {
    content = <DtoModuleAction />;
  }
  if (selectedNode?.level === EnumTreeNodeType.DTO_COLLECTION) {
    content = <EntityCollectionAction />;
  }

  return (
    <>
      <div
        style={{
          margin: '0px 0px 10px 5px',
        }}
      >
        {content}
      </div>
    </>
  );
};

export default NodeAction;
