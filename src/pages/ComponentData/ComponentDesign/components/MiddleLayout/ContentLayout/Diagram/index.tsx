import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Select, Slider, Space } from 'antd';
import classnames from 'classnames';
import {
  CanvasWidget,
  CanvasEngineListener,
} from '@projectstorm/react-canvas-core';
import createDiagramEngine from './createDiagramEngine';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.less';
import { MdPortFactory } from './Port/MdPortFactory';
import { MdNodeFactory } from './Node/MdNodeFactory';
import { MdLinkFactory } from './Link/MdLinkFactory';
import { MdLabelFactory } from './Label/MdLabelFactory';
import {
  DiagramEngine,
  DiagramListener,
  DiagramModel,
} from '@projectstorm/react-diagrams';
import { MdNodeModel } from './Node/MdNodeModel';
import { MdPortModel } from './Port/MdPortModel';
import { MdLinkModel } from './Link/MdLinkModel';
import {
  actions,
  selectEntityComponent,
  selectDrawCount,
  selectElements,
  selectFgShowOutEntities,
  selectComponentNodeUis,
  selectFgShowSysInterfaces,
  selectFgFocus,
  selectFocusIds,
  selectFocusDrawCount,
  selectFgInit,
  selectZoomToFitCount,
  selectModuleUi,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  TComponentNodeUi,
  TConcreteDiagram,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  diagramContentDivId,
  EnumCanvasUi,
  EnumConcreteDiagramType,
} from '@/pages/ComponentData/ComponentDesign/conf';
import deltaUpdatesDiagramEngine from './delta-updates.ts';
import mu from './moduleUi';
import focusDiagramEngine, { fitMultipleGraph } from './focus-diagram.ts';
import resetDiagramEngine from './reset-diagram';
import {
  useSelectedIds,
  useFgLoadData,
} from '@/pages/ComponentData/ComponentDesign/hooks';

const Diagrams: React.FC = () => {
  const { Option } = Select;
  const { selectLines, selectNodes } = useSelector(selectElements);
  const fgInit = useSelector(selectFgInit);
  const fgFocus = useSelector(selectFgFocus);
  const focusIds = useSelector(selectFocusIds);
  const focusDrawCount = useSelector(selectFocusDrawCount);
  const drawCount = useSelector(selectDrawCount);
  const moduleUi = useSelector(selectModuleUi);
  const mdPortFactory = new MdPortFactory();
  const mdNodeFactory = new MdNodeFactory<TConcreteDiagram>();
  const mdLinkFactory = new MdLinkFactory<TConcreteDiagram>();
  const mdLabelFactory = new MdLabelFactory();
  const dispatch = useDispatch();
  const fgShowOutEntities = useSelector(selectFgShowOutEntities);
  const fgShowSysInterfaces = useSelector(selectFgShowSysInterfaces);
  const zoomToFitCount = useSelector(selectZoomToFitCount);
  const nodeUis = useSelector(selectComponentNodeUis);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const component = useSelector(selectEntityComponent);
  const diagramRef = useRef<HTMLDivElement>(null);
  const timeLong = useRef<number>(new Date().getTime());
  const { selectedNodeIds, selectedLineIds } = useSelectedIds();
  const fgExistData = useFgLoadData();

  useEffect(() => {
    // 获取model
    const model: DiagramModel = engine.getModel();
    const nodes: MdNodeModel<TConcreteDiagram>[] =
      model.getNodes() as MdNodeModel<TConcreteDiagram>[];
    nodes.forEach((n) => {
      n.setSelected(selectedNodeIds?.includes(n.getExtras()?.idElement));
    });
  }, [selectedNodeIds]);

  useEffect(() => {
    // 获取model
    const model: DiagramModel = engine.getModel();
    const links: MdLinkModel<TConcreteDiagram>[] =
      model.getLinks() as MdLinkModel<TConcreteDiagram>[];
    links.forEach((n) => {
      n.setSelected(selectedLineIds?.includes(n.getExtras()?.idElement));
    });
  }, [selectedLineIds]);

  const engine = useMemo(() => {
    return createDiagramEngine({
      mdPortFactory,
      mdNodeFactory,
      mdLinkFactory,
      mdLabelFactory,
    });
  }, []);

  useEffect(() => {
    const cWidth = moduleUi.cWidth;
    const cHeight = moduleUi.cHeight;
    //在engine.getCanvas()事件中，获取不到moduleUi最新值，只能赋值给全局变量在获取
    mu.cWidth = cWidth;
  }, [moduleUi]);

  useEffect(() => {
    const idElement = moduleUi.goToId;
    if (!idElement) {
      return;
    }
    goToElement(idElement);
  }, [moduleUi.goToId]);

  const goToElement = (idElement: string) => {
    const findNodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === idElement,
    );
    if (!findNodeUi) {
      console.error('找不到元素ui信息！');
      return;
    }
    const cWidth = moduleUi.cWidth;
    const cHeight = moduleUi.cHeight;
    /**
     * 图形向左偏移为- 向右偏移为+
     * 图形向上偏移为- 向下偏移为+
     */
    const offsetX =
      moduleUi.lWidth +
      (cWidth - moduleUi.lWidth - moduleUi.rWidth) / 2 -
      findNodeUi.width! / 2 -
      findNodeUi.x!;
    const offsetY =
      moduleUi.hHeight +
      (cHeight - moduleUi.hHeight - moduleUi.bHeight) / 2 -
      findNodeUi.height! / 2 -
      findNodeUi.y!;
    /**偏移距离需要乘上缩放比例倒数，缩放比例为缩放值除以100 */
    const scaleOffsetX = offsetX * (moduleUi.zoomLevel / 100);
    const scaleOffsetY = offsetY * (moduleUi.zoomLevel / 100);
    //重设画布初始位置
    engine.getModel().setOffset(0, 0);
    //画布缩放
    engine.getModel().setZoomLevel(moduleUi.zoomLevel);
    //位置偏移调整
    engine.getModel().setOffset(scaleOffsetX, scaleOffsetY);
    dispatch(actions.resetGoToId());
  };

  useEffect(() => {
    const canvasRef = engine.getCanvas();

    canvasRef.onmousemove = (e) => {
      if (e.altKey) {
        e.stopPropagation();
      }
    };

    canvasRef.onwheel = (e) => {};
  }, []);

  /**重置画布 */
  useEffect(() => {
    if (fgInit) {
      resetDiagramEngine(
        engine,
        component,
        selectLines!,
        selectNodes!,
        fgShowOutEntities,
        fgShowSysInterfaces,
        fgFocus,
        moduleUi.zoomLevel,
      );
      if (!moduleUi.goToId) {
        fitMultipleGraph(engine, moduleUi, nodeUis ?? []);
        dispatch(actions.updateZoomLevel(engine.getModel().getZoomLevel()));
      } else {
        goToElement(moduleUi.goToId);
      }
    }
    dispatch(actions.cancelFgInit());
  }, [fgInit]);

  /**更新画布 */
  useEffect(() => {
    if (drawCount < 1) {
      return;
    }
    deltaUpdatesDiagramEngine(
      engine,
      component,
      selectLines!,
      selectNodes!,
      fgShowOutEntities,
      fgShowSysInterfaces,
    );
  }, [drawCount]);

  /**聚焦状态下更新画布 */
  useEffect(() => {
    if (focusDrawCount < 1) {
      return;
    }
    focusDiagramEngine(
      engine,
      component,
      selectLines!,
      selectNodes!,
      focusIds,
      moduleUi,
      nodeUis || [],
    );
    if (focusDrawCount > 1) {
      return;
    }

    dispatch(actions.updateZoomLevel(engine.getModel().getZoomLevel()));
    dispatch(
      actions.updateOffSet({
        offsetX: engine.getModel().getOffsetX(),
        offsetY: engine.getModel().getOffsetY(),
      }),
    );
  }, [focusDrawCount]);

  /**适配画布 */
  useEffect(() => {
    if (zoomToFitCount > 0) {
      fitMultipleGraph(engine, moduleUi, nodeUis || []);
    }
  }, [zoomToFitCount]);

  const onWheelCapture = (e: React.MouseEvent) => {
    if (engine.getModel()) {
      dispatch(actions.updateZoomLevel(engine.getModel().getZoomLevel()));
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    //判断鼠标是否按下
    if (e.buttons === 1) {
      return;
    }
    // 获取model
    const model: DiagramModel = engine.getModel();
    const newNodeUis: TComponentNodeUi[] = [];
    model.getNodes().forEach((node) => {
      const mdNode = node as MdNodeModel<TConcreteDiagram>;
      const idElement = mdNode.getExtras().idElement;
      nodeUis?.forEach((nodeUi) => {
        if (nodeUi.idElement === idElement) {
          newNodeUis.push({
            ...nodeUi,
            x: Math.floor(mdNode.getPosition().x),
            y: Math.floor(mdNode.getPosition().y),
          });
        }
      });
    });
    dispatch(actions.setNodeUis(newNodeUis));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // if (new Date().getTime() - timeLong.current < 200) {
    //   return;
    // }
    // timeLong.current = new Date().getTime();
    // //元素层的相对浏览器的x轴位置
    // const clientX = engine
    //   .getCanvas()
    //   .firstElementChild?.getBoundingClientRect().x as number;
    // //元素层的相对浏览器的x轴位置
    // const clientY = engine
    //   .getCanvas()
    //   .firstElementChild?.getBoundingClientRect().y as number;
    // //乘以缩放倍率倒数
    // const mouseX =
    //   (e.clientX - clientX) * (1 / (engine.getModel().getZoomLevel() / 100));
    // const mouseY =
    //   (e.clientY - clientY) * (1 / (engine.getModel().getZoomLevel() / 100));
    // dispatch(actions.updateMouseCoordinates({ mouseX, mouseY }));
  };

  const handleClick = (e: React.MouseEvent) => {};

  const handleMouseUp = (e: React.MouseEvent) => {
    // 获取model
    const model: DiagramModel = engine.getModel();
    const activeNodes = model.getNodes().filter((node) => node.isSelected());
    const activeLinks = model.getLinks().filter((link) => link.isSelected());
    const activeMdNodes: MdNodeModel<TConcreteDiagram>[] = activeNodes
      ? (activeNodes as MdNodeModel<TConcreteDiagram>[])
      : [];
    const activeMdLinks: MdLinkModel<TConcreteDiagram>[] = activeLinks
      ? (activeLinks as MdLinkModel<TConcreteDiagram>[])
      : [];
    //获取ui
    const newNodeUis: TComponentNodeUi[] = [];
    model.getNodes().forEach((node) => {
      const mdNode = node as MdNodeModel<TConcreteDiagram>;
      const idElement = mdNode.getExtras().idElement;
      nodeUis?.forEach((nodeUi) => {
        if (nodeUi.idElement === idElement) {
          newNodeUis.push({
            ...nodeUi,
            x: Math.floor(mdNode.getPosition().x),
            y: Math.floor(mdNode.getPosition().y),
          });
        }
      });
    });

    const selectNodes = activeMdNodes.map((node) => node.getExtras());
    const selectLines = activeMdLinks
      .map((link) => {
        //新的连线
        if (!link.getExtras()) {
          const portExtras = (link.getTargetPort() as MdPortModel).getExtras();
          let linkType = EnumConcreteDiagramType.ASSOLINK;
          if (portExtras.concreteType === EnumConcreteDiagramType.ENTITY) {
            linkType = EnumConcreteDiagramType.ASSOLINK;
          }
          if (portExtras.concreteType === EnumConcreteDiagramType.OUT_ENTITY) {
            linkType = EnumConcreteDiagramType.ASSOLINK;
          }
          if (portExtras.concreteType === EnumConcreteDiagramType.ENUM) {
            linkType = EnumConcreteDiagramType.ENUMASSOLINK;
          }
          if (portExtras.concreteType === EnumConcreteDiagramType.OUT_ENUM) {
            linkType = EnumConcreteDiagramType.ENUMASSOLINK;
          }
          return {
            concreteType: linkType,
            idEntityCollection: component?.idComponent,
            targetId: (link.getTargetPort() as MdPortModel).getExtras()
              .idElement,
            sourceId: (link.getSourcePort() as MdPortModel).getExtras()
              .idElement,
          };
        }
        return {
          ...link.getExtras(),
          idEntityCollection: component?.idComponent,
          targetId: (link.getTargetPort() as MdPortModel).getExtras().idElement,
          sourceId: (link.getSourcePort() as MdPortModel).getExtras().idElement,
        };
      })
      .filter((element) => element);
    dispatch(
      actions.setSelectElement({
        selectNodes,
        selectLines,
        nodeUis: newNodeUis,
      }),
    );
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Delete') {
      if (selectNodes!.length + selectLines!.length > 0) {
        setIsModalVisible(true);
      }
    }
  };

  const handleDeleteOk = (e: any) => {
    dispatch(actions.deleteSelectElement());
    setIsModalVisible(false);
  };

  const handleDeleteCancel = (e: any) => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
        }}
        onContextMenu={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        <div
          ref={diagramRef}
          className={styles.diagram}
          onWheelCapture={fgExistData ? onWheelCapture : undefined}
          onMouseLeave={fgExistData ? handleMouseLeave : undefined}
          onClick={fgExistData ? handleClick : undefined}
          onMouseUp={fgExistData ? handleMouseUp : undefined}
          onKeyUp={fgExistData ? handleKeyUp : undefined}
          onMouseMove={fgExistData ? handleMouseMove : undefined}
          tabIndex={-1}
          style={{
            backgroundSize:
              Math.round((moduleUi.zoomLevel / 100) * 100) +
              'px ' +
              Math.round((moduleUi.zoomLevel / 100) * 100) +
              'px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              top: moduleUi.hHeight,
              left: moduleUi.cWidth / 2 - 150,
            }}
          >
            {/* <Coordinate engine={engine} /> */}
          </div>
          <CanvasWidget
            className={classnames({
              [styles.canvasWidget]: true,
            })}
            engine={engine}
          />
        </div>
      </div>
      <Modal
        className=""
        title="删除所选元素确认"
        open={isModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      >
        <p>确定将所选元素删除？</p>
      </Modal>
    </>
  );
};

export default Diagrams;
