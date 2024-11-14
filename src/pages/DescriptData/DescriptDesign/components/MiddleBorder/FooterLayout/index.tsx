import { FC, ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import EntityAttrLayout from './EntityAttrLayout';
import OutEntityAttrLayout from './OutEntityAttrLayout';
import styles from './index.less';
import {
  selectModuleUi,
  actions,
} from '@/pages/DescriptData/DescriptDesign/store';
import { EnumCanvasUi, EnumConcreteDiagramType } from '../../../conf';
import PanelLayout from './PanelLayout';
import EnumAttrLayout from './EnumAttrLayout';
import OutEnumAttrLayout from './OutEnumAttrLayout';
import { useCurentSelectType } from '../../../hooks';
import EmptyLayout from './EmptyLayout';

const FooterLayout: FC = (props) => {
  const currentSelectType = useCurentSelectType();
  const moduleUi = useSelector(selectModuleUi);

  const dispatch = useDispatch();
  const [maxHeight, minHeight] = [600, 200];
  const [height, setHeight] = useState(moduleUi.bHeight);
  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    switch (currentSelectType) {
      case EnumConcreteDiagramType.ENTITY:
        setContent(<EntityAttrLayout />);
        break;
      case EnumConcreteDiagramType.OUT_ENTITY:
        setContent(<OutEntityAttrLayout />);
        break;
      case EnumConcreteDiagramType.ENUM:
        setContent(<EnumAttrLayout />);
        break;
      case EnumConcreteDiagramType.OUT_ENUM:
        setContent(<OutEnumAttrLayout />);
        break;
      case EnumConcreteDiagramType.ASSOLINK:
        setContent(<PanelLayout />);
        break;
      case EnumConcreteDiagramType.ENUMASSOLINK:
        setContent(<PanelLayout />);
        break;
      case EnumConcreteDiagramType.PANEL:
        setContent(<PanelLayout />);
        break;
      case EnumConcreteDiagramType.EMPTY:
        setContent(<EmptyLayout />);
        break;
      default:
        setContent(<EmptyLayout />);
        break;
    }
  }, [currentSelectType]);

  const hanleToggleHidden = () => {
    if (moduleUi.bHeight === 0) {
      setHeight(EnumCanvasUi.bHeight);
      dispatch(actions.updateBottomHeight(EnumCanvasUi.bHeight));
    } else {
      dispatch(actions.updateBottomHeight(0));
    }
  };

  const handleResize: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    let currentHeight = data.size.height;
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    }
    if (currentHeight < minHeight) {
      currentHeight = minHeight;
    }
    setHeight(currentHeight);
  };

  const handleResizeStop: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    let currentHeight = data.size.height;
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    }
    if (currentHeight < minHeight) {
      currentHeight = minHeight;
    }
    dispatch(actions.updateBottomHeight(currentHeight));
  };

  return (
    <>
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          flex: '0 0 auto',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'visible',
          position: 'relative',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-20px',
          }}
        >
          <span onClick={hanleToggleHidden}>
            {moduleUi.bHeight === 0 ? (
              <DoubleLeftOutlined className={styles.arrow} rotate={90} />
            ) : (
              <DoubleRightOutlined className={styles.arrow} rotate={90} />
            )}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
          }}
        >
          <Resizable
            lockAspectRatio={false}
            axis="y"
            resizeHandles={['n']}
            width={200}
            height={height}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            handle={<div className={styles.resizableHandleElement}></div>}
          >
            <div
              style={{
                display: 'flex',
                flex: 'auto',
              }}
            />
          </Resizable>
        </div>
        <div
          style={{
            height: moduleUi.bHeight === 0 ? 0 : height,
            overflow: 'hidden',
            display: 'flex',
            flex: 'auto',
          }}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default FooterLayout;
