/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { TableOutlined, BorderlessTableOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../conf';
import { TDescriptionInfo } from '../model';

const DragTreeNode: React.FC<TDescriptionInfo> = (props) => {
  const nodeData: TDescriptionInfo = props;
  const [title, setTitle] = useState<string>();
  useEffect(() => {
    if (nodeData.entityInfo) {
      setTitle(nodeData.attributeName + '_' + nodeData.entityInfo?.className);
    } else {
      setTitle(nodeData.attributeName);
    }
  }, [nodeData]);

  interface DropResult {
    partName: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateFunc: Function;
  }

  const [, drag] = useDrag(() => ({
    type: ItemTypes.Tree,
    item: nodeData,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // eslint-disable-next-line no-console
        console.log(
          `You dropped ${item.title} into ${dropResult.partName} ${dropResult.name}!`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div ref={drag}>
      <div>
        {nodeData.fgPartner ? <TableOutlined /> : <BorderlessTableOutlined />}
        {/* {nodeData.fgAggAttribute ? '#' : '🖊'} */}
        <span style={{ marginLeft: '5px' }}>{title}</span>
      </div>
    </div>
  );
};

export default DragTreeNode;
