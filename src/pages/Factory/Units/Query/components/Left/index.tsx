import React, { useEffect } from 'react';
import Metadata from '../../../common/metadata';
import { useSelector, useDispatch } from 'react-redux';
import { selectMetaData, selectModuleData } from '../../store';
import Action from './Action';
import { getComponentAttributeTreeById } from '@/pages/Factory/Units/Query/store/async-thunk';
const index = () => {
  const dispatch = useDispatch();
  const metaData = useSelector(selectMetaData);
  const moduleData = useSelector(selectModuleData);

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
