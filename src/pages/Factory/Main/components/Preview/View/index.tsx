import { FC, useEffect, useState } from 'react';
import { Table, Tabs } from 'antd';
import { getConf } from './hooks';

const ViewPriview: FC<{ idConf?: string }> = ({ idConf }) => {
  const [conf, setConf] = useState<any>();
  const [mainProperty, setMainProperty] = useState<string>();
  const [columns, setColumns] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [maiItems, setMainItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!idConf) {
      return;
    }
    (async (idConf) => {
      const allConf = await getConf(idConf);
      if (allConf) {
        const { conf, mainTableConfMap, subTableConfMap } = allConf;
        setConf(conf);

        if (Object.keys(mainTableConfMap).length === 1) {
          Object.keys(mainTableConfMap).forEach(function (key) {
            const { mainProperty, tabCode, tabName, tableConf } =
              mainTableConfMap[key];
            const { columns, dataSource } = tableConf;
            setMainProperty(mainProperty);
            setColumns(columns);
            setDataSource(dataSource);
          });
        } else {
          const maiItems: any[] = [];
          Object.keys(mainTableConfMap).forEach(function (key) {
            const { mainProperty, tabCode, tabName, tableConf } =
              mainTableConfMap[key];
            const { columns, dataSource } = tableConf;
            maiItems.push({
              label: tabName,
              key: tabCode,
              children: (
                <Table
                  size={'small'}
                  rowKey={mainProperty}
                  columns={columns}
                  dataSource={dataSource}
                  scroll={{ x: 300, y: 500 }}
                  pagination={{
                    total: 10,
                    current: 1,
                    pageSize: 10,
                  }}
                />
              ),
            });
          });
          setMainItems(maiItems);
        }

        const items: any[] = [];
        Object.keys(subTableConfMap).forEach(function (key) {
          const { mainProperty, tabCode, tabName, tableConf } =
            subTableConfMap[key];
          const { columns, dataSource } = tableConf;
          items.push({
            label: tabName,
            key: tabCode,
            children: (
              <Table
                size={'small'}
                rowKey={mainProperty}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 300, y: 500 }}
                pagination={{
                  total: 10,
                  current: 1,
                  pageSize: 10,
                }}
              />
            ),
          });
        });
        setItems(items);
      }
    })(idConf);
  }, [idConf]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <div style={{ flex: 'auto', overflow: 'auto' }}>
          {maiItems.length > 0 ? (
            <Tabs items={maiItems} />
          ) : (
            <Table
              size={'small'}
              rowKey={mainProperty}
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: 300, y: 500 }}
              pagination={{
                total: 10,
                current: 1,
                pageSize: 10,
              }}
            />
          )}
        </div>
        <div style={{ flex: 'auto', overflow: 'auto' }}>
          <Tabs items={items} />
        </div>
      </div>
    </>
  );
};

export default ViewPriview;
