import { useSelector } from 'react-redux';
import { DOStatus } from '@/models';
import { TFormStore } from '../models';
import { componentName } from '../conf';

export * from './columns';

export const useEditStatusInfo = () => {
  return useSelector((state: { [x: string]: TFormStore }) => {
    return state[componentName].editStatusInfo;
  });
};

const selectIdUiConf = (state: { [x: string]: TFormStore }) => {
  return state[componentName].idUiConf;
};

export const useIdUiConf = () => {
  return useSelector(selectIdUiConf);
};

export const useFgDisabled = () => {
  return useSelector((state: { [x: string]: TFormStore }) => {
    return state[componentName].fgDisabled;
  });
};

export const useFgHidden = () => {
  return useSelector((state: { [x: string]: TFormStore }) => {
    return state[componentName].fgHidden;
  });
};

const selectStore = (state: { [x: string]: TFormStore }) => {
  return state[componentName].formData;
};

export const useFormData = () => {
  return useSelector(selectStore);
};
/*==========UserRoles=============*/
export const useUserRolesData = () => {
  return useSelector((state: { [x: string]: TFormStore }) => {
    if (!state[componentName].formData?.userRoles) {
      return [];
    }
    return state[componentName].formData.userRoles.filter(
      (userRole) => userRole.action !== DOStatus.DELETED,
    );
  });
};
/*==========UserRoles=============*/
/*==========RoleMenus=============*/
export const useRoleMenusData = () => {
  return useSelector((state: { [x: string]: TFormStore }) => {
    if (!state[componentName].formData?.roleMenus) {
      return [];
    }
    return state[componentName].formData.roleMenus.filter(
      (roleMenu) => roleMenu.action !== DOStatus.DELETED,
    );
  });
};
/*==========RoleMenus=============*/
