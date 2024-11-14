import { useSelector } from 'react-redux';
import { TModuleStore } from '../model';
import { moduleReducerName } from '../conf';
import { TModuleType } from '../../common/model';

export const useFgLoadData = () => {
  const fgLoadData = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      !!state[moduleReducerName].data.idFactory,
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

export const useModles = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const modles: TModuleType[] = [];
    if (state[moduleReducerName].data.modleType) {
      modles.push(state[moduleReducerName].data.modleType.mainType);
      modles.push(...state[moduleReducerName].data.modleType.refTypes);
    }
    return modles;
  });
};
