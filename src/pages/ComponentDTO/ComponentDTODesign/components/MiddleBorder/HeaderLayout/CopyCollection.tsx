import { FC, useEffect, useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import API from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { diagramContentDivId } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  selectEntityCollection,
  selectFgChange,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import { BlockOutlined } from '@ant-design/icons';

const CopyCollection: FC = () => {
  const fgChange = useSelector(selectFgChange);
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
    await API.copyDtoEntityCollection({ id: ec.idDtoEntityCollection });
    setCopyModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'整体复制'}>
        <Button
          size={'small'}
          onClick={handleToCopyCloseModal}
          disabled={fgChange}
          icon={<BlockOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title="复制DTO实体集确认"
        open={copyModalVisible}
        onCancel={handleCopyCloseModal}
        onOk={handleCopy}
        getContainer={document.getElementById(diagramContentDivId)!}
      >
        <p>
          是否将DTO实体集
          <b style={{ color: 'blue', fontSize: 16 }}>
            {' ' + ec.displayName + ' '}
          </b>
          复制?
        </p>
      </Modal>
    </>
  );
};

export default CopyCollection;
