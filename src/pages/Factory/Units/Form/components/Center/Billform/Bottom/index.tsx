import React, { FC, useState } from 'react';
import { EPartName } from '@/pages/Factory/Units/Form/model';
import PanelTabs from '../PanelTabs';
import styles from '@/pages/Factory/Units/Form/less/styles.less';
import { DoubleRightOutlined } from '@ant-design/icons';

const Bottom: FC<{ setExpand: (expandStatus: boolean) => void }> = (props) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleExpand = () => {
    props.setExpand(!expanded);
    setExpanded(!expanded);
  };
  return (
    <>
      <div
        style={{
          flex: '0 1 auto',
          backgroundColor: '#6fb8fb',
          textAlign: 'center',
        }}
      >
        <span>尾表单</span>
        <DoubleRightOutlined
          onClick={toggleExpand}
          style={{
            marginLeft: '10px',
            transform: expanded ? 'rotate(90deg)' : 'rotate(-90deg)',
          }}
        />
      </div>
      <div
        className={styles['my-panel']}
        style={{
          display: expanded ? 'flex' : 'none',
          flex: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <PanelTabs name={EPartName.Tail} />
      </div>
      <div
        style={{
          display: expanded ? 'none' : undefined,
        }}
      >
        内容已被隐藏...
      </div>
    </>
  );
};

export default Bottom;
