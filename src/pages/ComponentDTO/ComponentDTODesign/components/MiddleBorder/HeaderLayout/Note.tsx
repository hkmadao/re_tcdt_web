import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Table, TableColumnsType } from 'antd';
import { diagramContentDivId } from '@/pages/ComponentDTO/ComponentDTODesign/conf';

const intiTableDatas = [
  {
    actionName: '保存',
    note: '保存当前实体集',
  },
  {
    actionName: '添加实体',
    note: '在当前实体新增一个实体',
  },
  {
    actionName: '移入实体',
    note: '从其他实体集选择实体移动到当前实体集',
  },
  {
    actionName: '导入实体',
    note: '从其他实体集拷贝实体到当前实体集，导入的实体作为新增实体',
  },
  {
    actionName: '导入外部实体',
    note: '从其他实体集导入实体到当前实体集，导入的实体只可做关联关系，不可编辑',
  },
  {
    actionName: '显示/隐藏外部实体',
    note: '切换是否显示外部实体',
  },
  {
    actionName: '删除所选元素',
    note: '删除选中的实体、外部实体、连线等',
  },
  {
    actionName: '其他',
    note: [
      '1.在画布区域按delete键可以删除当前选中元素;',
      '2.按下alt键拖动实体右下角图标可以进行实体大小缩放;',
    ],
  },
];

const Note: FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableDatas, setTableDatas] = useState(intiTableDatas);

  useEffect(() => {}, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const columns: TableColumnsType<any> = [
    {
      key: 'actionName',
      width: '100px',
      title: '操作名称',
      dataIndex: 'actionName',
    },
    {
      key: 'note',
      title: '说明',
      dataIndex: 'note',
      render: (value: any, record: any, index: number) => {
        if (record.actionName === '其他') {
          const notes: ReactNode[] = [];
          value.forEach((element: any) => {
            notes.push(<p>{element}</p>);
          });
          return notes;
        }
        return value;
      },
    },
  ];

  return (
    <>
      <Button size={'small'} onClick={handleOpenModal}>
        菜单说明
      </Button>
      <Modal
        width={'700px'}
        title={'菜单说明'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={24}>
            <Table
              rowKey={'actionName'}
              size={'small'}
              bordered
              columns={columns}
              dataSource={tableDatas}
              pagination={false}
              scroll={{ y: '500px' }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Note;
