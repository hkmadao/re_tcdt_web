import { FC, useState } from 'react';
import { Button, Input, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fetchDtoProjectTree, searchTreeNode } from '../../../store';
import { stringFilterParam } from '@/models';

type TOprationLayout = {};

const SearchLayout: FC<TOprationLayout> = () => {
  const [seachButtonDisabled, setSeachButtonDisabled] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>();

  const dispatch = useDispatch();

  const onReflesh = () => {
    setInputValue(undefined);
    dispatch(fetchDtoProjectTree());
  };

  const handleSearch = () => {
    if (!inputValue || !inputValue.trim()) {
      return;
    }
    dispatch(searchTreeNode(inputValue));
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      if (!inputValue || !inputValue.trim()) {
        return;
      }
      dispatch(searchTreeNode(inputValue));
    }
  };

  const handleChange = (e: any) => {
    setInputValue(e.currentTarget.value);
    if (!e.currentTarget.value || !e.currentTarget.value.trim()) {
      setSeachButtonDisabled(true);
      return;
    }
    setSeachButtonDisabled(false);
  };

  return (
    <>
      <div
        style={{
          margin: '5px',
        }}
      >
        <Space size={'small'}>
          <Input
            size={'small'}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleEnter}
          />
          <Button
            size={'small'}
            onClick={handleSearch}
            type={'primary'}
            disabled={seachButtonDisabled}
          >
            <SearchOutlined />
          </Button>
          <Button size={'small'} onClick={onReflesh} type={'primary'}>
            <ReloadOutlined />
          </Button>
        </Space>
      </div>
    </>
  );
};

export default SearchLayout;
