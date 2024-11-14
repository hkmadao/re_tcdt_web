import { FC, Key, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { Observer, TMessage } from '@/util/observer';
import { subject, actionTableConf } from '../../conf';
import { TTree } from '@/models';

const TableToolBar: FC<{
  idLayout: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
}> = ({ idLayout, fgDisabled }) => {
  const [componentFgDiabled, setComponentFgDiabled] =
    useState<boolean>(fgDisabled);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [multiButtonContent, setMultiButtonContent] = useState<string>('多选');
  const [nodeTreeData, setTreeNodeData] = useState<TTree>();
  const [selectRows, setSelectRows] = useState<any[]>([]);
  const [rowSelectionType, setRowSelectionType] = useState<
    'checkbox' | 'radio'
  >('radio');

  useEffect(() => {
    setComponentFgDiabled(fgDisabled);
  }, [fgDisabled]);

  useEffect(() => {
    const treeNodeObserver: Observer = {
      topic: 'treeNodeSelected',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        (async () => {
          if (!message) {
            return;
          }
          const nodeData: TTree = message?.data as TTree;
          setTreeNodeData(nodeData);
        })();
      },
    };
    subject.subscribe(treeNodeObserver);

    const treeNodeCancelObserver: Observer = {
      topic: 'treeSelectCancel',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        (async () => {
          if (!message || message.consumerIds.includes(idLayout)) {
            return;
          }
          setTreeNodeData(undefined);
        })();
      },
    };
    subject.subscribe(treeNodeCancelObserver);

    const selectRowsObserver: Observer = {
      topic: 'selectRows',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
        setSelectRows(message.data);
      },
    };
    subject.subscribe(selectRowsObserver);

    const listReloadObserver: Observer = {
      topic: 'listReload',
      consumerId: idLayout,
      update: function (message: TMessage): void {
        if (message.consumerIds.includes(idLayout)) {
          return;
        }
      },
    };
    subject.subscribe(listReloadObserver);

    //销毁观察者
    return () => {
      subject.unsubsribe(treeNodeObserver);
      subject.unsubsribe(treeNodeCancelObserver);
      subject.unsubsribe(selectRowsObserver);
      subject.unsubsribe(listReloadObserver);
    };
  }, []);

  const handleToAdd = () => {
    subject.publish({
      topic: 'toAdd',
      producerId: idLayout,
      data: { treeSelectedNode: nodeTreeData },
    });
    subject.publish({
      topic: '/page/change',
      producerId: idLayout,
      data: 'form',
    });
  };

  const handleToEdit = () => {
    subject.publish({
      topic: 'toEdit',
      producerId: idLayout,
      data: { treeSelectedNode: nodeTreeData, selectedRow: selectRows[0] },
    });
    subject.publish({
      topic: '/page/change',
      producerId: idLayout,
      data: 'form',
    });
  };

  const handleRowsDelete = () => {
    setIsModalVisible(true);
  };

  const handleRowSelectType = () => {
    if (rowSelectionType !== 'checkbox') {
      setMultiButtonContent('取消多选');
      subject.publish({
        topic: 'checkbox',
        producerId: idLayout,
        data: undefined,
      });
      setRowSelectionType('checkbox');
      setSelectRows([]);
      return;
    }
    subject.publish({
      topic: 'radio',
      producerId: idLayout,
      data: undefined,
    });
    setRowSelectionType('radio');
    setMultiButtonContent('多选');
    setSelectRows([]);
  };

  const handleOk = () => {
    subject.publish({
      topic: 'deletes',
      producerId: idLayout,
      data: undefined,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleReflesh = () => {
    subject.publish({
      topic: 'reflesh',
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
          gap: actionTableConf?.gap ?? '10px',
          justifyContent: actionTableConf?.justifyContent ?? 'start',
          flexWrap: 'wrap',
        }}
      >
        <Button
          key={'Yaemso7Bx8TnTKyAL5p08'}
          size={'middle'}
          type={'primary'}
          onClick={handleToAdd}
        >
          {'新增'}
        </Button>
        <Button
          key={'xbjAsQ1gFa9KcJaMNGIRw'}
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length !== 1}
          onClick={handleToEdit}
        >
          {'编辑'}
        </Button>
        <Button
          key={'NNJXyz0Rnc5_v6K8DKAIi'}
          size={'middle'}
          type={'primary'}
          hidden={rowSelectionType === 'radio'}
          onClick={handleRowSelectType}
        >
          {'单选'}
        </Button>
        <Button
          key={'XbFycueAxA7_07UuDg8SW'}
          size={'middle'}
          type={'primary'}
          hidden={rowSelectionType === 'checkbox'}
          onClick={handleRowSelectType}
        >
          {'多选'}
        </Button>
        <Button
          key={'ptRZSv-d68ViqVt7iqJdj'}
          size={'middle'}
          type={'primary'}
          disabled={selectRows?.length == 0}
          onClick={handleRowsDelete}
        >
          {'删除'}
        </Button>
        <Button
          key={'54GGZiQyODGo3UkDLYj3A'}
          size={'middle'}
          type={'primary'}
          onClick={handleReflesh}
        >
          {'刷新'}
        </Button>
      </div>
      <Modal
        title="删除确认"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定删除所选记录？</p>
      </Modal>
    </>
  );
};

export default TableToolBar;
