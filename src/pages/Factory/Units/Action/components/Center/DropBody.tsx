import { FC } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { actions } from '../../store';
import { useFgLoadData, useModuleData } from '../../hooks';
import { dragItemTypeMap } from '../../conf';
import ButtonItem from './ButtonItem';

const DropBody: FC = () => {
  const moduleData = useModuleData();
  const fgLoadData = useFgLoadData();
  const dispatch = useDispatch();

  const [{ canDrop, isOverCurrent, isOver }, drop] = useDrop(
    () => ({
      accept: [dragItemTypeMap.COMPONENT],
      drop: (nodeData: any, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }

        if (monitor.getItemType() === dragItemTypeMap.COMPONENT) {
          dispatch(
            actions.addCondition({
              label: nodeData.label,
              nameScript: "'" + nodeData.label + "'",
              clickEventName: nodeData.clickEventName,
              disableScript: nodeData.disableScript,
              hiddenScript: nodeData.hiddenScript,
            }),
          );
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  );

  const handleClick = (e: any) => {
    e.stopPropagation();
  };

  let backgroundColor = 'white';

  if (isOverCurrent) {
    backgroundColor = 'darkgreen';
  }
  return (
    <div
      ref={drop}
      onClick={handleClick}
      style={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        backgroundColor,
      }}
    >
      <div
        style={{
          display: fgLoadData ? 'flex' : 'none',
          flex: moduleData.buttons.length === 0 ? '0 1 50px' : '0 1 auto',
          gap: moduleData?.gap ?? '10px',
          justifyContent: moduleData?.justifyContent ?? 'start',
          border: '1px dashed black',
          flexWrap: 'wrap',
          padding: '5px',
        }}
      >
        {moduleData.buttons?.map((data, i) => {
          return <ButtonItem key={data.idButton} {...data} />;
        })}
      </div>
    </div>
  );
};

export default DropBody;
