import { FC } from 'react';
import { Tabs } from 'antd';
import AttrLayout from './AttrLayout';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'1'} style={{ margin: '0px' }}>
        <TabPane tab={'属性'} key="1" style={{ margin: '0px' }}>
          <AttrLayout />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EntityAttrLayout;
