import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AttrTitle from './AttrTitle';
import FieldAttr from './FieldAttr';
import PanelAttr from './PanelAttr';
import { EAttrTypes } from '@/pages/Factory/Units/Form/model';
import { selectCurrent } from '@/pages/Factory/Units/Form/store';

function Middle() {
  const currentData = useSelector(selectCurrent);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'blue',
        flex: '1 1 50%',
        overflow: 'auto',
      }}
    >
      <AttrTitle />
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 'auto',
          }}
        >
          {currentData?.attrType === EAttrTypes.Field ? (
            <FieldAttr />
          ) : currentData?.attrType === EAttrTypes.Panel ? (
            <PanelAttr />
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

export default Middle;
