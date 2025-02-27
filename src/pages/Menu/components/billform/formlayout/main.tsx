import { FC, useEffect } from 'react';
import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {} from './components/SubForm';
import MainFormLayout from './components/MainFormLayout';
import { actions } from './store';

const FormLayout: FC<{
  idLayout: string;
  /**组件是否是禁用状态 */
  fgDisabled: boolean;
  fgHidden: boolean;
}> = ({ idLayout, fgDisabled, fgHidden }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.setComponentInfo({ idUiConf: idLayout, fgDisabled, fgHidden }),
    );
  }, [idLayout, fgDisabled, fgHidden]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        <div style={{ flex: 'auto' }}>
          <MainFormLayout />
        </div>
        <div style={{ flex: 'auto' }}>
          <Tabs defaultActiveKey={''}></Tabs>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
