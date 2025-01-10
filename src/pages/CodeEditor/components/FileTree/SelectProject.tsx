import { FC, useState } from 'react';
import { Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useFgEdit } from '../../hooks';
import { TBillRef } from '@/models';
import RefPicker from '@/components/Ref';
import { TProject } from '../../models';
import { actions, fetchTreeByProject } from '../../store';

const SelectProject: FC = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<TProject>();

  const fgEdit = useFgEdit();

  const handleChange = (value?: TProject) => {
    if (!value) {
      return;
    }
    dispatch(fetchTreeByProject(value));
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>选择项目：</div>
        <div>
          <RefPicker
            size={'small'}
            disabled={fgEdit}
            {...refConfig}
            value={value}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default SelectProject;

const refConfig: TBillRef = {
  refStyle: 'table',
  title: '项目',
  displayProp: 'displayName',
  backWriteProp: 'idProject',
  tableRef: {
    dataUri: '/project/aqPage',
    tableMainProp: 'idProject',
    idComponentEntity: '0000-c42a3d77-90bd-4e33-8618-dc6b746109f7',
    ceDisplayName: '项目',
    refColumns: [
      {
        idBillRefColumn: '4NCYIJKn9cTZhxWvqMFEN',
        name: 'code',
        displayName: '项目编号',
      },
      {
        idBillRefColumn: 'SFb6YBzXE5klsMkHKQRDz',
        name: 'displayName',
        displayName: '显示名称',
      },
      {
        idBillRefColumn: 'SFb6YBzXE6klsMkHKQRDz',
        name: 'templateCode',
        displayName: '项目模板编号',
      },
    ],
    searchRefs: [
      {
        idBillSearchRef: 's0tjXzSyi6RTsHgEpsdJh',
        operatorCode: 'like',
        attributeName: 'code',
        label: '项目编号',
        searchAttributes: ['code'],
        htmlInputType: 'Input',
        showOrder: 0,
      },
      {
        idBillSearchRef: 'yBrXjJhsTJ3rygnfPM9VZ',
        operatorCode: 'like',
        attributeName: 'displayName',
        label: '显示名称',
        searchAttributes: ['displayName'],
        htmlInputType: 'Input',
        showOrder: 0,
      },
    ],
  },
};
