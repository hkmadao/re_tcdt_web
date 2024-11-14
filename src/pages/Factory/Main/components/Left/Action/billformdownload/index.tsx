import React, { FC, useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { CloudDownloadOutlined } from '@ant-design/icons';
import Env from '@/conf/env';
import { selectModuleData } from '@/pages/Factory/Main/store';
import BaseAPI from '@/api';

const BillFormDownLoad: FC = () => {
  const moduleData = useSelector(selectModuleData);

  const handleGenerate = () => {
    if (!moduleData.displayName) {
      message.error('请填写显示名称！');
      return;
    }
    if (window.tcdtAPI) {
      window.tcdtAPI.generateBillForm(
        Env.serverURL + `/factory/generate?id=${moduleData.idFactory}`,
      );
      return;
    }
    BaseAPI.GET_DOWNLOAD(
      `/factory/generate?id=${moduleData.idFactory}`,
      moduleData.displayName + '.zip',
    );
  };

  return (
    <>
      <Tooltip overlay={'代码生成'}>
        <Button
          type={'text'}
          onClick={handleGenerate}
          disabled={!moduleData.idFactory}
          size={'middle'}
          icon={<CloudDownloadOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default BillFormDownLoad;
