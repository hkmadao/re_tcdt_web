import { FC } from 'react';
import { Tabs } from 'antd';
import EnumAssociate from './EnumAssociate';
import EnityAssociate from './EnityAssociate';
import DdEnum from './DdEnum';
import OutEnum from './OutEnum';
import OutEntity from './OutEntity';
import EntitiesEditTable from './EntitiesEditTable';

const PanelLayout: FC = () => {
  const { TabPane } = Tabs;

  return (
    <>
      <Tabs defaultActiveKey={'1'} style={{ margin: '0px' }}>
        <TabPane tab={'实体'} key="1" style={{ margin: '0px' }}>
          <EntitiesEditTable />
        </TabPane>
        <TabPane tab={'外部实体'} key="2" style={{ margin: '0px' }}>
          <OutEntity />
        </TabPane>
        <TabPane tab={'枚举'} key="3" style={{ margin: '0px' }}>
          <DdEnum />
        </TabPane>
        <TabPane tab={'外部枚举'} key="4" style={{ margin: '0px' }}>
          <OutEnum />
        </TabPane>
        <TabPane tab={'实体连线'} key="8" style={{ margin: '0px' }}>
          <EnityAssociate />
        </TabPane>
        <TabPane tab={'枚举连线'} key="9" style={{ margin: '0px' }}>
          <EnumAssociate />
        </TabPane>
      </Tabs>
    </>
  );
};

export default PanelLayout;
