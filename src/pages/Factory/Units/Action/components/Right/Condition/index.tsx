import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Descriptions } from 'antd';
import SizeSelect from './SizeSelect';
import NormalInput from './NormalInput';
import ClickEventNameInput from './ClickEventNameInput';
import { useCurrentButton } from '../../../hooks';
import NormalText from './NormalText';

const Condition: FC = () => {
  const dispatch = useDispatch();
  const currentButtton = useCurrentButton();

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          {currentButtton?.idButton}
        </Descriptions.Item>
        <Descriptions.Item label="序号">
          {currentButtton?.showOrder}
        </Descriptions.Item>
        <Descriptions.Item label="按钮类型">
          <ClickEventNameInput attr={'type'} />
        </Descriptions.Item>
        <Descriptions.Item label="按钮名称">
          <NormalInput attr={'label'} />
        </Descriptions.Item>
        <Descriptions.Item label="点击事件名称">
          <ClickEventNameInput attr={'clickEventName'} />
        </Descriptions.Item>
        <Descriptions.Item label="按钮尺寸">
          <SizeSelect />
        </Descriptions.Item>
        <Descriptions.Item label="禁用逻辑脚本">
          <NormalText attr={'disableScript'} />
        </Descriptions.Item>
        <Descriptions.Item label="隐藏逻辑脚本">
          <NormalText attr={'hiddenScript'} />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default Condition;
