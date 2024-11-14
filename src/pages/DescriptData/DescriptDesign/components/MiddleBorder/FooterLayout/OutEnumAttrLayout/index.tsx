import { FC } from 'react';
import { Tabs } from 'antd';
import EnumAttributeLayout from './EnumAttributeLayout';

const OutEnumAttrLayout: FC = () => {
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

export default OutEnumAttrLayout;
