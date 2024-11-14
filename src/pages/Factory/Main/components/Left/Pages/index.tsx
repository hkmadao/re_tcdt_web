import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectPages } from '../../../store';
import Page from './page';
import { Button, Space } from 'antd';

const Pages: FC = () => {
  const dipatch = useDispatch();
  const pages = useSelector(selectPages);

  const handleAddPage = () => {
    dipatch(actions.addPage());
  };

  return (
    <>
      <div>
        <Button size={'small'} onClick={handleAddPage}>
          添加页面
        </Button>
      </div>
      <div
        style={{ margin: '5px 5px 5px 5px', height: '100px', overflow: 'auto' }}
      >
        <Space size={'small'} align="center" wrap>
          {pages.map((p, index) => (
            <Page {...p}></Page>
          ))}
        </Space>
      </div>
    </>
  );
};

export default Pages;
