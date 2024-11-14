import { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin, Tooltip } from 'antd';
import { message } from 'antd';
import { SaveOutlined, ExportOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { TUiFactory, TUiFactoryContent } from '@/pages/Factory/Main/model';
import API from '@/pages/Factory/Main/api';
import { actions, selectModuleData } from '@/pages/Factory/Main/store';
import SelectComponent from './selectcomponent';
import BillFormBase from './base';
import { findLayoutBycompType } from '../../../store/util';
import BillFormDownLoad from './billformdownload';

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
    const contentData: TUiFactoryContent = JSON.parse(
      JSON.stringify(moduleData),
    );
    const bComp = findLayoutBycompType('viewBillform', moduleData.layouts);
    const editBComp = findLayoutBycompType('editBillform', moduleData.layouts);
    const qComp = findLayoutBycompType('search', moduleData.layouts);
    const tComp = findLayoutBycompType('tree', moduleData.layouts);
    const buttonComp = findLayoutBycompType('viewButton', moduleData.layouts);
    const editButtonComp = findLayoutBycompType(
      'editButton',
      moduleData.layouts,
    );
    const refIdJson = {
      idViewBillform: bComp?.component?.idRef,
      idEditBillform: editBComp?.component?.idRef,
      idQuery: qComp?.component?.idRef,
      idTree: tComp?.component?.idRef,
      idViewButtonAction: buttonComp?.component?.idRef,
      idEditButtonAction: editButtonComp?.component?.idRef,
    };
    const billForm: TUiFactory = {
      ...{
        ...contentData,
        pages: undefined,
        layouts: undefined,
        assos: undefined,
      },
      content: JSON.stringify(moduleData),
      refIdContent: JSON.stringify(refIdJson),
    };
    const result: TUiFactory = await API.updateUiFactory(billForm);
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
              disabled={!moduleData.idFactory}
              size={'middle'}
              icon={<SaveOutlined />}
            ></Button>
          </Tooltip>
        </div>
        <div>
          <BillFormDownLoad />
        </div>
        <div>
          <Tooltip title={'导出'}>
            <Button
              type={'text'}
              onClick={jsonExport}
              disabled={!moduleData.idFactory}
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
