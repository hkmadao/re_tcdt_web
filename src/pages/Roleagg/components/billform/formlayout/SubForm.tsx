import { DOStatus } from '@/models';
import { ActionType, EditableProTable } from '@ant-design/pro-table';
import { nanoid } from '@reduxjs/toolkit';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Space, Button } from 'antd';
import { FC, useRef, useState, useEffect } from 'react';
import styles from './styles.less';
import { actions } from './store';
import { TUserRole, TRoleMenu } from '../../../models';
import {
  useFgDisabled,
  useFormData,
  useEditStatusInfo,
  useUserRolesColumns,
  useUserRolesData,
  useRoleMenusColumns,
  useRoleMenusData,
} from './hooks';
/*==========UserRoles=============*/
export const UserRoles: FC = () => {
  const fgDisabled = useFgDisabled();
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm<TUserRole>();
  const dispatch = useDispatch();
  const tableData = useUserRolesData();
  const moduleData = useFormData();
  const [userRoles, setUserRoles] = useState<TUserRole[]>([]);
  const editStatus = useEditStatusInfo();

  useEffect(() => {
    if (editStatus) {
      setUserRoles(tableData);
    }
  }, [editStatus, tableData.length]);

  const userRolesColumns = useUserRolesColumns();

  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TUserRole,
    dataSource: TUserRole[],
  ) => void = (record, dataSource) => {
    const newRecord = { ...record };
    newRecord.idUser = undefined;
    if (newRecord.user) {
      newRecord.idUser = newRecord.user.idUser;
    }
    dispatch(actions.updateFormDataUserRole(newRecord));
  };

  /**行操作 */
  const handleRow = (record: TUserRole) => {
    return {
      onClick: async (_event: any) => {
        if (fgDisabled) {
          return;
        }
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idSysUserRole!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAddRow = () => {
    const userRoleNew: TUserRole = {
      idRole: moduleData.idRole,
      idSysUserRole: nanoid(),
      action: DOStatus.NEW,
    };
    dispatch(actions.addFormDataUserRole(userRoleNew));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(userRoleNew.idSysUserRole as React.Key);
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const userRole = userRoles?.find(
        (t) =>
          t.action !== DOStatus.DELETED && editableKeys[0] === t.idSysUserRole,
      );
      if (userRole) {
        dispatch(actions.deleteFormDataUserRole(userRole));
      }
    }
  };

  return (
    <>
      <Space size={2}>
        <Button
          size={'small'}
          onClick={handleAddRow}
          icon={<PlusOutlined />}
          disabled={fgDisabled}
        >
          添加
        </Button>
        <Button
          size={'small'}
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0 || fgDisabled}
        >
          删除
        </Button>
      </Space>
      <EditableProTable<TUserRole>
        className={styles['my-ant-card-body']}
        style={{ padding: '0px' }}
        actionRef={actionRef}
        rowKey={'idSysUserRole'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        maxLength={5}
        recordCreatorProps={false}
        value={userRoles}
        columns={userRolesColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys: editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        onRow={handleRow}
      />
    </>
  );
};
/*==========UserRoles=============*/
/*==========RoleMenus=============*/
export const RoleMenus: FC = () => {
  const fgDisabled = useFgDisabled();
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm<TRoleMenu>();
  const dispatch = useDispatch();
  const tableData = useRoleMenusData();
  const moduleData = useFormData();
  const [roleMenus, setRoleMenus] = useState<TRoleMenu[]>([]);
  const editStatus = useEditStatusInfo();

  useEffect(() => {
    if (editStatus) {
      setRoleMenus(tableData);
    }
  }, [editStatus, tableData.length]);

  const roleMenusColumns = useRoleMenusColumns();

  /**编辑行内容改变处理 */
  const handleFormChange: (
    record: TRoleMenu,
    dataSource: TRoleMenu[],
  ) => void = (record, dataSource) => {
    const newRecord = { ...record };
    newRecord.idMenu = undefined;
    if (newRecord.menu) {
      newRecord.idMenu = newRecord.menu.idMenu;
    }
    dispatch(actions.updateFormDataRoleMenu(newRecord));
  };

  /**行操作 */
  const handleRow = (record: TRoleMenu) => {
    return {
      onClick: async (_event: any) => {
        if (fgDisabled) {
          return;
        }
        editableKeys.forEach((editableKey) =>
          actionRef.current?.cancelEditable(editableKey),
        );
        actionRef.current?.startEditable(record.idRoleMenu!);
      }, // 点击行
      onDoubleClick: (_event: any) => {},
      onContextMenu: (_event: any) => {},
      onMouseEnter: (_event: any) => {}, // 鼠标移入行
      onMouseLeave: (_event: any) => {},
    };
  };

  /**添加行 */
  const handleAddRow = () => {
    const roleMenuNew: TRoleMenu = {
      idRole: moduleData.idRole,
      idRoleMenu: nanoid(),
      action: DOStatus.NEW,
    };
    dispatch(actions.addFormDataRoleMenu(roleMenuNew));
    editableKeys.forEach((editableKey) =>
      actionRef.current?.cancelEditable(editableKey),
    );
    actionRef.current?.startEditable(roleMenuNew.idRoleMenu as React.Key);
  };
  /**删除行 */
  const handleDelete = () => {
    if (editableKeys && editableKeys.length === 1) {
      const roleMenu = roleMenus?.find(
        (t) =>
          t.action !== DOStatus.DELETED && editableKeys[0] === t.idRoleMenu,
      );
      if (roleMenu) {
        dispatch(actions.deleteFormDataRoleMenu(roleMenu));
      }
    }
  };

  return (
    <>
      <Space size={2}>
        <Button
          size={'small'}
          onClick={handleAddRow}
          icon={<PlusOutlined />}
          disabled={fgDisabled}
        >
          添加
        </Button>
        <Button
          size={'small'}
          onClick={handleDelete}
          disabled={!editableKeys || editableKeys.length == 0 || fgDisabled}
        >
          删除
        </Button>
      </Space>
      <EditableProTable<TRoleMenu>
        className={styles['my-ant-card-body']}
        style={{ padding: '0px' }}
        actionRef={actionRef}
        rowKey={'idRoleMenu'}
        headerTitle={false}
        bordered={true}
        size={'small'}
        maxLength={5}
        recordCreatorProps={false}
        value={roleMenus}
        columns={roleMenusColumns}
        editable={{
          type: 'multiple',
          form,
          editableKeys: editableKeys,
          onChange: setEditableRowKeys,
          onValuesChange: handleFormChange,
        }}
        onRow={handleRow}
      />
    </>
  );
};
/*==========RoleMenus=============*/
