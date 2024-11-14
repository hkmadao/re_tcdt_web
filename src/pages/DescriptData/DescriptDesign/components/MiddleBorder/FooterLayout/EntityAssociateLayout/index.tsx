import { FC } from 'react';
import { Tabs, Table } from 'antd';
import EntityAssociate from './EntityAssociate';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'1'} style={{ margin: '0px' }}>
        <TabPane tab={'字段映射'} key="1" style={{ margin: '0px' }}>
          <EntityAssociate />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EntityAttrLayout;
