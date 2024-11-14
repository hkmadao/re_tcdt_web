import type { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import type { PointModel } from '@projectstorm/react-diagrams-core';
import type { MdPortModel } from '../Port/MdPortModel';
import type { MdLinkModel } from './MdLinkModel';

export type TMdLinkArrowWidgetProps<T> = {
  point: PointModel;
  previousPoint: PointModel;
  colorSelected: any;
  color: any;
  link: MdLinkModel<T>;
  diagramEngine: DiagramEngine;
};

/** 箭头部件 */
const MdSeftArrowWidget = <T,>(props: TMdLinkArrowWidgetProps<T>) => {
  const { point } = props;
  // 获取model
  const model: DiagramModel = props.diagramEngine.getModel();
  const links = model.getLinks();

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

  /** 设置连线箭头位置 */
  const { x: pointX, y: pointY } = point.getPosition();
  const nodeHeight =
    (props.diagramEngine
      ?.getModel()
      ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())?.height ||
      200) - 20;

  // 需要根据三角函数计算偏移距离和角度
  return (
    <>
      <g
        className="arrow"
        transform={`translate(${pointX - 15 / 2}, ${
          pointY - 25 * (groupOrder + 1) - nodeHeight / 2
        })`}
      >
        <g>
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

export default MdSeftArrowWidget;
