import { Input, Modal, Tabs } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import RefBase from './base';
import LeftRefTree from './lefttree';
import RightTable from './table';
import { TBillRef, TBillTreeRef, TTableRef } from '../../model';
import styles from '@/pages/Factory/Units/common/less/styles.less';

type TOption = {
  lable: string;
  value: string;
  displayName?: string;
  dataType?: string;
};

const RefConf: FC<{
  value?: TBillRef;
  onChange?: (billRef: TBillRef) => void;
  idProject?: string;
  status: 'edit' | 'view';
}> = ({ value: refConf, onChange: callback, idProject, status }) => {
  const [refConfigModalVisible, setRefConfigModalVisible] = useState<boolean>();
  const [displayValue, setDisplayValue] = useState<string>();
  const billBaseRef = useRef<{
    getBillRefBase: () => Promise<Omit<TBillRef, 'billTreeRef' | 'tableRef'>>;
  }>(null);
  const billTreeRef = useRef<{ getBillTreeConf: () => Promise<TBillTreeRef> }>(
    null,
  );
  const tableConfRef = useRef<{ getTableConf: () => Promise<TTableRef> }>(null);
  const [refStyle, setRefStyle] = useState<'table' | 'treeTable' | 'tree'>(
    'table',
  );
  const [options, setOptions] = useState<TOption[]>([]);

  useEffect(() => {
    if (refConf) {
      setRefStyle(refConf.refStyle ?? 'table');
      setDisplayValue(JSON.stringify(refConf));
    } else {
      setRefStyle('table');
      setDisplayValue(undefined);
    }
  }, [refConf]);

  const handleChange = () => {};

  const onRefStyleChange = (value: any) => {
    setRefStyle(value);
  };

  const handleRefConfigOk = async () => {
    const billBase = await billBaseRef.current?.getBillRefBase();
    const tableConf = await tableConfRef.current?.getTableConf();
    const billTreeConf = await billTreeRef.current?.getBillTreeConf();
    if (tableConf) {
      const newRefConfig: TBillRef = {
        ...billBase,
        refStyle: billBase?.refStyle ?? 'table',
        billTreeRef: billTreeConf,
        tableRef: tableConf,
      };

      setDisplayValue(JSON.stringify(newRefConfig));
      callback ? callback(newRefConfig) : undefined;
      setRefConfigModalVisible(false);
    }
  };

  const openRefConfigModal = () => {
    if (status === 'view') {
      return;
    }
    setRefConfigModalVisible(true);
  };

  const handleRefConfigCancel = () => {
    setRefConfigModalVisible(false);
  };

  return (
    <>
      <Input.Search
        size={'small'}
        value={displayValue}
        onSearch={openRefConfigModal}
        enterButton
        readOnly={status === 'view'}
      />
      <Modal
        title="引用配置"
        open={refConfigModalVisible}
        onOk={handleRefConfigOk}
        onCancel={handleRefConfigCancel}
        className={classNames({ [styles.modalBody]: true })}
      >
        <div
          style={{
            margin: '5px',
          }}
        >
          {refStyle === 'treeTable' ? (
            <Tabs defaultActiveKey={'base'} onChange={handleChange}>
              <Tabs.TabPane tab="基本配置" key={'base'}>
                <RefBase
                  billRefBase={refConf}
                  onRefStyleChange={onRefStyleChange}
                  sourceOptions={options}
                  idProject={idProject}
                  ref={billBaseRef}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="树配置" key={'tree'}>
                <LeftRefTree
                  billTreeRef={refConf?.billTreeRef}
                  optionCallback={setOptions}
                  idProject={idProject}
                  ref={billTreeRef}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="表配置" key={'table'}>
                <RightTable
                  tableConf={refConf?.tableRef}
                  optionCallback={setOptions}
                  idProject={idProject}
                  ref={tableConfRef}
                />
              </Tabs.TabPane>
            </Tabs>
          ) : refStyle === 'table' ? (
            <Tabs defaultActiveKey={'base'} onChange={handleChange}>
              <Tabs.TabPane tab="基本配置" key={'base'}>
                <RefBase
                  billRefBase={refConf}
                  onRefStyleChange={onRefStyleChange}
                  sourceOptions={options}
                  idProject={idProject}
                  ref={billBaseRef}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="表配置" key={'table'}>
                <RightTable
                  tableConf={refConf?.tableRef}
                  optionCallback={setOptions}
                  idProject={idProject}
                  ref={tableConfRef}
                />
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <Tabs defaultActiveKey={'base'} onChange={handleChange}>
              <Tabs.TabPane tab="基本配置" key={'base'}>
                <RefBase
                  billRefBase={refConf}
                  onRefStyleChange={onRefStyleChange}
                  sourceOptions={options}
                  idProject={idProject}
                  ref={billBaseRef}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="树配置" key={'tree'}>
                <LeftRefTree
                  billTreeRef={refConf?.billTreeRef}
                  optionCallback={setOptions}
                  idProject={idProject}
                  ref={billTreeRef}
                />
              </Tabs.TabPane>
            </Tabs>
          )}
        </div>
      </Modal>
    </>
  );
};

export default RefConf;
