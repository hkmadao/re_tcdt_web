import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TPage } from '../../../model';
import { actions, selectCurrentPage } from '../../../store';
import { Button } from 'antd';

const Page: FC<TPage> = ({ id, name }) => {
  const currentPage = useSelector(selectCurrentPage);
  const dipatch = useDispatch();

  const handleClick = () => {
    dipatch(actions.setCurrentPageId(id));
  };

  return (
    <>
      <Button
        size={'small'}
        onClick={handleClick}
        style={{
          color: id === currentPage?.id ? '#1890ff' : undefined,
          borderColor: id === currentPage?.id ? '#1890ff' : undefined,
        }}
      >
        {name}
      </Button>
    </>
  );
};

export default Page;
