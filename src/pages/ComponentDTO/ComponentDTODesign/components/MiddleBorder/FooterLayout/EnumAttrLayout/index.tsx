import { FC } from 'react';
import { Tabs, Table } from 'antd';
import EnumAttributeLayout from './EnumAttributeLayout';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'1'} style={{ margin: '0px' }}>
        <TabPane tab={'属性'} key="1" style={{ margin: '0px' }}>
          <EnumAttributeLayout />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EntityAttrLayout;
