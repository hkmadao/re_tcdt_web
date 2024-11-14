import { FC } from 'react';
import { Tabs, Table } from 'antd';
import AttrLayout from './Attribute';
import FKColumnAttribute from './FKColumnAttribute';
import DownAttribute from './DownAttribute';
import ComputationAttribute from './ComputationAttribute';
import EnumAssociate from './EnumAssociate';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'attrLayout'} style={{ margin: '0px' }}>
        <TabPane tab={'属性'} key="attrLayout" style={{ margin: '0px' }}>
          <AttrLayout />
        </TabPane>
        <TabPane tab={'计算属性'} key="computationAttribute">
          <ComputationAttribute />
        </TabPane>
        <TabPane tab={'引用属性'} key="fKColumnAttribute">
          <FKColumnAttribute />
        </TabPane>
        <TabPane tab={'下级属性'} key="downAttribute">
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
