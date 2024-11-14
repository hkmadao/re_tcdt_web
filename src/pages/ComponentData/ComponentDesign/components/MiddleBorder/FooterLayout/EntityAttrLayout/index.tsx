import { FC } from 'react';
import { Tabs } from 'antd';
import ComputationAttributeLayout from './ComputationAttribute';
import ExtAttributeLayout from './ExtAttributeLayout';
import FKColumnAttribute from './FKColumnAttribute';
import DownAttribute from './DownAttribute';
import EnumAssociate from './EnumAssociate';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'ExtAttributeLayout'} style={{ margin: '0px' }}>
        <TabPane
          tab={'属性'}
          key="ExtAttributeLayout"
          style={{ margin: '0px' }}
        >
          <ExtAttributeLayout />
        </TabPane>
        <TabPane
          tab={'计算属性'}
          key="ComputationAttributeLayout"
          style={{ margin: '0px' }}
        >
          <ComputationAttributeLayout />
        </TabPane>
        <TabPane tab={'外键引用属性'} key="FKColumnAttribute">
          <FKColumnAttribute />
        </TabPane>
        <TabPane tab={'下级属性'} key="DownAttribute">
          <DownAttribute />
        </TabPane>
        <TabPane tab={'枚举属性'} key="enumAttribute">
          <EnumAssociate />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EntityAttrLayout;
