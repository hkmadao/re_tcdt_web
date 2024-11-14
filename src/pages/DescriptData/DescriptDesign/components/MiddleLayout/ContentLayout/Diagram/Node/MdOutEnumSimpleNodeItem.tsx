import React, { FC, useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
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
  TEnum,
  TEnumAttribute,
} from '@/pages/DescriptData/DescriptDesign/models';
import {
  selectNodeUis,
  actions,
  selectConnectionMode,
} from '@/pages/DescriptData/DescriptDesign/store';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import { moduleName } from '@/pages/DescriptData/DescriptDesign/conf';

interface TMdEnumItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdOutEnumSimpleNodeItem: FC<TMdEnumItemProps> = (
  props: TMdEnumItemProps,
) => {
  const { node, engine } = props;
  const idElement = node.getExtras().idElement;

  const maxHeight = 600;
  const minHeight = 250;
  const maxWidth = 600;
  const minWidth = 200;
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(250);
  const [tabHeight, setTabHeight] = useState(150);
  const [dataSource, setDataSource] = useState<TEnumAttribute[]>([]);
  const nodeUis = useSelector(selectNodeUis);
  const [border, setBorder] = useState('');
  const connectionMode = useSelector(selectConnectionMode);
  const ddEnum = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].entityCollection.outEnums?.find(
      (enumFind) => enumFind.idEnum === idElement,
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
    if (ddEnum?.attributes) {
      setDataSource(
        ddEnum?.attributes.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ),
      );
    }
    const nodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === ddEnum?.idEnum,
    );
    if (nodeUi) {
      setWidth(nodeUi.width as number);
      setHeight(nodeUi.height as number);
      setTabHeight((nodeUi.height as number) - 100);
    }
  }, [ddEnum]);

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
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    }
    if (currentHeight < minHeight) {
      currentHeight = minHeight;
    }
    if (currentWidth > maxWidth) {
      currentWidth = maxWidth;
    }
    if (currentWidth < minWidth) {
      currentWidth = minWidth;
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
      (nodeUi) => nodeUi.idElement === ddEnum?.idEnum,
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

  const columns = [
    {
      key: 'idEnumAttribute',
      title: '',
      dataIndex: 'idEnumAttribute',
      width: 40,
      render: (_text: any, record: TEnumAttribute) => {
        let relation = '';
        return <span className={styles.nodeItemTableRelation}>{relation}</span>;
      },
    },
    {
      key: 'displayName',
      title: '显示名称',
      dataIndex: 'displayName',
    },
  ];

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
            className={styles.outEnumNodeItemBox}
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
                {ddEnum?.className}
              </Col>
              <Col span={1}></Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center', fontSize: '15px' }}>
                {ddEnum?.displayName}
              </Col>
            </Row>
            <Row
              style={{
                borderTop: '1px solid rgba(0, 0, 0, 0.5)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
                backgroundColor: 'white',
                fontSize: '15px',
              }}
            >
              <Col span={24} style={{}}>
                ...
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center', fontSize: '16px' }}>
                {ddEnum?.className}
              </Col>
            </Row>
            {/* <Row onWheel={(e) => e.stopPropagation()}>
            <Col span={24} style={{}}>
              <Table
                rowClassName={classNames(styles.row)}
                className={classNames(styles.table)}
                dataSource={dataSource}
                columns={columns}
                rowKey="idEnumAttribute"
                pagination={false}
                bordered={true}
                size={'small'}
                scroll={{ y: tabHeight }}
              />
            </Col>
          </Row> */}
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default MdOutEnumSimpleNodeItem;
