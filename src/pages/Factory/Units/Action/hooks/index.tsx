import { useSelector } from 'react-redux';
import { TModuleStore } from '../model';
import { moduleReducerName } from '../conf';

export const useFgLoadData = () => {
  const fgLoadData = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      !!state[moduleReducerName].data.idButtonAction,
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

export const useButtons = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.buttons;
  });
};

export const useButtonById = (id: string) => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].data.buttons.find((b) => b.idButton === id);
  });
};

export const useCurrentButton = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    if (state[moduleReducerName].current?.type === 'field') {
      return state[moduleReducerName].data.buttons?.find(
        (s) => s.idButton === state[moduleReducerName].current?.id,
      );
    }
  });
};
