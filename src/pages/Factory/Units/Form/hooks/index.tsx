import { useSelector } from 'react-redux';
import {
  EAttrTypes,
  TBillFormField,
  TBillFormTab,
  TModuleStore,
  TTableBillFormField,
  TTableBillFormTab,
} from '../model';
import { moduleReducerName } from '../conf';

export const useFgLoadData = () => {
  const fgLoadData = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      !!state[moduleReducerName].data.idBillForm,
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

export const useCurrentData = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    return state[moduleReducerName].current;
  });
};

export const useBillFormField = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const currentData = state[moduleReducerName].current;
    if (currentData?.attrType === EAttrTypes.Field) {
      const billFormBDTONew = currentData.data as TBillFormField;
      return billFormBDTONew;
    }
  });
};

export const useBillFormTab = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const currentData = state[moduleReducerName].current;
    if (currentData?.attrType === EAttrTypes.Panel) {
      const billFormTab = currentData.data as TBillFormTab;
      return billFormTab;
    }
  });
};

export const useTableBillFormField = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const currentData = state[moduleReducerName].current;
    if (currentData?.attrType === EAttrTypes.Field) {
      const billFormBDTONew = currentData.data as TTableBillFormField;
      return billFormBDTONew;
    }
  });
};

export const useTableBillFormTab = () => {
  return useSelector((state: { [x: string]: TModuleStore }) => {
    const currentData = state[moduleReducerName].current;
    if (currentData?.attrType === EAttrTypes.Panel) {
      const billFormTab = currentData.data as TTableBillFormTab;
      return billFormTab;
    }
  });
};
