import { FC } from 'react';
import { Tabs, Table } from 'antd';
import AttrLayout from './Attribute';
import FKColumnAttribute from './FKColumnAttribute';
import DownAttribute from './DownAttribute';
import styles from './index.less';
import EnumAssociate from './EnumAssociate';

const EntityAttrLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'1'} size={'small'}>
        <TabPane tab={'属性'} key="1">
          <AttrLayout />
        </TabPane>
        <TabPane tab={'外键引用'} key="2">
          <FKColumnAttribute />
        </TabPane>
        <TabPane tab={'下级属性'} key="3">
          <DownAttribute />
        </TabPane>
        <TabPane tab={'枚举属性'} key="4">
          <EnumAssociate />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EntityAttrLayout;
