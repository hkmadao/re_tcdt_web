import { useState, useEffect } from 'react';
import { Button, Popconfirm, Spin, Tooltip } from 'antd';
import { message } from 'antd';
import {
  SaveOutlined,
  ExportOutlined,
  VerticalAlignMiddleOutlined,
  FileSyncOutlined,
  FormOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { TBillForm, TBillFormContent } from '@/pages/Factory/Units/Form/model';
import ModuleAPI from '@/pages/Factory/Units/Form/api';
import {
  actions,
  selectFgFrom,
  selectModuleData,
  selectStatus,
} from '@/pages/Factory/Units/Form/store';
import SelectComponent from './selectcomponent';
import BillFormBase from './base';

const Action: React.FC = () => {
  const loadStatus = useSelector(selectStatus);
  const moduleData = useSelector(selectModuleData);
  const fgForm = useSelector(selectFgFrom);
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
    const contentData: TBillFormContent = JSON.parse(
      JSON.stringify(moduleData),
    );
    const billForm: TBillForm = {
      ...{
        ...moduleData,
        metaData: undefined,
        treeRef: undefined,
        searchRefs: undefined,
        configList: undefined,
        configForm: undefined,
      },
      metaData: JSON.stringify(moduleData.metaData),
      content: JSON.stringify({ ...contentData, metaData: undefined }),
    };
    const result: TBillForm = await ModuleAPI.updateBillForm(billForm);
    message.info('保存成功！');
  };

  const changFgForm = () => {
    dispatch(actions.setFgForm(!fgForm));
  };

  const syncTabData = () => {
    if (fgForm) {
      dispatch(actions.syncFromTable());
    } else {
      dispatch(actions.syncFromForm());
    }
  };
  const createFromMetaData = () => {
    dispatch(actions.createFromMetaData());
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
              disabled={!moduleData.idBillForm}
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
              disabled={!moduleData.idBillForm}
              size={'middle'}
              icon={<ExportOutlined />}
            ></Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title={'表单基本信息'}>
            <BillFormBase />
          </Tooltip>
        </div>
        <div>
          <Popconfirm
            placement="bottom"
            title={'将删除原有配置数据，是否继续？'}
            onConfirm={createFromMetaData}
            okText="确认"
            cancelText="取消"
            disabled={!moduleData.idBillForm}
          >
            <Tooltip title={'从元数据导入默认数据'}>
              <Button
                type={'text'}
                disabled={!moduleData.idBillForm}
                size={'middle'}
                icon={<VerticalAlignMiddleOutlined />}
              ></Button>
            </Tooltip>
          </Popconfirm>
        </div>
        <div>
          {fgForm ? (
            <Tooltip title={'切换到表格'}>
              <Button
                type={'text'}
                onClick={changFgForm}
                disabled={!moduleData.idBillForm}
                size={'middle'}
                icon={<FormOutlined />}
              ></Button>
            </Tooltip>
          ) : (
            <Tooltip title={'切换到表单'}>
              <Button
                type={'text'}
                onClick={changFgForm}
                disabled={!moduleData.idBillForm}
                size={'middle'}
                icon={<TableOutlined />}
              ></Button>
            </Tooltip>
          )}
        </div>
        <div>
          <Popconfirm
            placement="bottom"
            title={fgForm ? '从表格同步数据提示？' : '从表单同步数据提示？'}
            onConfirm={syncTabData}
            okText="确认"
            cancelText="取消"
            disabled={!moduleData.idBillForm}
          >
            <Tooltip title={fgForm ? '从表格同步数据' : '从表单同步数据'}>
              <Button
                type={'text'}
                disabled={!moduleData.idBillForm}
                size={'middle'}
                icon={<FileSyncOutlined />}
              ></Button>
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};

export default Action;
