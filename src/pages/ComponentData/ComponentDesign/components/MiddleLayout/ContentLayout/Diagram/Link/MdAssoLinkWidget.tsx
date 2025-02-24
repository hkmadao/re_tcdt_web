import {
  TConcreteDiagram,
  TEntityAssociate,
} from '@/pages/ComponentData/ComponentDesign/models';
import type { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import {
  DefaultLinkPointWidget,
  DefaultLinkSegmentWidget,
  LinkWidget,
  PointModel,
} from '@projectstorm/react-diagrams';
import React, { useReducer, useState } from 'react';
import type { MdPortModel } from '../Port/MdPortModel';
import MdLinkArrowWidget from './MdArrowWidget';
import type { MdLinkModel } from './MdLinkModel';
import MdSeftArrowWidget from './MdSeftArrowWidget';
import { useSelector } from 'react-redux';
import {
  selectEntityAssos,
  selectEnumAssos,
} from '@/pages/ComponentData/ComponentDesign/store';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';

interface TMdLinkWidgetProps<T> {
  link: MdLinkModel<T>;
  diagramEngine: DiagramEngine;
  renderPoints?: boolean;
  selected?: (event: MouseEvent) => any;
  // callback: any;
}

const MdAssoLinkWidget = <T,>(props: TMdLinkWidgetProps<T>) => {
  const refPaths: React.RefObject<SVGPathElement>[] = [];
  const [selected, setSelected] = useState(false);
  const entityAssos = useSelector(selectEntityAssos);
  const enumAssos = useSelector(selectEnumAssos);
  const [ignored, forceUpdate] = useReducer(
    (state: number, action: { callback: () => void }) => {
      action.callback();
      return state + 1;
    },
    0,
  );

  const renderPoints = () => {
    return props.renderPoints ?? true;
  };

  const addPointToLink = (event: any, index: number) => {
    if (
      !event.shiftKey &&
      !props.link.isLocked() &&
      props.link.getPoints().length - 1 <=
        props.diagramEngine.getMaxNumberPointsPerLink()
    ) {
      const point = new PointModel({
        link: props.link,
        position: props.diagramEngine.getRelativeMousePoint(event),
      });
      props.link.addPoint(point, index);
      event.persist();
      event.stopPropagation();
      // forceUpdate({
      //   callback: () => {
      //     props.callback();
      //     props.diagramEngine.getActionEventBus().fireAction({
      //       event,
      //       model: point,
      //     });
      //   },
      // });
    }
  };

  const generatePoint = (point: PointModel): JSX.Element => {
    return (
      <DefaultLinkPointWidget
        key={point.getID()}
        point={point as any}
        colorSelected={props.link.getOptions().selectedColor as string}
        color={props.link.getOptions().color}
      />
    );
  };

  const generateLink = (
    path: string,
    extraProps: any,
    id: string | number,
  ): JSX.Element => {
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
        (currentTargetId === itemtSourcesId &&
          currentSourcesId === itemTargetId)
      );
    });

    /** 当前连线在 sameSourceAndTargetLinks 的次序 */
    const groupOrder = sameSourceAndTargetLinks.findIndex((item) => {
      return item.getOptions()?.id === props.link?.getOptions()?.id;
    });
    // 将曲线拉直
    const pointValues = path.split(' ');
    if (targetId && pointValues.length > 4) {
      // 自关联类型要多加两个点
      if (sourceId == targetId) {
        /** 当前自关联节点宽度 */
        const nodeWidth =
          (props.diagramEngine
            ?.getModel()
            ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())
            ?.width || 150) - 20;
        const nodeHeight =
          (props.diagramEngine
            ?.getModel()
            ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())
            ?.height || 200) - 20;
        /** 自关联节点起始连接点和结束连接点 x 轴分别反向移动节点宽度的 1/2 */
        path =
          'M' +
          (Number(pointValues[0].substring(1)) - nodeWidth / 2) +
          ' ' +
          parseInt(pointValues[1]) +
          ' L' +
          (Number(pointValues[0].substring(1)) - nodeWidth / 2) +
          ' ' +
          (parseInt(pointValues[1]) - 25 * (groupOrder + 1) - nodeHeight / 2) +
          ' L' +
          (Number(pointValues[pointValues.length - 2]) + nodeWidth / 2) +
          ' ' +
          (parseInt(pointValues[pointValues.length - 1]) -
            25 * (groupOrder + 1) -
            nodeHeight / 2) +
          ' L' +
          (Number(pointValues[pointValues.length - 2]) + nodeWidth / 2) +
          ' ' +
          parseInt(pointValues[pointValues.length - 1]);
      } else {
        const targetNodeHeight = props.diagramEngine
          ?.getModel()
          ?.getNode(props.link?.getTargetPort()?.getParent()?.getID())?.height;
        const sourceNodeHeight = props.diagramEngine
          ?.getModel()
          ?.getNode(props.link?.getSourcePort()?.getParent()?.getID())?.height;
        const minNodeHeight = Math.min(sourceNodeHeight, targetNodeHeight);
        const lineGap =
          minNodeHeight / 2 / (sameSourceAndTargetLinks.length + 1);
        path =
          'M' +
          pointValues[0].substring(1) +
          ' ' +
          (parseInt(pointValues[1]) + lineGap * groupOrder) +
          ' L' +
          pointValues[pointValues.length - 2] +
          ' ' +
          (parseInt(pointValues[pointValues.length - 1]) +
            lineGap * groupOrder);
      }
    }

    const ref = React.createRef<SVGPathElement>();
    refPaths.push(ref);
    return (
      <DefaultLinkSegmentWidget
        key={`link-${id}`}
        path={path}
        selected={selected}
        diagramEngine={props.diagramEngine}
        factory={props.diagramEngine.getFactoryForLink(props.link)}
        link={props.link}
        forwardRef={ref}
        onSelection={(selected) => {
          setSelected(selected);
        }}
        extras={extraProps}
      />
    );
  };

  const generateArrow = (
    point: PointModel,
    previousPoint: PointModel,
  ): JSX.Element => {
    const sourceId = (props.link.getSourcePort() as MdPortModel).getExtras()
      .idElement;
    let targetId = '';
    if (props.link.getTargetPort()) {
      targetId =
        (props.link.getTargetPort() as MdPortModel).getExtras().idElement || '';
    }
    return sourceId === targetId ? (
      <MdSeftArrowWidget
        key={point.getID()}
        point={point as any}
        previousPoint={previousPoint as any}
        colorSelected={props.link.getOptions().selectedColor}
        color={props.link.getOptions().color}
        link={props.link}
        diagramEngine={props.diagramEngine}
      />
    ) : (
      <MdLinkArrowWidget
        key={point.getID()}
        point={point as any}
        previousPoint={previousPoint as any}
        colorSelected={props.link.getOptions().selectedColor}
        color={props.link.getOptions().color}
        link={props.link}
        diagramEngine={props.diagramEngine}
      />
    );
  };

  // ensure id is present for all points on the path
  const points = props.link.getPoints();
  const paths = [];

  if (points.length === 2) {
    let id = Math.floor(Math.random() * 100000) + '';
    if (props.link.getTargetPort() && props.link.getExtras()) {
      id = (props.link.getExtras() as unknown as TConcreteDiagram).idElement!;
    }

    paths.push(
      generateLink(
        props.link.getSVGPath(),
        {
          onMouseDown: (event: MouseEvent) => {
            props.selected?.(event);
            addPointToLink(event, 1);
          },
        },
        id,
      ),
    );

    // draw the link as dangeling
    if (props.link.getTargetPort() == null) {
      paths.push(generatePoint(points[1]));
    } else {
      paths.push(
        generateArrow(points[points.length - 1], points[points.length - 2]),
      );
    }
  } else {
    // draw the multiple anchors and complex line instead
    for (let j = 0; j < points.length - 1; j++) {
      paths.push(
        generateLink(
          LinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            'data-linkid': props.link.getID(),
            'data-point': j,
            onMouseDown: (event: MouseEvent) => {
              props.selected?.(event);
              addPointToLink(event, j + 1);
            },
          },
          j,
        ),
      );
    }

    if (renderPoints()) {
      // render the circles
      for (let i = 1; i < points.length - 1; i++) {
        paths.push(generatePoint(points[i]));
      }

      if (props.link.getTargetPort() == null) {
        paths.push(generatePoint(points[points.length - 1]));
      } else {
        paths.push(
          generateArrow(points[points.length - 1], points[points.length - 2]),
        );
      }
    }
  }

  return (
    <g data-default-link-test={props.link.getOptions().testName}>{paths}</g>
  );
};

export default MdAssoLinkWidget;
