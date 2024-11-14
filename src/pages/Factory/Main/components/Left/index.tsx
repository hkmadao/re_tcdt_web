import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button, Collapse, Space } from 'antd';
import { dragItemNameMap, dragItemTypeMap } from '../../conf';
import { DropResult } from '../../model';
import Pages from './Pages';
import LayoutTree from './LayoutTree';
import Action from './Action';
import { useFgLoadData } from '../../hooks';

const Left: FC = () => {
  const { Panel } = Collapse;
  const fgLoadData = useFgLoadData();

  const handleChange = () => {};

  const [, dragLayoutSingle] = useDrag(() => ({
    type: dragItemTypeMap.LAYOUT,
    item: { name: dragItemNameMap.LAYOUT_SINGLE },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragLayoutRow] = useDrag(() => ({
    type: dragItemTypeMap.LAYOUT,
    item: { name: dragItemNameMap.LAYOUT_ROW },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragLayoutColumn] = useDrag(() => ({
    type: dragItemTypeMap.LAYOUT,
    item: { name: dragItemNameMap.LAYOUT_COLUMN },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentTree] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_TREE },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentSearch] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_SEARCH },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentTable] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_TABLE },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentForm] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_FORM },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentTableButton] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_TABLE_BUTTON },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragComponentFormButton] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.COMPNENT_FORM_BUTTON },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${dropResult.id} into ${dropResult.idParent} !`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          width: '20%',
          margin: '5px',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <Action />
        <Collapse
          defaultActiveKey={['page', 'layout', 'component', 'componentTree']}
          onChange={handleChange}
          style={{
            width: '100%',
            display: !fgLoadData ? 'none' : undefined,
          }}
        >
          <Panel header="页面" key="page">
            <Pages />
          </Panel>
          <Panel header="布局" key="layout">
            <Space size={5} align="center" wrap>
              <div ref={dragLayoutSingle}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>单布局</Button>
              </div>
              <div ref={dragLayoutRow}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>左右布局</Button>
              </div>
              <div
                ref={dragLayoutColumn}
                style={{ backgroundColor: '#f4f6fc' }}
              >
                <Button style={{ backgroundColor: '#f4f6fc' }}>上下布局</Button>
              </div>
            </Space>
          </Panel>
          <Panel header="组件" key="component">
            <Space size={'small'} align="center" wrap>
              <div ref={dragComponentTree}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>树组件</Button>
              </div>
              <div ref={dragComponentSearch}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>查询组件</Button>
              </div>
              <div ref={dragComponentTable}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>列表组件</Button>
              </div>
              <div ref={dragComponentForm}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>表单组件</Button>
              </div>
              <div ref={dragComponentTableButton}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>
                  列表按钮组件
                </Button>
              </div>
              <div ref={dragComponentFormButton}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>
                  表单按钮组件
                </Button>
              </div>
            </Space>
          </Panel>
          <Panel header="组件树" key="componentTree">
            <LayoutTree />
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Left;
