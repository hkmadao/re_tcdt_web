import type { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectEntityCollection,
  selectElements,
} from '@/pages/DescriptData/DescriptDesign/store';
import {
  TEntity,
  TModuleStore,
} from '@/pages/DescriptData/DescriptDesign/models';
import { DOStatus } from '@/models/enums';
import {
  EnumConcreteDiagramType,
  moduleName,
} from '@/pages/DescriptData/DescriptDesign/conf';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyEntitiesToClipboard: FC = () => {
  const dispatch = useDispatch();
  const entityCollection = useSelector(selectEntityCollection);
  /** 获取选择实体 */
  const copyText = useSelector((state: Record<string, TModuleStore>) => {
    const entityIds =
      state[moduleName].selectNodes
        ?.map((node) => {
          if (node.concreteType === EnumConcreteDiagramType.ENTITY) {
            return node.idElement!;
          }
          return '';
        })
        .filter((id) => {
          if (id) {
            return true;
          }
        }) || [];
    const selectEntities = entityCollection.entities.filter((entity) => {
      if (entity.action === DOStatus.DELETED) {
        return false;
      }
      return entityIds.includes(entity.idEntity);
    });
    if (selectEntities.length === 0) {
      return;
    }
    const cpEntities = JSON.parse(JSON.stringify(selectEntities)) as TEntity[];
    cpEntities.forEach((entity) => {
      entity.attributes?.forEach((attr) => {
        attr.attributeType = undefined;
      });
    });
    return JSON.stringify(cpEntities);
  });

  return (
    <>
      <CopyToClipboard text={copyText || ''} onCopy={(text, result) => {}}>
        <Tooltip overlay={'复制选中实体到剪贴板'}>
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

export default CopyEntitiesToClipboard;
