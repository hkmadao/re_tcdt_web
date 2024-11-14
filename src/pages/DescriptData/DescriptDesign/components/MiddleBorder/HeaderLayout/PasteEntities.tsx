import { FC, useRef } from 'react';
import { useState } from 'react';
import { Button, Input, Modal, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/DescriptData/DescriptDesign/conf';
import {
  actions,
  selectEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/store';
import type { TEntity } from '@/pages/DescriptData/DescriptDesign/models';
import { message } from 'antd/es';
import { TextAreaRef } from 'antd/lib/input/TextArea';

const PasteEntities: FC = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextAreaRef>(null);
  const collection = useSelector(selectEntityCollection);

  const handleOpenModal = () => {
    if (inputRef.current?.resizableTextArea) {
      inputRef.current.resizableTextArea.textArea.value = '';
    }
    setModalVisible(true);
  };

  const handleOk = () => {
    const inputValue = inputRef.current?.resizableTextArea?.textArea.value;
    if (inputValue) {
      const entitiesJson = JSON.parse(inputValue) as TEntity[];
      dispatch(actions.patseEntities(entitiesJson));
      setModalVisible(false);
      return;
    }
    message.error('请输入数据');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'粘贴实体'}>
        <Button
          icon={<BlockOutlined />}
          onClick={handleOpenModal}
          disabled={!collection?.idEntityCollection}
          size={'small'}
        />
      </Tooltip>
      <Modal
        width={'500px'}
        title={'粘贴实体'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <Input.TextArea ref={inputRef} rows={4}></Input.TextArea>
      </Modal>
    </>
  );
};

export default PasteEntities;
