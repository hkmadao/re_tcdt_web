import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TEnumAssociate, TModuleStore } from '../models';

/**实体枚举连线新增 */
export const addEnumAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  state.entityCollection?.enumAssociates?.push({
    ...action.payload,
    idEntityCollection: state.entityCollection.idEntityCollection,
    action: DOStatus.NEW,
  });
};

/**实体枚举连线更新 */
export const updateEnumAssociate: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEnumAsso: TEnumAssociate = action.payload;
  newEnumAsso.action === DOStatus.UNCHANGED
    ? (newEnumAsso.action = DOStatus.UPDATED)
    : undefined;
  state.entityCollection!.enumAssociates =
    state.entityCollection?.enumAssociates?.map((enumAsso) => {
      if (enumAsso.idEnumAssociate == newEnumAsso.idEnumAssociate) {
        enumAsso = {
          ...enumAsso,
          ...newEnumAsso,
        };
      }
      return enumAsso;
    });
};
