import { FC, useRef } from 'react';
import { useState } from 'react';
import { Button, Collapse, Input, Modal, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  actions,
  selectEntityCollection,
  selectSysDataTypes,
} from '@/pages/DescriptData/DescriptDesign/store';
import type { TEntity } from '@/pages/DescriptData/DescriptDesign/models';
import { message } from 'antd/es';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import ImportEntityEditTable from './ImportEntityEditTable';

const FromPaste: FC = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextAreaRef>(null);
  const collection = useSelector(selectEntityCollection);
  const [entities, setEntities] = useState<TEntity[]>([]);
  const importEntitiesEditTableRef = useRef<{ getEntities: () => TEntity[] }>(
    null,
  );
  const sysDataTypes = useSelector(selectSysDataTypes);

  const handleOpenModal = () => {
    setEntities([]);
    if (inputRef.current?.resizableTextArea) {
      inputRef.current.resizableTextArea.textArea.value = '';
    }
    setModalVisible(true);
  };

  const handleOk = () => {
    if (importEntitiesEditTableRef?.current) {
      const newEntities = importEntitiesEditTableRef?.current.getEntities();
      // console.log(
      //   'to imports entities: ',
      //   JSON.parse(JSON.stringify(newEntities)),
      // );
      dispatch(actions.patseEntities(newEntities));
      setModalVisible(false);
      return;
    }
  };

  const handleParse = () => {
    console.log('start parse...');
    const inputValue = inputRef.current?.resizableTextArea?.textArea.value;
    if (inputValue) {
      const inputObj = JSON.parse(inputValue);
      if (!Array.isArray(inputObj)) {
        message.error('数据格式不是数组');
        return;
      }
      const arr = inputObj as any[];
      for (let i = 0; i < arr.length; i++) {
        let entity = arr[i];
        if (!entity.hasOwnProperty('idEntity')) {
          message.error('数据格式不正确，不存在"idEntity"属性');
          return;
        }
      }
      const entities = arr as TEntity[];
      entities.forEach((entity) => {
        entity.attributes?.forEach((attr) => {
          const findDataType = sysDataTypes.find(
            (dataType) => dataType.idDataType === attr.idAttributeType,
          );
          if (!findDataType) {
            attr.idAttributeType = undefined;
            attr.attributeType = undefined;
          }
        });
      });
      setEntities(entities);
      message.success('解析成功');
      return;
    }
    message.error('请输入数据');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tooltip overlay={'从剪贴板导入实体'}>
        <Button
          icon={<BlockOutlined />}
          onClick={handleOpenModal}
          disabled={!collection?.idEntityCollection}
          size={'small'}
        />
      </Tooltip>
      <Modal
        width={'1200px'}
        title={'从剪贴板导入实体'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Collapse defaultActiveKey={['sqlParse']}>
            <Panel header="解析" key="sqlParse">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div>
                  <Button size={'small'} type={'primary'} onClick={handleParse}>
                    解析
                  </Button>
                </div>
                <Input.TextArea ref={inputRef} rows={10}></Input.TextArea>
              </div>
            </Panel>
          </Collapse>
          <div>
            <ImportEntityEditTable
              ref={importEntitiesEditTableRef}
              entitiesProps={entities}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FromPaste;
