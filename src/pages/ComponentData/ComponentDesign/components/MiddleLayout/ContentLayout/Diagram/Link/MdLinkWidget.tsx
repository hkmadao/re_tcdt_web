import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import {
  TConcreteDiagram,
  TEntityAssociate,
} from '@/pages/ComponentData/ComponentDesign/models';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { ReactNode, useEffect, useReducer, useState } from 'react';
import { MdPortModel } from '../Port/MdPortModel';
import MdAssoLinkWidget from './MdAssoLinkWidget';
import { MdLinkModel } from './MdLinkModel';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@/pages/ComponentData/ComponentDesign/store';
import { nanoid } from '@reduxjs/toolkit';
import { DOStatus } from '@/models/enums';

interface TMdLinkWidgetProps<T> {
  link: MdLinkModel<T>;
  diagramEngine: DiagramEngine;
}

const MdLinkWidget = <T,>(props: TMdLinkWidgetProps<T>) => {
  const { link, diagramEngine } = props;
  const [linkWidget, setLinkWidget] = useState<ReactNode>();
  const [ignored, forceUpdate] = useReducer((state: number, action: any) => {
    return state + 1;
  }, 0);
  const dispatch = useDispatch();

  const callback = () => {
    forceUpdate(0);
  };

  // useEffect(() => {
  //   if (!link.getTargetPort() || !link.getSourcePort()) {
  //     return;
  //   }
  //   //新的连线
  //   if (!link.getExtras()) {
  //     const newAsso: TConcreteDiagram = {
  //       concreteType: EnumConcreteDiagramType.ASSOLINK,
  //       diagramContent: {
  //         idEntityAssociate: nanoid(),
  //         action: DOStatus.NEW,
  //         parentEntityId: (link.getTargetPort() as MdPortModel).getExtras()
  //           .idNode,
  //         childEntityId: (link.getSourcePort() as MdPortModel).getExtras()
  //           .idNode,
  //       } as TEntityAssociate,
  //     };
  //     link.setExtras(newAsso as any)
  //     dispatch(actions.addAssociate(newAsso.diagramContent));
  //   }
  // }, [props]);

  useEffect(() => {
    // let newLinkWidget: ReactNode;
    // const mdLink: MdLinkModel<TConcreteDiagram> = link as unknown as MdLinkModel<TConcreteDiagram>
    // if (mdLink.getExtras()?.concreteType === EnumConcreteDiagramType.ASSOLINK) {
    //   newLinkWidget = <MdAssoLinkWidget {...props} callback={forceUpdate} />
    // }
    // setLinkWidget(<MdAssoLinkWidget {...props} callback={callback} />)
  }, []);

  let newLinkWidget: ReactNode;
  newLinkWidget = (
    <MdAssoLinkWidget
      {...props}
      renderPoints={true}
      // callback={callback}
    />
  );

  return <>{newLinkWidget}</>;
};

export default MdLinkWidget;
