import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button, Collapse, Space } from 'antd';
import { dragItemNameMap, dragItemTypeMap } from '../../conf';
import { DropResult } from '../../model';
import Action from './Action';
import { useFgLoadData } from '../../hooks';

const Left: FC = () => {
  const { Panel } = Collapse;
  const fgLoadData = useFgLoadData();

  const handleChange = () => {};

  const [, dragViewAdd] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.VIEW_ADD,
      clickEventName: 'handleToAdd',
      label: '新增',
      disableScript: '!nodeTreeData',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragViewEdit] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.VIEW_EDIT,
      clickEventName: 'handleToEdit',
      label: '编辑',
      disableScript: 'selectRows?.length !== 1',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragRadio] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.VIEW_SELECT_TYPE,
      clickEventName: 'handleRowSelectType',
      label: '单选',
      disableScript: '!nodeTreeData',
      hiddenScript: "rowSelectionType === 'radio'",
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragCheckbox] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.VIEW_SELECT_TYPE,
      clickEventName: 'handleRowSelectType',
      label: '多选',
      disableScript: '!nodeTreeData',
      hiddenScript: "rowSelectionType === 'checkbox'",
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragViewRemove] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.VIEW_REMOVE,
      clickEventName: 'handleRowsDelete',
      label: '删除',
      disableScript: 'selectRows?.length == 0',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragEditSave] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.EDIT_SAVE,
      clickEventName: 'handleSave',
      label: '保存',
      disableScript: '!nodeTreeData',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragEditAddAgain] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.EDIT_ADD_AGAIN,
      clickEventName: 'handleAddAgain',
      label: '保存并新增',
      disableScript: '!nodeTreeData',
      hiddenScript: '!fgAdd',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragEditCancel] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.EDIT_CANCEL,
      clickEventName: 'handleCancel',
      label: '取消',
      disableScript: '!nodeTreeData',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragReflesh] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: {
      name: dragItemNameMap.REFLESH,
      clickEventName: 'handleReflesh',
      label: '刷新',
      disableScript: '!nodeTreeData',
      hiddenScript: '!fgAdd',
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const [, dragCustome] = useDrag(() => ({
    type: dragItemTypeMap.COMPONENT,
    item: { name: dragItemNameMap.CUSTOM, clickEventName: '', label: '自定义' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
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
          defaultActiveKey={['component']}
          onChange={handleChange}
          style={{
            width: '100%',
            display: fgLoadData ? undefined : 'none',
          }}
        >
          <Panel header="组件" key="component">
            <Space size={'small'} align="center" wrap>
              <div ref={dragViewAdd}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>新增</Button>
              </div>
              <div ref={dragViewEdit}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>编辑</Button>
              </div>
              <div ref={dragRadio}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>单选</Button>
              </div>
              <div ref={dragCheckbox}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>多选</Button>
              </div>
              <div ref={dragViewRemove}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>删除</Button>
              </div>
              <div ref={dragEditSave}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>保存</Button>
              </div>
              <div ref={dragEditAddAgain}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>
                  保存并新增
                </Button>
              </div>
              <div ref={dragEditCancel}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>取消</Button>
              </div>
              <div ref={dragReflesh}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>刷新</Button>
              </div>
              <div ref={dragCustome}>
                <Button style={{ backgroundColor: '#f4f6fc' }}>自定义</Button>
              </div>
            </Space>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Left;
