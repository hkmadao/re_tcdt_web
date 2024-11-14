import { Descriptions } from 'antd';
import NormalCheckbox from './NormalCheckbox';
import TagSelect from './TagSelect';
import DisplayNameInput from './DisplayNameInput';
import NameInput from './NameInput';

function TreeAttr() {
  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="名称">
          <NameInput attr={'name'} />
        </Descriptions.Item>
        <Descriptions.Item label="显示名称">
          <DisplayNameInput attr={'displayName'} />
        </Descriptions.Item>
        <Descriptions.Item label="是否存在第二层树">
          <NormalCheckbox attr={'twoLevelStatus'} />
        </Descriptions.Item>
        <Descriptions.Item label="可搜索属性">
          <TagSelect attr={'searchAttrs'} />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}

export default TreeAttr;
