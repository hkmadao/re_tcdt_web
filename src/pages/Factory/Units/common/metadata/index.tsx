import { useState, type FC } from 'react';
import DragTree from './DragTree';
import { TDescriptionInfo } from '../model';
import { DoubleRightOutlined, RedoOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';

const Metadata: FC<{
  treeData: TDescriptionInfo[];
  setExpand?: (expand: boolean) => void;
  onReloadMetadata: () => void;
  idComponent?: string;
}> = ({ treeData, ...props }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleExpand = () => {
    props.setExpand ? props.setExpand(!expanded) : undefined;
    setExpanded(!expanded);
  };

  const handleReloadMetaData = () => {
    if (props.idComponent) {
      props.onReloadMetadata();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#6fb8fb',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        元数据
        <DoubleRightOutlined
          hidden={!props?.setExpand}
          onClick={toggleExpand}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(-90deg)',
          }}
        />
        <Popconfirm
          placement="bottom"
          title={'覆盖元数据提示'}
          onConfirm={handleReloadMetaData}
          okText="确认"
          cancelText="取消"
          disabled={!props.idComponent}
        >
          <Tooltip title={'重新获取元数据'}>
            <RedoOutlined />
          </Tooltip>
        </Popconfirm>
      </div>
      <div
        style={{
          display: expanded ? 'flex' : 'none',
          flex: 'auto',
          overflow: 'auto',
        }}
      >
        <div>
          <DragTree treeData={treeData} />
        </div>
      </div>
      <div
        style={{
          display: expanded ? 'none' : undefined,
        }}
      >
        内容已被隐藏...
      </div>
    </div>
  );
};

export default Metadata;
