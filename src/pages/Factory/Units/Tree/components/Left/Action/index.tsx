import { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { message } from 'antd';
import { SaveOutlined, ExportOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../../api';
import { selectModuleData } from '../../../store';
import SelectComponent from './selectcomponent';
import BillFormBase from './base';
import { TTreeConf, TTreeContent } from '../../../model';

const Action: React.FC = () => {
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
    const contentData: TTreeContent = JSON.parse(JSON.stringify(moduleData));
    const billForm: TTreeConf = {
      ...{
        ...contentData,
        metaData: undefined,
        twoLevelStatus: undefined,
        searchAttrs: undefined,
        firstTreeRef: undefined,
        thirdTreeRef: undefined,
      },
      content: JSON.stringify(moduleData),
    };
    if (moduleData.metaData) {
      billForm.metaData = JSON.stringify(moduleData.metaData);
    }
    const result: TTreeConf = await API.update(billForm);
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
              disabled={!moduleData.idTree}
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
              disabled={!moduleData.idTree}
              size={'middle'}
              icon={<ExportOutlined />}
            ></Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={'基本信息'}>
            <BillFormBase />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Action;
