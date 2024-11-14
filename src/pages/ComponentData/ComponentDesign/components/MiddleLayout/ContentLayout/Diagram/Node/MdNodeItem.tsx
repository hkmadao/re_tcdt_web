import { useEffect, useState, ReactNode } from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { MdNodeModel } from './MdNodeModel';
import { TConcreteDiagram } from '@/pages/ComponentData/ComponentDesign/models';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import MdEntityNodeItem from './MdEntityNodeItem';
import MdOutEntityNodeItem from './MdOutEntityNodeItem';
import MdEnumNodeItem from './MdEnumNodeItem';
import MdOutEnumNodeItem from './MdOutEnumNodeItem';

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
        newMdItem = <MdEntityNodeItem node={entityNode} engine={engine} />;
        break;
      case EnumConcreteDiagramType.OUT_ENTITY:
        newMdItem = <MdOutEntityNodeItem node={entityNode} engine={engine} />;
        break;
      case EnumConcreteDiagramType.ENUM:
        newMdItem = <MdEnumNodeItem node={entityNode} engine={engine} />;
        break;
      case EnumConcreteDiagramType.OUT_ENUM:
        newMdItem = <MdOutEnumNodeItem node={entityNode} engine={engine} />;
        break;
    }
    setMdItem(newMdItem);
  }, [props]);

  return <>{mdItem}</>;
};

export default MdNodeItem;
