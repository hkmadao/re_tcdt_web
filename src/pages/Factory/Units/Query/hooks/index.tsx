import { useSelector } from 'react-redux';
import { TModuleStore } from '../model';
import { moduleReducerName } from '../conf';

export const useFgLoadData = () => {
  const fgLoadData = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      !!state[moduleReducerName].data.idQuery,
  );
  return fgLoadData;
};

export const useStatus = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].status;
  });
};

export const useModuleData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data;
  });
};

export const useCurrentSearchRef = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    if (state[moduleReducerName].current?.type === 'field') {
      return state[moduleReducerName].data.searchRefs?.find(
        (s) => s.idBillSearchRef === state[moduleReducerName].current?.id,
      );
    }
  });
};

export const useSearchRefs = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.searchRefs;
  });
};

export const useMetaData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.metaData;
  });
};
