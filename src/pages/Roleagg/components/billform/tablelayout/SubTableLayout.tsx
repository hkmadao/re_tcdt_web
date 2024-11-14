import { FC, Key, memo, useEffect, useState } from 'react';
import { Table, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './styles.less';
import {
  useSelectRow,
  useUserRolesColumns,
  useRoleMenusColumns,
} from './hooks';
import { TRoleMenu, TUserRole } from '../../../models';

const SubTableLayout: FC = () => {
  const selectRow = useSelectRow();
  const userRolesColumns = useUserRolesColumns();
  const roleMenusColumns = useRoleMenusColumns();

  const { TabPane } = Tabs;
  return (
    <>
      <Tabs defaultActiveKey={'userRoles'}>
        <TabPane key={'userRoles'} tabKey={'userRoles'} tab={'用户'}>
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
        <TabPane key={'roleMenus'} tabKey={'roleMenus'} tab={'菜单'}>
          <Table
            className={styles['my-ant-card-body']}
            rowKey={'idRoleMenu'}
            columns={roleMenusColumns}
            dataSource={
              selectRow && selectRow.roleMenus ? selectRow.roleMenus : []
            }
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default SubTableLayout;
