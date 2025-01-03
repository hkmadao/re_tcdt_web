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

export const useModels = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const models: TModuleType[] = [];
    if (state[moduleReducerName].data.modelType) {
      models.push(state[moduleReducerName].data.modelType.mainType);
      models.push(...state[moduleReducerName].data.modelType.refTypes);
    }
    return models;
  });
};
