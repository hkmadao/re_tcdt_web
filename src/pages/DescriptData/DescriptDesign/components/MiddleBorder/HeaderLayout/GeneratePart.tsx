import { FC } from 'react';
import { Button, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { CodeOutlined } from '@ant-design/icons';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import Env from '@/conf/env';
import BaseAPI from '@/api';

const GeneratePart: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);

  const handleGenerate = () => {
    if (!entityCollection.packageName) {
      message.error('请填写包名！');
      return;
    }
    if (!entityCollection.displayName) {
      message.error('请填写显示名称！');
      return;
    }
    if (window.tcdtAPI) {
      window.tcdtAPI.generateEntityPart(
        Env.serverURL +
          `/entityCollection/generatePart?id=${entityCollection.idEntityCollection}`,
      );
      return;
    }
    BaseAPI.GET_DOWNLOAD(
      `/entityCollection/generatePart?id=${entityCollection.idEntityCollection}`,
      entityCollection.displayName + '.zip',
    );
  };

  return (
    <>
      <Tooltip overlay={'分散生成'}>
        <Button
          onClick={handleGenerate}
          disabled={!entityCollection.idEntityCollection}
          size={'small'}
          icon={<CodeOutlined />}
        ></Button>
      </Tooltip>
    </>
  );
};

export default GeneratePart;
