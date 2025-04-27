import React, { FC, useEffect, useState } from 'react';
import { Row, Col, Space, Divider } from 'antd';
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
  TNodeUi,
  TConcreteDiagram,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  selectNodeUis,
  actions,
  selectConnectionMode,
} from '@/pages/DescriptData/DescriptDesign/store';
import { PortModelType } from '../const';
import {
  EnumNodeUi,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import classnames from 'classnames';

interface TMdEntityItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdEntitySimpleNodeItem: FC<TMdEntityItemProps> = (
  props: TMdEntityItemProps,
) => {
  const { node, engine } = props;
  const idElement = node.getExtras().idElement;

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(250);
  const [tabHeight, setTabHeight] = useState(150);
  const nodeUis = useSelector(selectNodeUis);
  const connectionMode = useSelector(selectConnectionMode);

  const [nodeActive, setNodeActive] = useState<boolean>(false);
  const entity = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].entityCollection.entities?.find(
      (entityFind) => entityFind.idEntity === idElement,
    );
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setNodeActive(node.isSelected());
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
    if (currentHeight > EnumNodeUi.ENTITY_SIMPLE_MAX_HEIGHT) {
      currentHeight = EnumNodeUi.ENTITY_SIMPLE_MAX_HEIGHT;
    }
    if (currentHeight < EnumNodeUi.ENTITY_SIMPLE_MIN_HEIGHT) {
      currentHeight = EnumNodeUi.ENTITY_SIMPLE_MIN_HEIGHT;
    }
    if (currentWidth > EnumNodeUi.ENTITY_SIMPLE_MAX_WIDTH) {
      currentWidth = EnumNodeUi.ENTITY_SIMPLE_MAX_WIDTH;
    }
    if (currentWidth < EnumNodeUi.ENTITY_SIMPLE_MIN_WIDTH) {
      currentWidth = EnumNodeUi.ENTITY_SIMPLE_MIN_WIDTH;
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
      width: Math.floor(width),
      height: Math.floor(height),
    };
    dispatch(actions.updateNodeUi(entityUI));
  };

  /**实体被选择事件 */
  const handleEntityClick = () => {};

  return (
    <div
      // hidden={entity?.action === DOStatus.DELETED}
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
          <PortWidget
            className={classNames(
              styles.portWidgetSources,
              connectionMode && styles.isLineConnect,
            )}
            port={node.getPort(PortModelType.SOURCE) as PortModel}
            engine={engine}
          ></PortWidget>
          <div
            style={{ width, height }}
            className={classnames({
              [styles.nodeItemBox]: true,
              [styles.nodeItemActiveBorder]: nodeActive,
            })}
          >
            {/* <Space size={10} direction={'vertical'}> */}
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
            {/* </Space> */}
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default MdEntitySimpleNodeItem;
