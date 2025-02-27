import { EPartName } from '@/models';
import { ProColumns } from '@ant-design/pro-table';
import { Checkbox, Popover } from 'antd';
import moment from 'moment';
import RefPicker from '@/components/Ref';
import CustomDateText from '@/components/CustomDateText';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import { getRefByAttr } from '@/util';
import { billformConf } from '../../../../conf';
import { TUserRole } from '../../../../models';

export * from '.';
/**系统用户 */
export const useUserRolesColumns: () => ProColumns<TUserRole>[] = () => {
  return [
    {
      width: 150,
      title: '用户角色关系主属性',
      dataIndex: 'idSysUserRole',
      key: 'idSysUserRole',
      render: (text, record, _, action) => {
        const content = record.idSysUserRole ? record.idSysUserRole : '--';
        return (
          <div
            style={{
              overflow: 'hidden',
              width: '140px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Popover content={content} trigger="hover">
              {content}
            </Popover>
          </div>
        );
      },
    },
    {
      width: 150,
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      renderFormItem: (_schema, config, form) => {
        const refConf = getRefByAttr(
          EPartName.Body,
          'userRoles',
          'idRole',
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
          'idRole',
          billformConf,
        );
        if (refConf) {
          const refData = (record as any).role;
          if (refData) {
            return refData[refConf.displayProp!];
          }
        }
      },
    },
  ];
};
