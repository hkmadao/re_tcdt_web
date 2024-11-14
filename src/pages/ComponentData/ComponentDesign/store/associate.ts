import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TEntityAssociate, TModuleStore } from '../models';

/**连线新增 */
export const addAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idAssociate = nanoid();
  state.component?.componentEntityAssociates?.push({
    ...action.payload,
    idEntityCollection: state.component.idComponent,
    // idEntityAssociate: idAssociate,
    action: DOStatus.NEW,
  });
};

/**连线新增 */
export const updateAssociate: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEntityAsso: TEntityAssociate = action.payload;
  newEntityAsso.action === DOStatus.UNCHANGED
    ? (newEntityAsso.action = DOStatus.UPDATED)
    : undefined;
  state.component!.componentEntityAssociates =
    state.component?.componentEntityAssociates?.map((entityAsso) => {
      if (entityAsso.idEntityAssociate == newEntityAsso.idEntityAssociate) {
        entityAsso = {
          ...entityAsso,
          ...newEntityAsso,
        };
      }
      return entityAsso;
    });
};
