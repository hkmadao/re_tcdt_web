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
  TEnum,
  TEnumAttribute,
} from '@/pages/ComponentData/ComponentDesign/models';
import {
  selectComponentNodeUis,
  actions,
} from '@/pages/ComponentData/ComponentDesign/store';
import { PortModelType } from '../const';
import { DOStatus } from '@/models/enums';
import { moduleName } from '@/pages/ComponentData/ComponentDesign/conf';

interface TMdEnumItemProps {
  node: MdNodeModel<TConcreteDiagram>;
  engine: DiagramEngine;
}

/**渲染的图形 */
const MdOutEnumNodeItem: FC<TMdEnumItemProps> = (props: TMdEnumItemProps) => {
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
  const nodeUis = useSelector(selectComponentNodeUis);
  const [border, setBorder] = useState('');
  const ddEnum = useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleName].component.outEnums?.find(
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
      key: 'code',
      title: 'code',
      dataIndex: 'code',
    },
    {
      key: 'enumValue',
      title: '枚举值',
      dataIndex: 'enumValue',
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
        <div
          className={styles.outEnumNodeItemBox}
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
            <Col span={20} style={{ textAlign: 'center', fontSize: '16px' }}>
              &lt;&lt;枚举[{ddEnum?.className}]&gt;&gt;
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center', fontSize: '16px' }}>
              {ddEnum?.displayName}
            </Col>
          </Row>
          <Row onWheel={(e) => e.stopPropagation()}>
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
          </Row>
        </div>
      </ResizableBox>
    </div>
  );
};

export default MdOutEnumNodeItem;
