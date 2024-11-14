import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Modal, Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectEntityComponent } from '../../../store';
import Env from '@/conf/env';
import { CodeOutlined } from '@ant-design/icons';
import BaseAPI from '@/api';
import { EnumComponentType } from '../../../conf';

const GenerateCode: FC = () => {
  const [buttonDisabeld, setButtonDisabeld] = useState<boolean>(true);
  const component = useSelector(selectEntityComponent);

  useEffect(() => {
    if (component?.idComponent) {
      if (
        component.componentEntities &&
        component.componentEnums &&
        component.componentEntities.length + component.componentEnums.length > 0
      ) {
        setButtonDisabeld(false);
        return;
      }
    }
    setButtonDisabeld(true);
  }, [component]);

  const handleGenerate = () => {
    if (!component.componentModule?.path) {
      message.error('请先维护模块包名！');
      return;
    }
    if (!component.displayName) {
      message.error('请填写显示名称！');
      return;
    }
    if (!component.packageName) {
      message.error('请填写包名！');
      return;
    }
    console.log(
      Env.serverURL + `/component/generateSingle?id=${component?.idComponent}`,
    );
    if (window.tcdtAPI) {
      console.log(
        Env.serverURL +
          `/component/generateSingle?id=${component?.idComponent}`,
      );
      if (component.componentType === EnumComponentType.Single) {
        window.tcdtAPI.generateComponentSingle(
          Env.serverURL +
            `/component/generateSingle?id=${component?.idComponent}`,
        );
      } else if (component.componentType === EnumComponentType.Enum) {
        window.tcdtAPI.generateComponentEnumPart(
          Env.serverURL +
            `/component/generateEnumPart?id=${component?.idComponent}`,
        );
      } else {
        window.tcdtAPI.generateComponentCombination(
          Env.serverURL +
            `/component/generateCombination?id=${component?.idComponent}`,
        );
      }

      return;
    }
    if (component.componentType === EnumComponentType.Single) {
      BaseAPI.GET_DOWNLOAD(
        `/component/generateSingle?id=${component.idComponent}`,
      );
    } else if (component.componentType === EnumComponentType.Enum) {
      BaseAPI.GET_DOWNLOAD(
        `/component/generateEnumPart?id=${component.idComponent}`,
      );
    } else {
      BaseAPI.GET_DOWNLOAD(
        `/component/generateCombination?id=${component.idComponent}`,
      );
    }
  };

  return (
    <>
      <Tooltip overlay={'代码生成'}>
        <Button
          size={'small'}
          onClick={handleGenerate}
          disabled={buttonDisabeld}
          icon={<CodeOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default GenerateCode;
