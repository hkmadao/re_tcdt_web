import { FC, useEffect, useRef } from 'react';
import { Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import CopyAddEntity from './CopyAddEntity';
import DeleteElement from './DeleteElement';
import AddEntity from './AddEntity';
import AddEnum from './AddEnum';
import SaveEntityCollection from './SaveEntityCollection';
import ZoomToFit from './ToggleFitCanvas';
import CleanAllElement from './CleanAllElement';
import CopyCollection from './CopyCollection';
import ElementAssociate from './ElementAssociate';
import {
  actions,
  selectBorderWH,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import SyncDtoEntity from './SyncDtoEntity';
import GenerateInputPart from './GenerateInputPart';
import GenerateInputFull from './GenerateInputFull';
import GenerateOutputFull from './GenerateOutputFull';
import GenerateOutputPart from './GenerateOutputPart';

const HeaderLayout: FC = () => {
  const dispatch = useDispatch();
  const borderWH = useSelector(selectBorderWH);
  const headerLayout = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(
      actions.updateHeaderHeight(
        headerLayout?.current?.getBoundingClientRect().height || 0,
      ),
    );
  }, []);

  useEffect(() => {
    dispatch(
      actions.updateHeaderHeight(
        headerLayout?.current?.getBoundingClientRect().height || 0,
      ),
    );
  }, [borderWH]);

  return (
    <>
      <div
        ref={headerLayout}
        style={{
          zIndex: 1,
          backgroundColor: 'white',
          padding: '5px 10px',
          borderBottom: '2px solid #b9b9b9',
          flex: '0 0 auto',
        }}
      >
        <Space size={20}>
          <SaveEntityCollection />
          <AddEntity />
          <AddEnum />
          <ElementAssociate />
          <CopyAddEntity />
          <DeleteElement />
          <CleanAllElement />
          <SyncDtoEntity />
          <GenerateInputFull />
          <GenerateInputPart />
          <GenerateOutputFull />
          <GenerateOutputPart />
          <ZoomToFit />
          <CopyCollection />
        </Space>
      </div>
    </>
  );
};

export default HeaderLayout;
