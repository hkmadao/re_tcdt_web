import {
  Checkbox,
  Collapse,
  Descriptions,
  Input,
  InputNumber,
  InputRef,
  Select,
  Space,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  actions,
  selectCurrentAsso,
  selectCurrentLayout,
  selectCurrentPage,
  selectLayouts,
} from '../../../store';
import {
  TComponentType,
  TDirection,
  TFlexType,
  TLayoutType,
} from '../../../model';
import BillformComp from './billformcomp';
import SearchComp from './searchcomp';
import TreeComp from './treecomp';
import { findLayoutBycompType } from '../../../store/util';
import PageMap from './pagemap';
import ActionComp from './actioncomp';

const Right: FC = () => {
  const dispatch = useDispatch();
  const layouts = useSelector(selectLayouts);
  const currentLayout = useSelector(selectCurrentLayout);
  const currentPage = useSelector(selectCurrentPage);
  const flexStrRef = useRef<InputRef>(null);
  const [flexStrValue, setFlexStrValue] = useState<string>();
  const titleRef = useRef<InputRef>(null);
  const [titleValue, setTitleValue] = useState<string>();
  const currentAsso = useSelector(selectCurrentAsso);

  const { Panel } = Collapse;

  useEffect(() => {
    if (currentLayout) {
      setFlexStrValue(currentLayout.flexStr);
      setTitleValue(currentLayout.title);
    }
  }, [currentLayout]);

  const handleChange = () => {};

  const handleDirChange = (value: TDirection) => {
    if (currentLayout) {
      dispatch(actions.updateLayout({ ...currentLayout, direction: value }));
    }
  };

  const handleTypeChange = (value: TLayoutType) => {
    if (currentLayout) {
      dispatch(actions.toggleLayout({ id: currentLayout.id }));
    }
  };

  const handleFlexTypeChange = (value: TFlexType) => {
    if (currentLayout) {
      let flexStr = '1 1 auto';
      if (value === 'auto') {
        flexStr = '1 1 auto';
      } else if (value === 'notGrow') {
        flexStr = '0 1 auto';
      } else if (value === 'custom') {
        flexStr = '0 0 20px';
      }
      dispatch(
        actions.updateLayout({ ...currentLayout, flexType: value, flexStr }),
      );
    }
  };

  const handleComponentTypeChange = (value: TComponentType) => {
    if (currentLayout) {
      dispatch(
        actions.updateLayoutCompType({
          id: currentLayout.id,
          componentType: value,
        }),
      );
    }
  };

  const handleFlexStrChange = () => {
    setFlexStrValue(flexStrRef.current?.input?.value);
  };

  const handleFlexStrBlur = () => {
    if (currentLayout && flexStrValue) {
      dispatch(
        actions.updateLayout({ ...currentLayout, flexStr: flexStrValue }),
      );
    }
  };

  const handleTitleChange = () => {
    setTitleValue(titleRef.current?.input?.value);
  };

  const handleTitleBlur = () => {
    if (currentLayout && titleValue) {
      dispatch(actions.updateLayout({ ...currentLayout, title: titleValue }));
    }
  };

  const handleHiddenChange = (e: any) => {
    if (currentAsso) {
      dispatch(
        actions.updateAsso({ ...currentAsso, hidden: e.target.checked }),
      );
    }
  };
  const handleDisabledChange = (e: any) => {
    if (currentAsso) {
      dispatch(
        actions.updateAsso({ ...currentAsso, disabled: e.target.checked }),
      );
    }
  };

  const selectAfter = (
    <Select defaultValue="%" style={{ width: 80 }}>
      <Select.Option value="%">%</Select.Option>
      <Select.Option value="px">px</Select.Option>
      <Select.Option value="vm">vm</Select.Option>
      <Select.Option value="vh">vh</Select.Option>
    </Select>
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
        }}
      >
        <Collapse
          defaultActiveKey={['base', 'style']}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <Panel header="基础属性" key="base">
            <Descriptions column={1} bordered size={'small'}>
              <Descriptions.Item label="属性">值</Descriptions.Item>
              <Descriptions.Item label="ID">
                {currentLayout?.id}
              </Descriptions.Item>
              <Descriptions.Item label="名称">
                <Input
                  ref={titleRef}
                  value={titleValue}
                  onBlur={handleTitleBlur}
                  key={'title'}
                  onChange={handleTitleChange}
                />
              </Descriptions.Item>
              <Descriptions.Item label="方向">
                <Select
                  value={currentLayout?.direction}
                  onChange={handleDirChange}
                >
                  <Select.Option value={'row'}>横向</Select.Option>
                  <Select.Option value={'column'}>纵向</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="布局方式">
                <Select
                  value={currentLayout?.flexType}
                  onChange={handleFlexTypeChange}
                >
                  <Select.Option value={'auto'}>自动</Select.Option>
                  <Select.Option value={'notGrow'}>弹性</Select.Option>
                  <Select.Option value={'custom'}>自定义</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Flex样式">
                <Input
                  // addonAfter={selectAfter}
                  disabled={currentLayout?.flexType !== 'custom'}
                  ref={flexStrRef}
                  value={flexStrValue}
                  onBlur={handleFlexStrBlur}
                  key={'flexStr'}
                  onChange={handleFlexStrChange}
                />
              </Descriptions.Item>
              <Descriptions.Item label="布局类型">
                <Select
                  disabled={
                    currentLayout?.children &&
                    currentLayout?.children.length > 0
                  }
                  value={currentLayout?.type}
                  onChange={handleTypeChange}
                >
                  <Select.Option value={'layout'}>布局</Select.Option>
                  <Select.Option value={'component'}>组件</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item
                label="组件类型"
                style={{
                  display:
                    currentLayout?.type === 'component' ? undefined : 'none',
                }}
              >
                <Select
                  value={currentLayout?.component?.componentType}
                  onChange={handleComponentTypeChange}
                  placeholder={'组件类型'}
                >
                  <Select.Option
                    value={'tree'}
                    disabled={findLayoutBycompType('tree', layouts)}
                  >
                    树组件
                  </Select.Option>
                  <Select.Option
                    value={'search'}
                    disabled={findLayoutBycompType('search', layouts)}
                  >
                    查询组件
                  </Select.Option>
                  <Select.Option
                    value={'viewBillform'}
                    disabled={findLayoutBycompType('viewBillform', layouts)}
                  >
                    列表组件
                  </Select.Option>
                  <Select.Option
                    value={'editBillform'}
                    disabled={findLayoutBycompType('editBillform', layouts)}
                  >
                    表单组件
                  </Select.Option>
                  <Select.Option
                    value={'viewButton'}
                    disabled={findLayoutBycompType('viewButton', layouts)}
                  >
                    列表按钮组件
                  </Select.Option>
                  <Select.Option
                    value={'editButton'}
                    disabled={findLayoutBycompType('editButton', layouts)}
                  >
                    表单按钮组件
                  </Select.Option>
                  <Select.Option value={'custom'}>自定义组件</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item
                label="组件"
                style={{
                  display:
                    currentLayout?.type === 'component' ? undefined : 'none',
                }}
              >
                {currentLayout?.component?.componentType === 'viewBillform' ||
                currentLayout?.component?.componentType === 'editBillform' ? (
                  <BillformComp />
                ) : currentLayout?.component?.componentType === 'viewButton' ||
                  currentLayout?.component?.componentType === 'editButton' ? (
                  <ActionComp />
                ) : currentLayout?.component?.componentType === 'search' ? (
                  <SearchComp />
                ) : currentLayout?.component?.componentType === 'tree' ? (
                  <TreeComp />
                ) : (
                  '暂不支持'
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label="页面映射"
                style={{
                  display:
                    currentLayout?.type === 'component' ? undefined : 'none',
                }}
              >
                <PageMap />
              </Descriptions.Item>
            </Descriptions>
          </Panel>
          <Panel header="样式" key="style">
            <Descriptions column={1} bordered size={'small'}>
              <Descriptions.Item label="属性">值</Descriptions.Item>
              <Descriptions.Item label="当前页">
                {currentPage?.name}
              </Descriptions.Item>
              <Descriptions.Item label="隐藏">
                <Checkbox
                  checked={currentAsso?.hidden}
                  onChange={handleHiddenChange}
                ></Checkbox>
              </Descriptions.Item>
              <Descriptions.Item label="禁用">
                <Checkbox
                  checked={currentAsso?.disabled}
                  onChange={handleDisabledChange}
                ></Checkbox>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default Right;
