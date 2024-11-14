import { DOStatus } from '@/models';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TUserRole, TRoleMenu } from '../../../../models';
import { TFormStore } from '../models';
/*==========UserRole=============*/
export const addFormDataUserRole: CaseReducer<
  TFormStore,
  PayloadAction<Pick<TUserRole, 'idSysUserRole'>>
> = (state, action) => {
  const userRoleNew: TUserRole = {
    ...action.payload,
    idSysUserRole: nanoid(),
  };
  userRoleNew.action = DOStatus.NEW;
  if (!state.formData.userRoles) {
    state.formData.userRoles = [];
  }
  state.formData.userRoles.push(userRoleNew);
  if (state.formData.action !== DOStatus.NEW) {
    state.formData.action = DOStatus.UPDATED;
  }
};

export const updateFormDataUserRole: CaseReducer<
  TFormStore,
  PayloadAction<TUserRole>
> = (state, action) => {
  const userRoleNews = state.formData.userRoles?.map((t) => {
    if (t.idSysUserRole === action.payload.idSysUserRole) {
      t = { ...t, ...action.payload };
      if (t.action !== DOStatus.NEW) {
        t.action = DOStatus.UPDATED;
      }
    }
    return t;
  });
  if (state) {
    if (state.formData.action !== DOStatus.NEW) {
      state.formData.action = DOStatus.UPDATED;
    }
    state.formData.userRoles = userRoleNews;
  }
};

export const deleteFormDataUserRole: CaseReducer<
  TFormStore,
  PayloadAction<TUserRole>
> = (state, action) => {
  let userRoleNews = state.formData.userRoles?.slice();
  userRoleNews = userRoleNews?.filter((t) => {
    if (t.idSysUserRole === action.payload.idSysUserRole) {
      if (t.action === DOStatus.NEW) {
        return false;
      }
      t.action = DOStatus.DELETED;
    }
    return true;
  });
  if (state) {
    state.formData.userRoles = userRoleNews;
    if (state.formData.action !== DOStatus.NEW) {
      state.formData.action = DOStatus.UPDATED;
    }
  }
};
/*==========UserRole=============*/
/*==========RoleMenu=============*/
export const addFormDataRoleMenu: CaseReducer<
  TFormStore,
  PayloadAction<Pick<TRoleMenu, 'idRoleMenu'>>
> = (state, action) => {
  const roleMenuNew: TRoleMenu = {
    ...action.payload,
    idRoleMenu: nanoid(),
  };
  roleMenuNew.action = DOStatus.NEW;
  if (!state.formData.roleMenus) {
    state.formData.roleMenus = [];
  }
  state.formData.roleMenus.push(roleMenuNew);
  if (state.formData.action !== DOStatus.NEW) {
    state.formData.action = DOStatus.UPDATED;
  }
};

export const updateFormDataRoleMenu: CaseReducer<
  TFormStore,
  PayloadAction<TRoleMenu>
> = (state, action) => {
  const roleMenuNews = state.formData.roleMenus?.map((t) => {
    if (t.idRoleMenu === action.payload.idRoleMenu) {
      t = { ...t, ...action.payload };
      if (t.action !== DOStatus.NEW) {
        t.action = DOStatus.UPDATED;
      }
    }
    return t;
  });
  if (state) {
    if (state.formData.action !== DOStatus.NEW) {
      state.formData.action = DOStatus.UPDATED;
    }
    state.formData.roleMenus = roleMenuNews;
  }
};

export const deleteFormDataRoleMenu: CaseReducer<
  TFormStore,
  PayloadAction<TRoleMenu>
> = (state, action) => {
  let roleMenuNews = state.formData.roleMenus?.slice();
  roleMenuNews = roleMenuNews?.filter((t) => {
    if (t.idRoleMenu === action.payload.idRoleMenu) {
      if (t.action === DOStatus.NEW) {
        return false;
      }
      t.action = DOStatus.DELETED;
    }
    return true;
  });
  if (state) {
    state.formData.roleMenus = roleMenuNews;
    if (state.formData.action !== DOStatus.NEW) {
      state.formData.action = DOStatus.UPDATED;
    }
  }
};
/*==========RoleMenu=============*/
