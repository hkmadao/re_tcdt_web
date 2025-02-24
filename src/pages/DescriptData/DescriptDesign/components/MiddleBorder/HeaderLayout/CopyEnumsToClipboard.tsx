import type { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectEntityCollection } from '@/pages/DescriptData/DescriptDesign/store';
import {
  TEnum,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyEnumsToClipboard: FC = () => {
  const entityCollection = useSelector(selectEntityCollection);
  /** 获取选择枚举 */
  const copyText = useSelector((state: Record<string, TModuleStore>) => {
    const enumIds =
      state[moduleName].selectNodes
        ?.map((node) => {
          if (node.concreteType === EnumConcreteDiagramType.ENUM) {
            return node.idElement!;
          }
          return '';
        })
        .filter((id) => {
          if (id) {
            return true;
          }
        }) || [];
    const selectEnums = entityCollection.enums.filter((ddEnum) => {
      if (ddEnum.action === DOStatus.DELETED) {
        return false;
      }
      return enumIds.includes(ddEnum.idEnum);
    });
    if (selectEnums.length === 0) {
      return;
    }
    const cpEnums = JSON.parse(JSON.stringify(selectEnums)) as TEnum[];
    cpEnums.forEach((entity) => {
      entity.attributes?.forEach((attr) => {});
    });
    return JSON.stringify(cpEnums);
  });

  return (
    <>
      <CopyToClipboard text={copyText || ''} onCopy={(text, result) => {}}>
        <Tooltip overlay={'复制选中枚举到剪贴板'}>
          <Button
            className={['copyAddButton', 'specialButton'].join(' ')}
            icon={<BlockOutlined />}
            disabled={!entityCollection?.idEntityCollection || !copyText}
            size={'small'}
          />
        </Tooltip>
      </CopyToClipboard>
    </>
  );
};

export default CopyEnumsToClipboard;
