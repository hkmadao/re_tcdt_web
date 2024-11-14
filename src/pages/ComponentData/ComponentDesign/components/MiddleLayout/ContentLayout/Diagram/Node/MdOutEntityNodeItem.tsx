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
  TEntity,
  TAttribute,
  TComponentNodeUi,
  TConcreteDiagram,
  TModuleStore,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  selectCurentSelectType,
  selectCurrentDiagramContent,
  selectFgShowOutEntities,
  selectComponentNodeUis,
  actions,
} from '@/pages/ComponentData/ComponentDesign/store';
import {
  EnumConcreteDiagramType,
  EnumNodeUi,
  moduleName,
} from '@/pages/ComponentData/ComponentDesign/conf';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';

interface TMdOutEntityItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdOutEntityNodeItem: FC<TMdOutEntityItemProps> = (
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
  const nodeUis = useSelector(selectComponentNodeUis);
  const currentDiagramContent = useSelector(selectCurrentDiagramContent);
  const [border, setBorder] = useState('');

  const entity = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].component.outEntities?.find(
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
    if (entity?.attributes) {
      setDataSource(
        entity?.attributes.filter(
          (entityAttr) => entityAttr.action !== DOStatus.DELETED,
        ),
      );
    }
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
    if (currentHeight > EnumNodeUi.OUT_ENTITY_MAX_HEIGHT) {
      currentHeight = EnumNodeUi.OUT_ENTITY_MAX_HEIGHT;
    }
    if (currentHeight < EnumNodeUi.OUT_ENTITY_MIN_HEIGHT) {
      currentHeight = EnumNodeUi.OUT_ENTITY_MIN_HEIGHT;
    }
    if (currentWidth > EnumNodeUi.OUT_ENTITY_MAX_WIDTH) {
      currentWidth = EnumNodeUi.OUT_ENTITY_MAX_WIDTH;
    }
    if (currentWidth < EnumNodeUi.OUT_ENTITY_MIN_WIDTH) {
      currentWidth = EnumNodeUi.OUT_ENTITY_MIN_WIDTH;
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
      key: 'idAttribute',
      title: '',
      dataIndex: 'idAttribute',
      width: 40,
      render: (_text: any, record: TAttribute) => {
        let relation = '';
        if (record.fgPrimaryKey) {
          relation = '主';
        }
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
        <div
          className={styles.outEntityNodeItemBox}
          style={{ border, width, height }}
        >
          <Row>
            <Col span={2}>
              <PortWidget
                style={{
                  top: 2,
                  right: 2,
                  height: 15,
                  width: 15,
                  position: 'relative',
                  background: '#e68c61',
                  cursor: 'pointer',
                }}
                port={node.getPort(PortModelType.TARGET) as PortModel}
                engine={engine}
              ></PortWidget>
            </Col>
            <Col span={20}>实体[{entity?.className}]</Col>
          </Row>
          <Row>
            <Col span={24}>{entity?.displayName}</Col>
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
      </ResizableBox>
    </div>
  );
};

export default MdOutEntityNodeItem;