import { DOStatus } from '@/models';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TUserRole } from '../../../../models';
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
