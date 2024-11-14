import { useEffect, useState, ReactNode } from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { MdNodeModel } from './MdNodeModel';
import { TConcreteDiagram } from '@/pages/DescriptData/DescriptDesign/models';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import MdEntitySimpleNodeItem from './MdEntitySimpleNodeItem';
import MdOutEntitySimpleNodeItem from './MdOutEntitySimpleNodeItem';
import MdEnumSimpleNodeItem from './MdEnumSimpleNodeItem';
import MdOutEnumSimpleNodeItem from './MdOutEnumSimpleNodeItem';

interface TNodeItemProps<T> {
  node: MdNodeModel<T>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdNodeItem = <T,>(props: TNodeItemProps<T>) => {
  const { node, engine } = props;
  const [mdItem, setMdItem] = useState<ReactNode>(null);

  useEffect(() => {
    let newMdItem: ReactNode;
    const concreteDiagram = node.getExtras() as unknown as TConcreteDiagram;
    const entityNode: MdNodeModel<TConcreteDiagram> =
      node as unknown as MdNodeModel<TConcreteDiagram>;
    switch (concreteDiagram.concreteType) {
      case EnumConcreteDiagramType.ENTITY:
        newMdItem = (
          <MdEntitySimpleNodeItem node={entityNode} engine={engine} />
        );
        break;
      case EnumConcreteDiagramType.OUT_ENTITY:
        newMdItem = (
          <MdOutEntitySimpleNodeItem node={entityNode} engine={engine} />
        );
        break;
      case EnumConcreteDiagramType.ENUM:
        newMdItem = <MdEnumSimpleNodeItem node={entityNode} engine={engine} />;
        break;
      case EnumConcreteDiagramType.OUT_ENUM:
        newMdItem = (
          <MdOutEnumSimpleNodeItem node={entityNode} engine={engine} />
        );
        break;
    }
    setMdItem(newMdItem);
  }, [props]);

  return <>{mdItem}</>;
};

export default MdNodeItem;
