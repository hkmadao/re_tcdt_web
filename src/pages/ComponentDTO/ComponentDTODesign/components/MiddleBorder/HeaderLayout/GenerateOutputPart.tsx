import React, { FC, useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectEntityCollection } from '@/pages/ComponentDTO/ComponentDTODesign/store';
import Env from '@/conf/env';
import { CodeOutlined } from '@ant-design/icons';
import BaseAPI from '@/api';

const GenerateOutputPart: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);

  const handleGenerate = () => {
    if (!entityCollection.dtoModule?.path) {
      message.error('请先维护模块包名！');
      return;
    }
    if (!entityCollection.displayName) {
      message.error('请填写显示名称！');
      return;
    }
    if (!entityCollection.packageName) {
      message.error('请填写包名！');
      return;
    }

    if (window.tcdtAPI) {
      window.tcdtAPI.generateOutputPart(
        Env.directServerUrl +
          `/dtoEntityCollection/generateOutputPart?id=${entityCollection.idDtoEntityCollection}`,
      );
      return;
    }
    BaseAPI.GET_DOWNLOAD(
      `/dtoEntityCollection/generateOutputPart?id=${entityCollection.idDtoEntityCollection}`,
      entityCollection.displayName + '.zip',
    );
  };

  return (
    <>
      <Tooltip overlay={'出参分散生成'}>
        <Button
          size={'small'}
          onClick={handleGenerate}
          disabled={!entityCollection.idDtoEntityCollection}
          icon={<CodeOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default GenerateOutputPart;
