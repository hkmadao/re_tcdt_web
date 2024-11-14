import { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin, Tooltip } from 'antd';
import { message } from 'antd';
import { SaveOutlined, ExportOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { TQuery, TQueryContent } from '@/pages/Factory/Units/Query/model';
import API from '@/pages/Factory/Units/Query/api';
import {
  actions,
  selectModuleData,
  selectStatus,
} from '@/pages/Factory/Units/Query/store';
import SelectComponent from './selectcomponent';
import BillFormBase from './base';

const Action: React.FC = () => {
  const loadStatus = useSelector(selectStatus);
  const moduleData = useSelector(selectModuleData);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const jsonExport = () => {
    const bj = new Blob([JSON.stringify(moduleData, undefined, 4)]);
    const reader = new FileReader();
    reader.readAsDataURL(bj);
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const a = document.createElement('a');
      a.download = moduleData.name + '.json';
      a.href = reader.result?.toString() || '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  const save = async () => {
    const contentData: TQueryContent = JSON.parse(JSON.stringify(moduleData));
    contentData.metaData = undefined;
    const billForm: TQuery = {
      ...{
        ...moduleData,
        metaData: undefined,
        searchRefs: undefined,
      },
      metaData: JSON.stringify(moduleData.metaData),
      content: JSON.stringify({ ...contentData, metaData: undefined }),
    };
    const result: TQuery = await API.updateBillForm(billForm);
    message.info('保存成功！');
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          fontSize: 18,
          justifyContent: 'space-around',
          maxHeight: 30,
        }}
      >
        <div>
          <SelectComponent />
        </div>
        <div>
          <Tooltip title={'保存'}>
            <Button
              type={'text'}
              onClick={save}
              disabled={!moduleData.idQuery}
              size={'middle'}
              icon={<SaveOutlined />}
            ></Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={'导出'}>
            <Button
              type={'text'}
              onClick={jsonExport}
              disabled={!moduleData.idQuery}
              size={'middle'}
              icon={<ExportOutlined />}
            ></Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={'查询模板基本信息'}>
            <BillFormBase />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Action;
