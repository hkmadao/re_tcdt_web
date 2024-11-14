import { FC, Key, memo, useEffect, useState } from 'react';
import { Table, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './styles.less';
import { useSelectRow } from './hooks';
import { TRoleMenu } from '../../../models';

const SubTableLayout: FC = () => {
  const selectRow = useSelectRow();

  const { TabPane } = Tabs;
  return (
    <>
      <Tabs defaultActiveKey={''}></Tabs>
    </>
  );
};

export default SubTableLayout;
