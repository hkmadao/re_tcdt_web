import React from 'react';
import { EPartName } from '@/pages/Factory/Units/Form/model';
import PanelTabs from '../PanelTabs';
import styles from '@/pages/Factory/Units/Form/less/styles.less';

function Header() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 0 auto',
          backgroundColor: '#6fb8fb',
          justifyContent: 'center',
        }}
      >
        主表单
      </div>
      <div
        className={styles['my-panel']}
        style={{
          display: 'flex',
          flex: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <PanelTabs name={EPartName.Header} />
      </div>
    </>
  );
}

export default Header;
