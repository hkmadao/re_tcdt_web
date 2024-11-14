import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TDtoEnumAssociate, TModuleStore } from '../models';

/**实体枚举连线新增 */
export const addEnumAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  state.dtoCollection?.dtoEnumAssociates?.push({
    ...action.payload,
    idDtoEntityCollection: state.dtoCollection.idDtoEntityCollection,
    action: DOStatus.NEW,
  });
};

/**实体枚举连线更新 */
export const updateEnumAssociate: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEnumAsso: TDtoEnumAssociate = action.payload;
  newEnumAsso.action === DOStatus.UNCHANGED
    ? (newEnumAsso.action = DOStatus.UPDATED)
    : undefined;
  state.dtoCollection!.dtoEnumAssociates =
    state.dtoCollection?.dtoEnumAssociates?.map((enumAsso) => {
      if (enumAsso.idDtoEnumAssociate == newEnumAsso.idDtoEnumAssociate) {
        enumAsso = {
          ...enumAsso,
          ...newEnumAsso,
        };
      }
      return enumAsso;
    });
};
