import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TEntityAssociate, TModuleStore } from '../models';

/**连线新增 */
export const addAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idAssociate = nanoid();
  state.entityCollection?.entityAssociates?.push({
    ...action.payload,
    idEntityCollection: state.entityCollection.idEntityCollection,
    // idEntityAssociate: idAssociate,
    action: DOStatus.NEW,
  });
};

/**连线修改 */
export const updateAssociate: CaseReducer<
  TModuleStore,
  PayloadAction<TEntityAssociate>
> = (state, action) => {
  const newEntityAsso: TEntityAssociate = action.payload;
  newEntityAsso.action === DOStatus.UNCHANGED
    ? (newEntityAsso.action = DOStatus.UPDATED)
    : undefined;
  state.entityCollection!.entityAssociates =
    state.entityCollection?.entityAssociates?.map((entityAsso) => {
      if (entityAsso.idEntityAssociate == newEntityAsso.idEntityAssociate) {
        entityAsso = {
          ...entityAsso,
          ...newEntityAsso,
          joins: entityAsso.joins,
        };
      }
      return entityAsso;
    });
};
