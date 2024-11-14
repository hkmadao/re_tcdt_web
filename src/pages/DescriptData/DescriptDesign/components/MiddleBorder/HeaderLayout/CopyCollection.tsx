import { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import API from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { BlockOutlined } from '@ant-design/icons';
import { diagramContentDivId } from '@/pages/DescriptData/DescriptDesign/conf';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import { useFgChange } from '../../../hooks';

const CopyCollection: FC = () => {
  const fgChange = useFgChange();
  const [copyModalVisible, setCopyModalVisible] = useState<boolean>(false);
  const ec = useSelector(selectEntityCollection);

  useEffect(() => {}, []);

  /**弹出复制确认框 */
  const handleToCopyCloseModal = () => {
    setCopyModalVisible(true);
  };

  /**复制确认 */
  const handleCopyCloseModal = () => {
    setCopyModalVisible(false);
  };

  /**复制 */
  const handleCopy = async () => {
    await API.copyEntityCollection({ id: ec.idEntityCollection });
    setCopyModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'整体复制'}>
        <Button
          onClick={handleToCopyCloseModal}
          disabled={fgChange}
          size={'small'}
          icon={<BlockOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title="复制实体空间确认"
        open={copyModalVisible}
        onCancel={handleCopyCloseModal}
        onOk={handleCopy}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <p>
          是否将实体空间{' '}
          <b style={{ color: 'blue', fontSize: 16 }}>{ec.displayName}</b> 复制?
        </p>
      </Modal>
    </>
  );
};

export default CopyCollection;
