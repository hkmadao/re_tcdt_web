import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
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

export type TMdLinkArrowWidgetProps<T> = {
  point: PointModel;
  previousPoint: PointModel;
  colorSelected: any;
  color: any;
  link: MdLinkModel<T>;
  diagramEngine: DiagramEngine;
};

/**箭头部件 */
const MdLinkArrowWidget = <T,>(props: TMdLinkArrowWidgetProps<T>) => {
  const { point, previousPoint } = props;
  // 获取model
  const model: DiagramModel = props.diagramEngine.getModel();
  const links = model.getLinks();

  const angle =
    (Math.atan2(
      point.getPosition().y - previousPoint.getPosition().y,
      point.getPosition().x - previousPoint.getPosition().x,
    ) *
      180) /
    Math.PI;

  /** 找到 source 和 target 相同的所有连线 */
  const sameSourceAndTargetLinks = links.filter((item) => {
    const currentTargetId =
      (props.link?.getTargetPort() as MdPortModel)?.getExtras()?.idElement ||
      '';
    const currentSourcesId =
      (props.link?.getSourcePort() as MdPortModel)?.getExtras()?.idElement ||
      '';
    const itemTargetId =
      (item?.getTargetPort() as MdPortModel)?.getExtras()?.idElement || '';
    const itemtSourcesId =
      (item?.getSourcePort() as MdPortModel)?.getExtras()?.idElement || '';
    return (
      (currentTargetId === itemTargetId &&
        currentSourcesId === itemtSourcesId) ||
      (currentTargetId === itemtSourcesId && currentSourcesId === itemTargetId)
    );
  });

  /** 当前连线在 sameSourceAndTargetLinks 的次序 */
  const groupOrder = sameSourceAndTargetLinks.findIndex((item) => {
    return item.getOptions()?.id === props.link?.getOptions()?.id;
  });

  /** === 设置连线箭头位置 === */
  const { x: pointX, y: pointY } = point.getPosition();
  const { x: previousPointX, y: previousPointY } = previousPoint.getPosition();
  const targetNodeHeight =
    props.diagramEngine
      ?.getModel()
      ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())?.height ||
    200;
  const targetNodeWidth =
    props.diagramEngine
      ?.getModel()
      ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())?.width ||
    200;
  const sourceNodeHeight =
    props.diagramEngine
      ?.getModel()
      ?.getNode(props.link?.getSourcePort()?.getParent()?.getID())?.height ||
    200;
  const minNodeHeight = Math.min(sourceNodeHeight, targetNodeHeight) / 2;
  const lineGap =
    Math.min(sourceNodeHeight, targetNodeHeight) /
    2 /
    (sameSourceAndTargetLinks.length + 1);
  // const translateX = pointX - (pointX - previousPointX) / 2;
  // const translateY =
  //   pointY -
  //   (pointY - previousPointY) / 2 -
  //   (sameSourceAndTargetLinks.length === 1 ? 0 : minNodeHeight) +
  //   lineGap * groupOrder;
  const targetAngle =
    (Math.atan2(targetNodeHeight, targetNodeWidth) * 180) / Math.PI;
  const r =
    Math.sqrt(Math.pow(targetNodeWidth, 2) + Math.pow(targetNodeHeight, 2)) / 2;
  let translateX = 0;
  let translateY = 0;
  translateX = pointX - r * Math.cos((-angle * Math.PI) / 180);
  translateY =
    pointY - r * Math.sin((angle * Math.PI) / 180) + lineGap * groupOrder;

  //源图形在目标图形正上方扇形区域(角度为负值)
  if (angle > targetAngle && angle < 180 - targetAngle) {
    //偏移距离加上箭头偏移量
    const offSetY = targetNodeHeight / 2 + 30;
    translateX =
      pointX +
      (offSetY + lineGap * groupOrder) / Math.tan((-angle * Math.PI) / 180);
    translateY = pointY - offSetY;
  }
  //源图形在目标图形正下方扇形区域(角度为负值)
  if (angle < -targetAngle && angle > -(180 - targetAngle)) {
    //偏移距离加上箭头偏移量
    const offSetY = targetNodeHeight / 2;
    translateX =
      pointX -
      (offSetY - lineGap * groupOrder) / Math.tan((-angle * Math.PI) / 180);
    translateY = pointY + offSetY;
  }
  //源图形在目标图形左方扇形区域
  if (angle >= -targetAngle && angle <= targetAngle) {
    //偏移距离加上箭头偏移量
    const offSetX = targetNodeWidth / 2 + 30;
    translateX = pointX - offSetX;
    translateY =
      pointY -
      offSetX * Math.tan((angle * Math.PI) / 180) +
      lineGap * groupOrder;
  }
  //源图形在目标图形右形区域
  if (
    (angle < 0 && angle < -(180 - targetAngle)) ||
    (angle > 0 && angle > 180 - targetAngle)
  ) {
    //偏移距离加上箭头偏移量
    const offSetX = targetNodeWidth / 2 + 30;
    translateX = pointX + offSetX;
    // if (angle < 0) {
    //   translateY = pointY + (offSetX) * Math.tan(Math.PI + (angle * Math.PI / 180)) + lineGap * groupOrder;
    // } else {
    //   translateY = pointY - (offSetX) * Math.tan(Math.PI - (angle * Math.PI / 180)) + lineGap * groupOrder;
    // }
    translateY =
      pointY +
      offSetX * Math.tan((angle * Math.PI) / 180) +
      lineGap * groupOrder;
  }

  // 需要根据三角函数计算偏移距离和角度
  return (
    <>
      <g
        className="arrow"
        transform={`translate(${translateX}, ${translateY})`}
      >
        <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
          <g transform={'translate(0, 0)'}>
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

export default MdLinkArrowWidget;
