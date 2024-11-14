import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Metadata from '@/pages/Factory/Units/common/metadata';
import {
  selectMetaData,
  selectModuleData,
} from '@/pages/Factory/Units/Form/store';
import { getComponentAttributeTreeById } from '@/pages/Factory/Units/Form/store/async-thunk';

const Header = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<boolean>(true);
  const metaData = useSelector(selectMetaData);
  const moduleData = useSelector(selectModuleData);

  useEffect(() => {}, []);

  const handleReloadMetaData = () => {
    dispatch(getComponentAttributeTreeById(moduleData.idComponent!));
  };

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'white',
        flex: expanded ? '0 1 40%' : '0 1 auto',
        overflow: 'auto',
      }}
    >
      <Metadata
        treeData={metaData}
        setExpand={setExpanded}
        idComponent={moduleData.idComponent}
        onReloadMetadata={handleReloadMetaData}
      />
    </div>
  );
};

export default Header;
