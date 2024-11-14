import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TComponentEntity, TModuleStore } from '../models';

/**更新组件实体 */
export const updateComponentEntity: CaseReducer<
  TModuleStore,
  PayloadAction<TComponentEntity>
> = (state, action) => {
  const newComponentEntity = action.payload;
  newComponentEntity.action === DOStatus.UNCHANGED
    ? (newComponentEntity.action = DOStatus.UPDATED)
    : undefined;
  state.component.componentEntities = state.component.componentEntities?.map(
    (componentEntity) => {
      if (
        componentEntity.idComponentEntity ==
        newComponentEntity.idComponentEntity
      ) {
        componentEntity = {
          ...newComponentEntity,
          extAttributes: componentEntity.extAttributes,
        };
      }
      return componentEntity;
    },
  );
};
