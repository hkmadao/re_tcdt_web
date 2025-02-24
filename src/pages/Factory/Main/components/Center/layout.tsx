import { CSSProperties, FC, useEffect, useRef } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { TLayout } from '../../model';
import { dragItemNameMap, dragItemTypeMap } from '../../conf';
import { selectCurrentLayout, actions } from '../../store';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, message } from 'antd';
import { useAssoByCurrentPageAndLayoutId, useLayoutByLayoutId } from '../hooks';

const Layout: FC<
  Omit<TLayout, 'children'> & { layoutChildren: TLayout[]; children: any }
> = ({
  idParent,
  id,
  direction,
  type,
  flexType,
  flexStr,
  layoutChildren,
  children,
}) => {
  const dispatch = useDispatch();
  const activeLayout = useSelector(selectCurrentLayout);
  const { asso } = useAssoByCurrentPageAndLayoutId(id);
  const currentLayout = useLayoutByLayoutId(id);

  const [{ canDrop, isOverCurrent, isOver }, drop] = useDrop(
    () => ({
      accept:
        currentLayout?.type === 'layout'
          ? [dragItemTypeMap.LAYOUT, dragItemTypeMap.COMPONENT]
          : [],
      drop: (nodeData: any, monitor: DropTargetMonitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }

        if (monitor.getItemType() === dragItemTypeMap.LAYOUT) {
          if (nodeData.name === dragItemNameMap.LAYOUT_SINGLE) {
            dispatch(
              actions.addSingleLayout({
                idParent: id,
                type: 'layout',
              }),
            );
          }
          if (nodeData.name === dragItemNameMap.LAYOUT_ROW) {
            if (
              currentLayout?.children &&
              currentLayout?.children.length > 0 &&
              currentLayout.direction === 'column'
            ) {
              message.error(
                `布局${currentLayout.title}已存在子布局，不能放置横向布局！`,
              );
              return;
            }
            dispatch(
              actions.addLayout({
                idParent: id,
                direction: 'row',
                type: 'layout',
              }),
            );
          }
          if (nodeData.name === dragItemNameMap.LAYOUT_COLUMN) {
            if (
              currentLayout?.children &&
              currentLayout?.children.length > 0 &&
              currentLayout.direction === 'row'
            ) {
              message.error(
                `布局${currentLayout.title}已存在子布局，不能放置纵向布局！`,
              );
              return;
            }
            dispatch(
              actions.addLayout({
                idParent: id,
                direction: 'column',
                type: 'layout',
              }),
            );
          }
        }
        if (monitor.getItemType() === dragItemTypeMap.COMPONENT) {
          if (currentLayout?.children && currentLayout?.children.length > 0) {
            message.error(
              `布局${currentLayout.title}已存在子布局，不能放置组件！`,
            );
            return;
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_TREE) {
            dispatch(actions.toggleLayout({ id, componentType: 'tree' }));
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_SEARCH) {
            dispatch(actions.toggleLayout({ id, componentType: 'search' }));
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_TABLE) {
            dispatch(
              actions.toggleLayout({ id, componentType: 'viewBillform' }),
            );
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_FORM) {
            dispatch(
              actions.toggleLayout({ id, componentType: 'editBillform' }),
            );
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_TABLE_BUTTON) {
            dispatch(actions.toggleLayout({ id, componentType: 'viewButton' }));
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_FORM_BUTTON) {
            dispatch(actions.toggleLayout({ id, componentType: 'editButton' }));
          }
          if (nodeData.name === dragItemNameMap.COMPNENT_CUSTOM) {
            dispatch(actions.toggleLayout({ id, componentType: 'custom' }));
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [currentLayout],
  );

  const handleClick = (e: any) => {
    dispatch(actions.setCurrentLayoutId(id));
    e.stopPropagation();
  };

  const handleDelete = (e: any) => {
    if (idParent) {
      dispatch(actions.removeLayout({ idParent, id }));
    }
  };

  let backgroundColor = 'white';

  if (isOverCurrent) {
    if (type === 'layout') {
      backgroundColor = 'darkgreen';
    } else {
      backgroundColor = 'red';
    }
  }

  return (
    <>
      <div
        ref={drop}
        id={id}
        onClick={handleClick}
        hidden={asso?.hidden}
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          margin: '5px',
          backgroundColor,
          flex: flexStr ?? '1 1 auto',
          border: '1px dashed #40a9ff',
          outline: activeLayout?.id === id ? '2px solid blue' : undefined,
        }}
      >
        <div
          style={{
            display: id === 'root' ? 'none' : 'flex',
            overflow: 'hidden',
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: activeLayout?.id === id ? 'auto' : '0px',
          }}
        >
          <div>{type == 'layout' ? '布局' : '组件'}</div>
          <div>
            <Popconfirm
              disabled={id === 'root'}
              placement="top"
              title={'确定要删除？'}
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined
                disabled={id === 'root'}
                style={{ color: 'blue' }}
              />
            </Popconfirm>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: direction,
            margin: '5px',
            border: type !== 'layout' ? '1px dashed #ff4d4f' : undefined,
            cursor: asso?.disabled ? 'not-allowed' : undefined,
            opacity: asso?.disabled ? '0.6' : '1',
            overflow: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
