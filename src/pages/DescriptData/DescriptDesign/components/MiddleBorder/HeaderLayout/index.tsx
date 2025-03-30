import { FC, useEffect, useRef } from 'react';
import { Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import ImportOutEntity from './ImportOutEntity';
import Note from './Note';
import JoinEntity from './JoinEntity';
import CopyAddEntity from './CopyAddEntity';
import DeleteElement from './DeleteElement';
import AddEntity from './AddEntity';
import AddEnum from './AddEnum';
import ToggleFgShowOutEntites from './ToggleFgShowOutEntites';
import SaveCollection from './SaveCollection';
import ToggleFgFocus from './ToggleFgFocus';
import GenerateFull from './GenerateFull';
import ZoomToFit from './ToggleFitCanvas';
import CleanAllElement from './CleanAllElement';
import CopyCollection from './CopyCollection';
import ElementAssociate from './ElementAssociate';
import GeneratePart from './GeneratePart';
import CopyEntitiesToClipboard from './CopyEntitiesToClipboard';
import CopyEnumsToClipboard from './CopyEnumsToClipboard';
import PasteEnums from './PasteEnums';
import ImportCollection from './ImportCollection';
import ExportCollection from './ExportCollection';
import ToggleFgShowEnumAsso from './ToggleFgShowEnumAsso';
import { actions, selectBorderWH } from '../../../store';
import DbTableComparison from './DbTableComparison';
import GenerateSingleFile from './GenerateSingleFile';
import ToggleFgShowSysRefAsso from './ToggleFgShowSysRefAsso';
import FromCreateSql from './FromCreateSql';
import FromPaste from './FromPaste';

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
          {/* <Input placeholder='测试' name='testInput' onChange={handleClick}></Input> */}
          <SaveCollection />
          <AddEntity />
          <AddEnum />
          <ElementAssociate />
          <JoinEntity />
          <CopyAddEntity />
          <ImportOutEntity />
          <ToggleFgShowSysRefAsso />
          <ToggleFgShowOutEntites />
          <ToggleFgShowEnumAsso />
          <DeleteElement />
          <CleanAllElement />
          <ToggleFgFocus />
          <GenerateSingleFile />
          <GenerateFull />
          <GeneratePart />
          <ZoomToFit />
          <CopyCollection />
          <CopyEntitiesToClipboard />
          <FromPaste />
          <CopyEnumsToClipboard />
          <PasteEnums />
          <ImportCollection />
          <ExportCollection />
          <DbTableComparison />
          <FromCreateSql />
          {/* <Note /> */}
        </Space>
      </div>
    </>
  );
};

export default HeaderLayout;
