import React, { useEffect } from 'react';
import Metadata from '../../../common/metadata';
import { useDispatch } from 'react-redux';
import Action from './Action';
import { useMetaData, useModuleData } from '../../hooks';
import { getComponentAttributeTreeById } from '../../store/async-thunk';
const index = () => {
  const dispatch = useDispatch();
  const metaData = useMetaData();
  const moduleData = useModuleData();

  useEffect(() => {}, []);

  const handleReloadMetaData = () => {
    dispatch(getComponentAttributeTreeById(moduleData.idComponent!));
  };

  return (
    <>
      <div
        style={{
          width: '20%',
          margin: '5px',
          backgroundColor: 'white',
          display: 'flex',
          flex: '0 auto 100%',
          overflow: 'auto',
          flexDirection: 'column',
        }}
      >
        <Action />
        <Metadata
          treeData={metaData ? [metaData] : []}
          idComponent={moduleData.idComponent}
          onReloadMetadata={handleReloadMetaData}
        />
      </div>
    </>
  );
};

export default index;
