import { moduleReducerName } from '../../conf';
import { EPartName, TModuleStore } from '../../model';
import { useSelector, useDispatch } from 'react-redux';

export const useFormBillformTabs = (partName: EPartName) => {
  const billFormTDTOs = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configForm?.[partName],
  );
  return billFormTDTOs;
};

export const useFormBillformbs = (partName: EPartName, tabCode?: string) => {
  const billformbs = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configForm?.[partName]?.find(
        (billFormTDTO) => billFormTDTO.tabCode === tabCode,
      )?.billFormFields,
  );
  return billformbs;
};

export const useListBillformTabs = (partName: EPartName) => {
  const billFormTDTOs = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configList?.[partName],
  );
  return billFormTDTOs;
};

export const useListBillformbs = (partName: EPartName, tabCode?: string) => {
  const billformbs = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configList?.[partName]?.find(
        (billFormTDTO) => billFormTDTO.tabCode === tabCode,
      )?.billFormFields,
  );
  return billformbs;
};

export const useEditUriConf = () => {
  const uriConf = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configForm?.uriConf,
  );
  return uriConf;
};

export const useViewUriConf = () => {
  const uriConf = useSelector(
    (state: { [x: string]: TModuleStore }) =>
      state[moduleReducerName].data.configList?.uriConf,
  );
  return uriConf;
};
