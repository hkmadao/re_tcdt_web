import { FC, useEffect, useRef, useState } from 'react';
import { Layout, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import DeleteElement from './DeleteElement';
import SaveComponent from './SaveComponent';
import GenerateCode from './GeneratePart';
import AddAssociate from './AddAssociate';
import AddMainEntity from './AddMainEntity';
import AddComponenEnum from './AddComponenEnum';
import CleanAllElement from './CleanAllElement';
import {
  actions,
  selectDiagramUi,
  selectEntityComponent,
} from '@/pages/ComponentData/ComponentDesign/store';
import { EnumComponentType } from '../../../conf';
import GenerateEnumFull from './GenerateEnumFull';

const HeaderLayout: FC = () => {
  const { Header } = Layout;
  const dispatch = useDispatch();
  const component = useSelector(selectEntityComponent);
  const diagramUi = useSelector(selectDiagramUi);
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
  }, [diagramUi]);

  return (
    <>
      <div
        ref={headerLayout}
        style={{
          zIndex: 1,
          backgroundColor: 'white',
          flex: '0 0 auto',
          padding: '5px 10px',
          borderBottom: '2px solid #b9b9b9',
        }}
      >
        <Space size={20}>
          <SaveComponent />
          {component.componentType !== EnumComponentType.Enum ? (
            <AddMainEntity />
          ) : (
            ''
          )}
          {component.componentType === EnumComponentType.Combination ? (
            <AddAssociate />
          ) : (
            ''
          )}
          {component.componentType === EnumComponentType.Enum ? (
            <AddComponenEnum />
          ) : (
            ''
          )}
          <DeleteElement />
          <CleanAllElement />
          <GenerateCode />
          {component.componentType === EnumComponentType.Enum ? (
            <GenerateEnumFull />
          ) : (
            ''
          )}
        </Space>
      </div>
    </>
  );
};

export default HeaderLayout;
