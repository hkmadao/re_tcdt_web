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
  TComponentNodeUi,
  TConcreteDiagram,
  TModuleStore,
  TExtAttribute,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  selectComponentNodeUis,
  actions,
} from '@/pages/ComponentData/ComponentDesign/store';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import {
  EnumNodeUi,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import classnames from 'classnames';

interface TMdEntityItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdEntityNodeItem: FC<TMdEntityItemProps> = (
  props: TMdEntityItemProps,
) => {
  const { node, engine } = props;
  const idElement = node.getExtras().idElement;

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(250);
  const [tabHeight, setTabHeight] = useState(150);
  const [dataSource, setDataSource] = useState<TExtAttribute[]>([]);
  const nodeUis = useSelector(selectComponentNodeUis);
  const [border, setBorder] = useState('');
  const [nodeActive, setNodeActive] = useState<boolean>(false);
  const componentEntity = useSelector(
    (state: { [x: string]: TModuleStore }) => {
      return state[moduleName].component.componentEntities?.find(
        (entityFind) => entityFind.idComponentEntity === idElement,
      );
    },
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setNodeActive(node.isSelected());
    if (node.isSelected()) {
      setBorder('2px solid rgb(0, 192, 255)');
      return;
    }
    setBorder('2px solid rgb(0, 0, 0)');
  }, [props]);

  useEffect(() => {
    if (componentEntity?.ddEntity) {
      setDataSource(
        componentEntity.extAttributes?.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ) || [],
      );
    }
    const nodeUi = nodeUis?.find(
      (nodeUi) => nodeUi.idElement === componentEntity?.idComponentEntity,
    );
    if (nodeUi) {
      setWidth(nodeUi.width as number);
      setHeight(nodeUi.height as number);
      setTabHeight((nodeUi.height as number) - 100);
    }
  }, [componentEntity]);

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
    if (currentHeight > EnumNodeUi.ENTITY_MAX_HEIGHT) {
      currentHeight = EnumNodeUi.ENTITY_MAX_HEIGHT;
    }
    if (currentHeight < EnumNodeUi.ENTITY_MIN_HEIGHT) {
      currentHeight = EnumNodeUi.ENTITY_MIN_HEIGHT;
    }
    if (currentWidth > EnumNodeUi.ENTITY_MAX_WIDTH) {
      currentWidth = EnumNodeUi.ENTITY_MAX_WIDTH;
    }
    if (currentWidth < EnumNodeUi.ENTITY_MIN_WIDTH) {
      currentWidth = EnumNodeUi.ENTITY_MIN_WIDTH;
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
      (nodeUi) => nodeUi.idElement === componentEntity?.idComponentEntity,
    );
    const entityUI: TComponentNodeUi = {
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
      key: 'idExtAttribute',
      title: '',
      dataIndex: 'idExtAttribute',
      width: 40,
      render: (_text: any, record: TExtAttribute) => {
        let relation = '';
        if (record.attribute?.fgPrimaryKey) {
          relation = '主';
        }
        return <span className={styles.nodeItemTableRelation}>{relation}</span>;
      },
    },
    {
      key: 'displayName',
      title: '名称',
      dataIndex: 'displayName',
      render: (_text: any, record: TExtAttribute) => {
        return (
          <span className={styles.nodeItemTableRelation}>
            {record.attribute?.displayName}
          </span>
        );
      },
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
            className={classNames(styles.portWidgetTarget)}
            port={node.getPort(PortModelType.TARGET) as PortModel}
            engine={engine}
          ></PortWidget>
          <PortWidget
            className={classNames(styles.portWidgetSources)}
            port={node.getPort(PortModelType.SOURCE) as PortModel}
            engine={engine}
          ></PortWidget>
          <div className={styles.nodeItemBox} style={{ border, width, height }}>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                实体[{componentEntity?.ddEntity?.className}]
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                {componentEntity?.ddEntity?.displayName}
              </Col>
            </Row>
            <Row onWheel={(e) => e.stopPropagation()}>
              <Col span={24} style={{}}>
                <Table
                  rowClassName={classNames(styles.row)}
                  className={classNames(styles.table)}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey="idAttribute"
                  pagination={false}
                  bordered={true}
                  size={'small'}
                  scroll={{ y: tabHeight }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default MdEntityNodeItem;
// export default MdEntityNodeItem;
