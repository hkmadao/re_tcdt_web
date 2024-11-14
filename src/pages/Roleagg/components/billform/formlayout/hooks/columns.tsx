import { EPartName } from '@/models';
import { ProColumns } from '@ant-design/pro-table';
import { Checkbox } from 'antd';
import moment from 'moment';
import RefPicker from '@/components/Ref';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TUserRole, TRoleMenu } from '../../../../models';

export * from '.';
/**用户 */
export const useUserRolesColumns: () => ProColumns<TUserRole>[] = () => {
  return [
    {
      title: '用户角色关系主属性',
      dataIndex: 'idSysUserRole',
      key: 'idSysUserRole',
      render: (text, record, _, action) => {
        return <>{record.idSysUserRole ? record.idSysUserRole : '--'}</>;
      },
    },
    {
      title: '系统用户',
      dataIndex: 'user',
      key: 'user',
      renderFormItem: (_schema, config, form) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'userRoles',
          'idUser',
          billformConf,
        );
        if (refConf) {
          return <RefPicker {...refConf!} />;
        }
      },
      render: (_dom, record) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'userRoles',
          'idUser',
          billformConf,
        );
        if (refConf) {
          const refData = (record as any).user;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
/**菜单 */
export const useRoleMenusColumns: () => ProColumns<TRoleMenu>[] = () => {
  return [
    {
      title: '角色与菜单id',
      dataIndex: 'idRoleMenu',
      key: 'idRoleMenu',
      render: (text, record, _, action) => {
        return <>{record.idRoleMenu ? record.idRoleMenu : '--'}</>;
      },
    },
    {
      title: '系统菜单',
      dataIndex: 'menu',
      key: 'menu',
      renderFormItem: (_schema, config, form) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'roleMenus',
          'idMenu',
          billformConf,
        );
        if (refConf) {
          return <RefPicker {...refConf!} />;
        }
      },
      render: (_dom, record) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'roleMenus',
          'idMenu',
          billformConf,
        );
        if (refConf) {
          const refData = (record as any).menu;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
