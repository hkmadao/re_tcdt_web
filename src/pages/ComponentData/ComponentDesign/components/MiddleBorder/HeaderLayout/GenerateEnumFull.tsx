import React, { FC, useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectEntityComponent } from '../../../store';
import Env from '@/conf/env';
import { EnumComponentType } from '../../../conf';
import { CodeOutlined } from '@ant-design/icons';
import BaseAPI from '@/api';

const GenerateEnumFull: FC = () => {
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
    if (window.tcdtAPI) {
      window.tcdtAPI.generateComponentEnumFull(
        Env.directServerUrl +
          `/component/generateEnumFull?id=${component?.idComponent}`,
      );
      return;
    }
    BaseAPI.GET_DOWNLOAD(
      `/component/generateEnumFull?id=${component.idComponent}`,
      component.displayName + '.zip',
    );
  };

  return (
    <>
      {component.componentType === EnumComponentType.Enum ? (
        <Tooltip overlay={'枚举组件组合生成'}>
          <Button
            size={'small'}
            onClick={handleGenerate}
            disabled={buttonDisabeld}
            icon={<CodeOutlined />}
          ></Button>
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );
};

export default GenerateEnumFull;
