import type { FC, MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';
import { message, Button } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../../../common/conf';
import { actions } from '../../store';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { TButton } from '../../model';
import { useButtonById, useCurrentButton } from '../../hooks';

const ButtonItem: FC<TButton> = ({ ...bt }) => {
  const currentButton = useCurrentButton();
  const buttonConf = useButtonById(bt.idButton);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  useEffect(() => {
    drag(drop(ref));
  }, []);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (dragItem: TButton) => {
      if (dragItem.idButton === buttonConf?.idButton) {
        return { name: buttonConf?.label };
      }
      dispatch(
        actions.switchConditionOrder({
          drag: dragItem,
          hover: buttonConf!,
        }),
      );

      return buttonConf;
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover() {},
  });

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: buttonConf, //此处存在闭包捕获问题，需要传递引用
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<TButton>();
        if (item && dropResult) {
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [bt.idButton],
  );

  // 删除
  const handleDelete = () => {
    dispatch(actions.deleteCondition(buttonConf!));
    message.warning('删除[' + buttonConf?.label + ']按钮！');
  };

  /**点击字段 */
  const fieldClick = (e: any) => {
    e.stopPropagation();
    dispatch(
      actions.setCurrent({
        type: 'field',
        id: buttonConf?.idButton!,
      }),
    );
  };

  /**字段键盘事件 */
  const fieldKeyUp = (e: any) => {
    e.stopPropagation();
    const ke = e as KeyboardEvent;
    if (ke.code === 'Delete') {
      dispatch(actions.deleteCondition(buttonConf!));
      message.warning('删除[' + buttonConf?.label + ']按钮！');
    }
  };

  return (
    <>
      <span
        style={{
          border:
            currentButton?.idButton === bt.idButton
              ? '1px solid red'
              : undefined,
        }}
        ref={ref}
        data-handler-id={handlerId}
        onClick={fieldClick}
        onKeyUp={fieldKeyUp}
      >
        <div className={styles['component']}>
          <Button
            key={buttonConf?.idButton}
            size={buttonConf?.buttonSize}
            type={(buttonConf?.type ?? 'primary') as any}
          >
            {buttonConf?.label}
          </Button>
          <div className={styles['component-delete']} onClick={handleDelete}>
            <DeleteOutlined className={styles['component-delete-icon']} />
          </div>
        </div>
      </span>
    </>
  );
};

export default ButtonItem;
