import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectActiveKey, selectTwoLevelStatus } from '../../../store';
import NodeAttr from './NodeAttr';
import { EActiveKey } from '../../../model';
import { useFgLoadData } from '../../../hooks';

const Edit = () => {
  const dispatch = useDispatch();
  const twoLevelStatus = useSelector(selectTwoLevelStatus);
  const activeKey = useSelector(selectActiveKey);
  const fgLoadData = useFgLoadData();

  const handleChange = (activeKey: string) => {
    const param = activeKey as EActiveKey;
    dispatch(actions.setActiveKey(param));
  };

  const tabsContent = twoLevelStatus ? (
    <Tabs
      defaultActiveKey={EActiveKey.firstTreeRef}
      activeKey={activeKey}
      onChange={handleChange}
    >
      <Tabs.TabPane tab="节点1" key={EActiveKey.firstTreeRef}>
        <NodeAttr />
      </Tabs.TabPane>
      <Tabs.TabPane tab="节点2" key={EActiveKey.thirdTreeRef}>
        <NodeAttr />
      </Tabs.TabPane>
    </Tabs>
  ) : (
    <Tabs
      defaultActiveKey={EActiveKey.firstTreeRef}
      activeKey={activeKey}
      onChange={handleChange}
    >
      <Tabs.TabPane tab="节点" key={EActiveKey.firstTreeRef}>
        <NodeAttr />
      </Tabs.TabPane>
    </Tabs>
  );

  return (
    <div
      style={{
        width: '30%',
        margin: '5px',
        backgroundColor: 'white',
        paddingLeft: '5px',
      }}
    >
      <div
        style={{
          display: fgLoadData ? undefined : 'none',
          flex: '0 1 auto',
          overflow: 'auto',
        }}
      >
        {tabsContent}
      </div>
    </div>
  );
};

export default Edit;
