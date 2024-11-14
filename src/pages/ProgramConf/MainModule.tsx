import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Button, Checkbox, Input, Popconfirm, Select, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import SubItem from './SubItem';
import { TCodeGenerateConfig } from './models';
import {
  actions,
  selectCurrentConf,
  selectConfList,
  selectActiveConf,
} from './store';
import { nanoid } from '@reduxjs/toolkit';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const MainModule: FC = () => {
  const dispatch = useDispatch();
  const [fgEdit, setFgEdit] = useState<boolean>(false);
  const currentConf = useSelector(selectCurrentConf);
  const activeConf = useSelector(selectActiveConf);
  const confList = useSelector(selectConfList);

  useEffect(() => {
    if (currentConf) {
    }
  }, [currentConf]);

  useEffect(() => {
    (async () => {
      if (window.tcdtAPI) {
        const confList: TCodeGenerateConfig[] =
          await window.tcdtAPI.fetchConf();
        dispatch(actions.addConfList(confList));
        return;
      }
    })();
  }, []);

  const handleAdd = async () => {
    let reg = new RegExp('conf-([0-9]{1,})');
    const maxIndex = confList
      .map((conf) => {
        if (conf.name) {
          let m = conf.name.match(reg);
          if (m && m.length > 0) {
            return parseInt(m[1]);
          }
        }
        return 0;
      })
      .reduce((result, current) => {
        return current > result ? current : result;
      });
    const id = nanoid();
    const newConf: TCodeGenerateConfig = {
      id: id,
      name: `conf-${maxIndex + 1}`,
      fgActive: false,
      entityFullPaths: [],
      entityPartPaths: [],
      componentCombinationPaths: [],
      componentSinglePaths: [],
      componentEnumFullPaths: [],
      componentEnumPartPaths: [],
      dtoInputFullPaths: [],
      dtoInputPartPaths: [],
      dtoOutputFullPaths: [],
      dtoOutputPartPaths: [],
      uiFactoryPaths: [],
    };
    if (window.tcdtAPI) {
      const saveAfterConf = await window.tcdtAPI.saveConf(newConf);
      const confList: TCodeGenerateConfig[] = await window.tcdtAPI.fetchConf();
      dispatch(actions.addConf(saveAfterConf));
      setFgEdit(false);
      return;
    }
  };

  const handleSave = async () => {
    if (!fgEdit) {
      setFgEdit(true);
      return;
    }
    if (window.tcdtAPI) {
      const newConf: TCodeGenerateConfig = {
        ...currentConf!,
      };
      const saveAfterConf = await window.tcdtAPI.saveConf(newConf);
      const confList: TCodeGenerateConfig[] = await window.tcdtAPI.fetchConf();
      dispatch(actions.addConfList(confList));
      setFgEdit(false);
      return;
    }
  };

  const handleCancel = () => {
    (async () => {
      if (window.tcdtAPI) {
        const clientConfList: TCodeGenerateConfig[] =
          await window.tcdtAPI.fetchConf();
        dispatch(actions.addConfList(clientConfList));
        setFgEdit(false);
        return;
      }
    })();
  };

  const handleReflesh = () => {
    (async () => {
      if (window.tcdtAPI) {
        const clientConfList: TCodeGenerateConfig[] =
          await window.tcdtAPI.fetchConf();
        dispatch(actions.addConfList(clientConfList));
        return;
      }
    })();
  };

  const handleReset = () => {
    (async () => {
      if (window.tcdtAPI) {
        const defalutConfList: TCodeGenerateConfig[] =
          await window.tcdtAPI.resetConf();
        dispatch(actions.setConfListAndIdCurrent(defalutConfList));
        return;
      }
    })();
  };

  const handleConfSelectChange = (value: string) => {
    dispatch(actions.setCurrentSelectConfId(value));
  };

  const handleRemove = () => {
    (async () => {
      if (window.tcdtAPI) {
        const newConf: TCodeGenerateConfig = {
          ...currentConf!,
        };
        window.tcdtAPI
          .removeConf(newConf)
          .then((clientConfList: TCodeGenerateConfig[]) => {
            dispatch(actions.setConfListAndIdCurrent(clientConfList));
          })
          .catch((e: Error) => {
            console.error(e);
          });
      }
    })();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newConf: TCodeGenerateConfig = {
      ...currentConf!,
      name,
    };
    dispatch(actions.updateConf(newConf));
  };

  const handleFgActiveChange = (e: CheckboxChangeEvent) => {
    const fgActive = e.target.checked;
    const newConf: TCodeGenerateConfig = {
      ...currentConf!,
      fgActive,
    };
    dispatch(actions.updateConf(newConf));
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: '0 1 auto',
          flexDirection: 'column',
          marginLeft: '10vw',
          marginRight: '10vw',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <Button type={'primary'} onClick={handleAdd} disabled={fgEdit}>
            添加
          </Button>
          <Button type={'primary'} onClick={handleSave}>
            {fgEdit ? '保存' : '编辑'}
          </Button>
          <Button type={'primary'} onClick={handleCancel} disabled={!fgEdit}>
            取消
          </Button>
          <Button type={'primary'} onClick={handleReflesh} disabled={fgEdit}>
            刷新
          </Button>
          <Popconfirm
            placement="bottom"
            title={'将恢复默认配置，是否继续？'}
            onConfirm={handleReset}
            okText="确认"
            cancelText="取消"
            disabled={fgEdit}
          >
            <Tooltip title={'恢复默认配置'}>
              <Button type={'primary'} disabled={fgEdit}>
                恢复默认配置
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            placement="bottom"
            title={'将删除当前配置，是否继续？'}
            onConfirm={handleRemove}
            okText="确认"
            cancelText="取消"
            disabled={fgEdit || currentConf?.id === activeConf?.id}
          >
            <Tooltip title={'删除当前配置'}>
              <Button
                type={'primary'}
                disabled={fgEdit || currentConf?.id === activeConf?.id}
              >
                删除
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'column',
            overflow: '0 1 auto',
            backgroundColor: 'white',
            gap: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: '0 1 auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: '0 1 auto',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div>当前激活配置：{activeConf?.name}</div>
              <div>
                配置：
                <Select
                  value={currentConf?.id}
                  disabled={fgEdit}
                  onChange={handleConfSelectChange}
                  style={{ minWidth: '200px' }}
                  placeholder={'请选择'}
                >
                  {confList.map((conf) => {
                    return (
                      <Select.Option key={conf.id} value={conf.id}>
                        {activeConf?.id === conf.id ? (
                          <b style={{ color: 'green' }}>{conf.name}</b>
                        ) : (
                          conf.name
                        )}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div>
              名称：
              <Input
                value={currentConf?.name}
                readOnly={!fgEdit}
                onChange={handleNameChange}
                style={{ width: '300px' }}
              />
            </div>
            <div>
              激活状态：
              <Checkbox
                checked={currentConf?.fgActive}
                disabled={!fgEdit}
                onChange={handleFgActiveChange}
              ></Checkbox>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>ER组合下载:</h2>
            <SubItem attrName={'entityFullPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>ER拆分下载:</h2>
            <SubItem attrName={'entityPartPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>单实体组件下载:</h2>
            <SubItem attrName={'componentSinglePaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>组合实体组件下载:</h2>
            <SubItem attrName={'componentCombinationPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>枚举组件组合下载:</h2>
            <SubItem attrName={'componentEnumFullPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>枚举组件拆分下载:</h2>
            <SubItem attrName={'componentEnumPartPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>页面工厂下载:</h2>
            <SubItem attrName={'uiFactoryPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>DTO入参组合下载:</h2>
            <SubItem attrName={'dtoInputFullPaths'} fgEdit={fgEdit} />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 'auto',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2>DTO入参拆分下载:</h2>
            <SubItem attrName={'dtoInputPartPaths'} fgEdit={fgEdit} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <h2>DTO出参组合下载:</h2>
          <SubItem attrName={'dtoOutputFullPaths'} fgEdit={fgEdit} />
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <h2>DTO出参拆分下载:</h2>
          <SubItem attrName={'dtoOutputPartPaths'} fgEdit={fgEdit} />
        </div>
      </div>
    </>
  );
};

export default MainModule;
