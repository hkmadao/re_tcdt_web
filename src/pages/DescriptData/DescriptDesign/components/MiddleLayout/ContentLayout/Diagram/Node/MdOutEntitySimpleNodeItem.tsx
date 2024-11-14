import React, { FC, useEffect, useState } from 'react';
import { Table, Row, Col, Divider } from 'antd';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MdNode.less';
import {
  DiagramEngine,
  PortModel,
  PortWidget,
} from '@projectstorm/react-diagrams';
import classNames from 'classnames';
import { MdNodeModel } from './MdNodeModel';
import {
  TEntity,
  TAttribute,
  TNodeUi,
  TConcreteDiagram,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  selectCurentSelectType,
  selectCurrentDiagramContent,
  selectFgShowOutEntities,
  selectNodeUis,
  actions,
  selectConnectionMode,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  EnumConcreteDiagramType,
  EnumNodeUi,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';

interface TMdOutEntityItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdOutEntitySimpleNodeItem: FC<TMdOutEntityItemProps> = (
  props: TMdOutEntityItemProps,
) => {
  const { node, engine } = props;
  const idEntity = node.getExtras().idElement;

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(250);
  const [tabHeight, setTabHeight] = useState(150);
  const [dataSource, setDataSource] = useState<TAttribute[]>([]);
  const curentSelectType = useSelector(selectCurentSelectType);
  const fgShowOutEntities = useSelector(selectFgShowOutEntities);
  const nodeUis = useSelector(selectNodeUis);
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const connectionMode = useSelector(selectConnectionMode);
  const [border, setBorder] = useState('');

  const entity = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].entityCollection.outEntities?.find(
      (entityFind) => entityFind.idEntity === idEntity,
    );
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (node.isSelected()) {
      setBorder('2px solid rgb(0, 192, 255)');
      return;
    }
    setBorder('2px solid rgb(0, 0, 0)');
  }, [props]);

  useEffect(() => {
    const nodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === entity?.idEntity,
    );
    if (nodeUi) {
      setWidth(nodeUi.width as number);
      setHeight(nodeUi.height as number);
      setTabHeight((nodeUi.height as number) - 100);
    }
  }, [entity]);

  // useEffect(() => {
  //   if (curentSelectType === EnumConcreteDiagramType.OUT_ENTITY) {
  //     const selectEntity: TEntity = currentDiagramContent as TEntity;
  //     if (selectEntity.idEntity === entity?.idEntity) {
  //       setBorder('2px solid rgb(0, 192, 255)');
  //       return;
  //     }
  //   }
  //   setBorder('2px solid #000');
  // }, [currentDiagramContent]);

  const handleRize: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const mouseEvent: MouseEvent = e as unknown as MouseEvent;
    if (!mouseEvent.altKey) {
      return;
    }
    let currentHeight = data.size.height;
    let currentWidth = data.size.width;
    if (currentHeight > EnumNodeUi.OUT_ENTITY_SIMPLE_MAX_HEIGHT) {
      currentHeight = EnumNodeUi.OUT_ENTITY_SIMPLE_MAX_HEIGHT;
    }
    if (currentHeight < EnumNodeUi.OUT_ENTITY_SIMPLE_MIN_HEIGHT) {
      currentHeight = EnumNodeUi.OUT_ENTITY_SIMPLE_MIN_HEIGHT;
    }
    if (currentWidth > EnumNodeUi.OUT_ENTITY_SIMPLE_MAX_WIDTH) {
      currentWidth = EnumNodeUi.OUT_ENTITY_SIMPLE_MAX_WIDTH;
    }
    if (currentWidth < EnumNodeUi.OUT_ENTITY_SIMPLE_MIN_WIDTH) {
      currentWidth = EnumNodeUi.OUT_ENTITY_SIMPLE_MIN_WIDTH;
    }
    let offsetY = currentHeight - height;
    setWidth(currentWidth);
    setHeight(currentHeight);
    setTabHeight(tabHeight + offsetY);
  };

  const handleRizeStop: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const nodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === entity?.idEntity,
    );
    const entityUI: TNodeUi = {
      ...nodeUi,
      width,
      height,
    };
    dispatch(actions.updateNodeUi(entityUI));
  };

  /**实体被选择事件 */
  const handleEntityClick = () => {
    // const entityUI:TEntityUI = {...node.getPosition()}
    // const selectDiagram: TSelectDiagram = {
    //   selectType: EnumDiagramSelectType.ENTITY,
    //   diagramContent: {...entity,entityUI},
    // };
    // dispatch(setCurrentSelect(selectDiagram));
  };

  return (
    <div
      // hidden={entity?.action === DOStatus.DELETED || !fgShowOutEntities}
      className={classNames(styles.nodeItemContainer)}
      onClick={handleEntityClick}
    >
      <ResizableBox
        className={styles.box}
        width={width}
        height={height}
        handle={
          <div
            className={'handleElement'}
            style={{ float: 'right', cursor: 'se-resize' }}
          >
            按住alt拖动缩放
          </div>
        }
        onResize={handleRize}
        onResizeStop={handleRizeStop}
      >
        <div>
          <PortWidget
            className={classNames(
              styles.portWidgetTarget,
              connectionMode && styles.isLineConnect,
            )}
            port={node.getPort(PortModelType.TARGET) as PortModel}
            engine={engine}
          ></PortWidget>
          {/* 设置了position:absolute,必须source\target同时出现，否则连线终点位置不正确 */}
          <PortWidget
            className={classNames(
              styles.portWidgetSources,
              // connectionMode && styles.isLineConnect,
            )}
            port={node.getPort(PortModelType.SOURCE) as PortModel}
            engine={engine}
          ></PortWidget>
          <div
            className={styles.outEntityNodeItemBox}
            style={{ border, width, height }}
          >
            <Row>
              <Col span={1}></Col>
              <Col
                span={22}
                style={{
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {entity?.className}
              </Col>
              <Col span={1}></Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center', fontSize: '16px' }}>
                {entity?.displayName}
              </Col>
            </Row>
            <Row className={classNames({ [`${styles.attribute}`]: true })}>
              <Col span={12} style={{}}>
                {entity?.pkAttributeCode && entity?.pkAttributeCode.length > 10
                  ? entity.pkAttributeCode.substring(0, 10) + '...'
                  : entity?.pkAttributeCode}
              </Col>
              <Col span={12} style={{}}>
                {entity?.pkAttributeName && entity?.pkAttributeName.length > 10
                  ? entity.pkAttributeName.substring(0, 10) + '...'
                  : entity?.pkAttributeName}
              </Col>
              <Col span={24} style={{}}>
                ...
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center', fontSize: '16px' }}>
                {entity?.tableName}
              </Col>
            </Row>
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default MdOutEntitySimpleNodeItem;
