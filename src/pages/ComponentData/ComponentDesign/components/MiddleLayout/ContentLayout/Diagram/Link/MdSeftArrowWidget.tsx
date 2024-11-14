import {
  TConcreteDiagram,
  TEntityAssociate,
} from '@/pages/ComponentData/ComponentDesign/models';
import { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import { PointModel } from '@projectstorm/react-diagrams-core';
import { MdPortModel } from '../Port/MdPortModel';
import { MdLinkModel } from './MdLinkModel';
import { useSelector } from 'react-redux';
import {
  selectEntityAssos,
  selectEnumAssos,
} from '@/pages/ComponentData/ComponentDesign/store';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';

export type TMdLinkArrowWidgetProps<T> = {
  point: PointModel;
  previousPoint: PointModel;
  colorSelected: any;
  color: any;
  link: MdLinkModel<T>;
  diagramEngine: DiagramEngine;
};

/**箭头部件 */
const MdSeftArrowWidget = <T,>(props: TMdLinkArrowWidgetProps<T>) => {
  const { point, previousPoint } = props;
  const entityAssos = useSelector(selectEntityAssos);
  const enumAssos = useSelector(selectEnumAssos);
  const sourceId = (props.link.getSourcePort() as MdPortModel).getExtras()
    .idElement;
  let targetId = '';
  if (props.link.getTargetPort()) {
    targetId =
      (props.link.getTargetPort() as MdPortModel).getExtras().idElement || '';
  }
  // 获取model
  const model: DiagramModel = props.diagramEngine.getModel();
  const links = model.getLinks();
  const filterLinks = links.filter((link) => {
    const filterSourceId = (link.getSourcePort() as MdPortModel).getExtras()
      .idElement;
    if (!link.getTargetPort()) {
      return false;
    }
    const filterTargetId = (link.getTargetPort() as MdPortModel).getExtras()
      .idElement;
    //判断是否有连线存在
    if (sourceId == filterSourceId && targetId === filterTargetId) {
      return true;
    }
    return false;
  });

  //根据连线的顺序设置连线的偏移
  let groupOrder = 0;
  if ((props.link as unknown as MdLinkModel<TConcreteDiagram>).getExtras()) {
    const concreteDiagram = (
      props.link as unknown as MdLinkModel<TConcreteDiagram>
    ).getExtras() as TConcreteDiagram;
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ASSOLINK) {
      const findAsso = entityAssos?.find(
        (asso) => asso.idEntityAssociate === concreteDiagram.idElement,
      );
      groupOrder = findAsso?.entityAssociate?.groupOrder || 0;
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUMASSOLINK) {
      const findAsso = enumAssos?.find(
        (asso) => asso.idEnumAssociate === concreteDiagram.idElement,
      );
      groupOrder = findAsso?.groupOrder || 0;
    }
  } else {
    groupOrder = filterLinks.length;
  }

  const angle = 90;

  //需要根据三角函数计算偏移距离和角度
  return (
    <>
      <g
        className="arrow"
        transform={
          'translate(' +
          (previousPoint.getPosition().x +
            (point.getPosition().x - previousPoint.getPosition().x)) +
          ', ' +
          (previousPoint.getPosition().y +
            (point.getPosition().y -
              previousPoint.getPosition().y -
              40 * (groupOrder + 1))) +
          ')'
        }
      >
        <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
          <g transform={'translate(0, 0)'}>
            {/* <text fontSize={36} x={-10} y={-10} fill="black">
              *
            </text> */}
            <polyline
              style={{ fill: '#00a0ff', stroke: 'gray', strokeWidth: 0 }}
              points="0,-10 30,0 0,10"
              // fill={'rgb(0,192,255)'}
              data-id={point.getID()}
              data-linkid={point.getLink().getID()}
            />
          </g>
        </g>
      </g>
    </>
  );
};

export default MdSeftArrowWidget;
