import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentNodeTreeRef } from '../../../../store';
import { Descriptions } from 'antd';
import Method from './Method';
import NormalInput from './NormalInput';
import UriInput from './UriInput';

function NodeAttr() {
  const treeRef = useSelector(selectCurrentNodeTreeRef);

  return (
    <>
      <Descriptions column={1} bordered size={'small'}>
        <Descriptions.Item label="属性">值</Descriptions.Item>
        <Descriptions.Item label="ID">
          {treeRef?.idBillTreeRef}
        </Descriptions.Item>
        <Descriptions.Item label="请求方式">
          <Method />
        </Descriptions.Item>
        <Descriptions.Item label="请求URI">
          <UriInput attr={'uri'} />
        </Descriptions.Item>
        <Descriptions.Item label="节点主属性">
          <NormalInput attr={'keyAttr'} />
        </Descriptions.Item>
        <Descriptions.Item label="节点显示属性">
          <NormalInput attr={'labelAttr'} />
        </Descriptions.Item>
        <Descriptions.Item label="上级Id属性">
          <NormalInput attr={'parentIdAttr'} />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}

export default NodeAttr;
