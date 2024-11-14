import { FC, ReactNode, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import {
  actions,
  selectModuleUi,
} from '@/pages/ComponentDTO/ComponentDTODesign/store';
import {
  EnumCanvasUi,
  EnumConcreteDiagramType,
} from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import EntityLayout from './EntityLayout';
import PanelLayout from './PanelLayout';
import AssoLinkLayout from './AssoLinkLayout';
import EmptyLayout from './EmptyLayout';
import EnumLayout from './EnumLayout';
import EnumAssoLinkLayout from './EnumAssoLinkLayout';
import styles from './index.less';
import { useCurentSelectType } from '../../../hooks';

const RightLayout: FC = (props) => {
  const currentSelectType = useCurentSelectType();
  const moduleUi = useSelector(selectModuleUi);
  const dispatch = useDispatch();
  const [maxWidth, minWidth] = [500, 200];
  const { TabPane } = Tabs;
  const [width, setWidth] = useState(moduleUi.rWidth);
  // const [hidden, setHidden] = useState(false);
  const [content, setContent] = useState<ReactNode>(<PanelLayout />);

  useEffect(() => {
    switch (currentSelectType) {
      case EnumConcreteDiagramType.ENTITY:
        setContent(<EntityLayout />);
        break;
      case EnumConcreteDiagramType.ENUM:
        setContent(<EnumLayout />);
        break;
      case EnumConcreteDiagramType.ASSOLINK:
        setContent(<AssoLinkLayout />);
        break;
      case EnumConcreteDiagramType.ENUMASSOLINK:
        setContent(<EnumAssoLinkLayout />);
        break;
      case EnumConcreteDiagramType.PANEL:
        setContent(<PanelLayout />);
        break;
      default:
        setContent(<EmptyLayout />);
    }
  }, [currentSelectType]);

  const handleRize: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    let currentWidth = data.size.width;
    if (currentWidth > maxWidth) {
      currentWidth = maxWidth;
    }
    if (currentWidth < minWidth) {
      currentWidth = minWidth;
    }
    setWidth(currentWidth);
  };

  const handleResizeStop: (
    e: React.SyntheticEvent,
    data: ResizeCallbackData,
  ) => any = (e, data) => {
    dispatch(actions.updateRightWidth(width));
  };

  const hanleToggleHidden = () => {
    if (moduleUi.rWidth === 0) {
      setWidth(EnumCanvasUi.rWidth);
      dispatch(actions.updateRightWidth(EnumCanvasUi.rWidth));
    } else {
      dispatch(actions.updateRightWidth(0));
    }
  };

  useEffect(() => {
    // console.log(Math.floor(moduleUi.cHeight - moduleUi.hHeight));
  }, [moduleUi]);

  return (
    <>
      <div
        style={{
          position: 'relative',
          overflow: 'auto',
          zIndex: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-20px',
          }}
        >
          <span onClick={hanleToggleHidden}>
            {moduleUi.rWidth !== 0 ? (
              <DoubleRightOutlined className={styles.arrow} />
            ) : (
              <DoubleLeftOutlined className={styles.arrow} />
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
            width={width}
            height={200}
            resizeHandles={['w']}
            handle={<div className={styles.resizableHandleElement}></div>}
            onResize={handleRize}
            onResizeStop={handleResizeStop}
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
            backgroundColor: 'white',
            width: moduleUi.rWidth === 0 ? 0 : width,
            paddingLeft: '5px',
            overflow: 'auto',
          }}
        >
          <Tabs>
            <TabPane tab={'属性'} key="1">
              <div
                style={{
                  // height:
                  //   moduleUi.cHeight - moduleUi.hHeight - moduleUi.bHeight - 80,
                  overflow: 'auto',
                }}
              >
                {content}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default RightLayout;