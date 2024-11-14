import { FC, Key, memo, useEffect, useState } from 'react';
import { Table, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './styles.less';
import { useSelectRow, useUserRolesColumns } from './hooks';
import { TUserRole } from '../../../models';

const SubTableLayout: FC = () => {
  const selectRow = useSelectRow();
  const userRolesColumns = useUserRolesColumns();

  const { TabPane } = Tabs;
  return (
    <>
      <Tabs defaultActiveKey={'userRoles'}>
        <TabPane key={'userRoles'} tabKey={'userRoles'} tab={'系统用户'}>
          <Table
            className={styles['my-ant-card-body']}
            rowKey={'idSysUserRole'}
            columns={userRolesColumns}
            dataSource={
              selectRow && selectRow.userRoles ? selectRow.userRoles : []
            }
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default SubTableLayout;
