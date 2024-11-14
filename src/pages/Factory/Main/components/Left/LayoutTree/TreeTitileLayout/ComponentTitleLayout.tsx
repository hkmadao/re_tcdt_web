import { FC, useEffect, useState } from 'react';
import { Dropdown, Menu, Space, Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { FormOutlined } from '@ant-design/icons';
import { TLayout } from '../../../../model';
import { actions } from '../../../../store';

const ComponentTitleLayout: FC<TLayout> = ({ ...layout }) => {
  const [hiddenContent, setHiddenContent] = useState(true);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleShowContent = () => {
    setHiddenContent(false);
  };

  const handleHiddenContent = () => {
    setHiddenContent(true);
  };

  const handleClick = () => {
    dispatch(actions.setCurrentLayoutId(layout.id));
  };

  /**弹出删除确认框 */
  const handleToRemoveCloseModal = () => {
    setRemoveModalVisible(true);
  };

  /**删除确认 */
  const handleRemoveCloseModal = () => {
    setRemoveModalVisible(false);
  };

  /**删除 */
  const handleRemove = async () => {
    if (layout.idParent) {
      dispatch(
        actions.removeLayout({ idParent: layout.idParent, id: layout.id }),
      );
    }
    setRemoveModalVisible(false);
  };

  return (
    <>
      <span
        onMouseEnter={handleShowContent}
        onMouseLeave={handleHiddenContent}
        onClick={handleClick}
        style={{
          color: 'red',
        }}
      >
        <Space size={30}>
          <span>{layout.title}</span>
          <span hidden={hiddenContent}>
            <Dropdown
              overlay={
                <Menu
                  items={[
                    {
                      key: '1',
                      label: '删除',
                      onClick: handleToRemoveCloseModal,
                    },
                  ]}
                />
              }
            >
              <FormOutlined />
            </Dropdown>
          </span>
        </Space>
      </span>
      <Modal
        title="删除组件确认"
        open={removeModalVisible}
        onCancel={handleRemoveCloseModal}
        onOk={handleRemove}
      >
        <p>
          是否将组件 <b style={{ color: 'blue', fontSize: 16 }}>{layout.id}</b>{' '}
          删除?
        </p>
      </Modal>
    </>
  );
};

export default ComponentTitleLayout;
