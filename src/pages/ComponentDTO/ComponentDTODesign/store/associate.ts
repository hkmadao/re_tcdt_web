import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TDtoEntityAssociate, TModuleStore } from '../models';

/**连线新增 */
export const addAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idAssociate = nanoid();
  state.dtoCollection?.deAssociates?.push({
    ...action.payload,
    idDtoEntityCollection: state.dtoCollection.idDtoEntityCollection,
    // idEntityAssociate: idAssociate,
    action: DOStatus.NEW,
  });
};

/**连线修改 */
export const updateAssociate: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoEntityAssociate>
> = (state, action) => {
  const newEntityAsso: TDtoEntityAssociate = action.payload;
  newEntityAsso.action === DOStatus.UNCHANGED
    ? (newEntityAsso.action = DOStatus.UPDATED)
    : undefined;
  state.dtoCollection!.deAssociates = state.dtoCollection?.deAssociates?.map(
    (entityAsso) => {
      if (
        entityAsso.idDtoEntityAssociate == newEntityAsso.idDtoEntityAssociate
      ) {
        entityAsso = {
          ...entityAsso,
          ...newEntityAsso,
        };
      }
      return entityAsso;
    },
  );
};
