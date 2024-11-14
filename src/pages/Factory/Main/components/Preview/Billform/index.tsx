import { FC, useEffect, useState } from 'react';
import { Form, Space, Table, Tabs } from 'antd';
import { getConf } from './hooks';
import ItemForm from './ItemForm';

const EditBillformPriview: FC<{ idConf: string }> = ({ idConf }) => {
  const [form] = Form.useForm();
  const [conf, setConf] = useState<any>();
  const [mainProperty, setMainProperty] = useState<string>();
  const [formItems, setFormItems] = useState<any[]>([]);
  const [maiItems, setMainItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!idConf) {
      return;
    }
    (async (idConf) => {
      const allConf = await getConf(idConf);
      if (allConf) {
        const { conf, formMap, subTableConfMap } = allConf;
        setConf(conf);

        if (Object.keys(formMap).length === 1) {
          Object.keys(formMap).forEach(function (key) {
            const { mainProperty, tabCode, tabName, nodes } = formMap[key];
            setMainProperty(mainProperty);
            setFormItems(nodes);
          });
        } else {
          const maiItems: any[] = [];
          Object.keys(formMap).forEach(function (key) {
            const { mainProperty, tabCode, tabName, nodes } = formMap[key];
            maiItems.push({
              label: tabName,
              key: tabCode,
              children: <ItemForm nodes={nodes} />,
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
        }}
      >
        <div style={{ flex: 'auto' }}>
          {maiItems.length > 0 ? (
            <Tabs items={maiItems} />
          ) : (
            <Form form={form} layout={'inline'}>
              <Space direction="horizontal" size={2} wrap={true}>
                {formItems.map((i) => i)}
              </Space>
            </Form>
          )}
        </div>
        <div style={{ flex: 'auto' }}>
          <Tabs items={items} />
        </div>
      </div>
    </>
  );
};

export default EditBillformPriview;
