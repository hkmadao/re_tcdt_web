import { FC, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { Observer, TMessage } from '@/util/observer';
import { subject, actionFormConf } from '../../conf';

const FormToolBar: FC<{
  idLayout: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
}> = ({ idLayout, fgDisabled }) => {
  const [componentFgDiabled, setComponentFgDiabled] =
    useState<boolean>(fgDisabled);
  const [fgAdd, setFgAdd] = useState<boolean>(true);

  useEffect(() => {
    setComponentFgDiabled(fgDisabled);
  }, [fgDisabled]);

  useEffect(() => {
    const toAddObserver: Observer = {
      topic: 'toAdd',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
        setFgAdd(true);
      },
    };
    subject.subscribe(toAddObserver);

    const toEditObserver: Observer = {
      topic: 'toEdit',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
        setFgAdd(false);
      },
    };
    subject.subscribe(toEditObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(toAddObserver);
      subject.unsubsribe(toEditObserver);
    };
  }, []);

  const handleSave = () => {
    if (fgAdd) {
      subject.publish({
        topic: 'add',
        producerId: idLayout,
        data: undefined,
      });
    } else {
      subject.publish({
        topic: 'edit',
        producerId: idLayout,
        data: undefined,
      });
    }
  };

  const handleAddAgain = () => {
    subject.publish({
      topic: 'addAgain',
      producerId: idLayout,
      data: undefined,
    });
  };

  const handleCancel = () => {
    subject.publish({
      topic: 'cancle',
      producerId: idLayout,
      data: undefined,
    });
  };

  const handleReflesh = () => {
    subject.publish({
      topic: 'detailReflesh',
      producerId: idLayout,
      data: undefined,
    });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 1 auto',
          gap: actionFormConf?.gap ?? '10px',
          justifyContent: actionFormConf?.justifyContent ?? 'start',
          flexWrap: 'wrap',
        }}
      >
        <Button
          key={'oCen_AWx0nenqL9oRVJSS'}
          size={'middle'}
          type={'primary'}
          disabled={componentFgDiabled}
          onClick={handleSave}
        >
          {'保存'}
        </Button>
        <Button
          key={'vgfMdkaa96AKvualg8Idn'}
          size={'middle'}
          type={'primary'}
          disabled={componentFgDiabled}
          onClick={handleCancel}
        >
          {'取消'}
        </Button>
        <Button
          key={'9ydSqUoHcwjDQuBsXzimj'}
          size={'middle'}
          type={'primary'}
          disabled={componentFgDiabled}
          onClick={handleReflesh}
          hidden={!fgAdd}
        >
          {'刷新'}
        </Button>
      </div>
    </>
  );
};

export default FormToolBar;
