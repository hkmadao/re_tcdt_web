import SearchArea from '@/components/SearchArea';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRefProps } from '../../model';
import { fetchTableData } from '../../store/async-thunk';
import { usePageInfo } from '../../store';

const Search: React.FC<TRefProps> = (props) => {
  const dispatch = useDispatch();
  const pageInfo = usePageInfo();

  const handleSearch = (values: any) => {
    dispatch(
      fetchTableData({
        refProps: props,
        searchValues: values,
        pageSize: pageInfo?.pageInfoInput.pageSize,
        pageIndex: pageInfo?.pageInfoInput.pageIndex,
      }),
    );
  };

  return (
    <>
      <SearchArea
        searchRefs={props.tableRef?.searchRefs}
        callback={handleSearch}
      />
    </>
  );
};

export default Search;
