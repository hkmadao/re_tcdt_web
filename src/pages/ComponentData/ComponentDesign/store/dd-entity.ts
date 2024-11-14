import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TComponentEntity, TEntity, TModuleStore } from '../models';

/**添加实体 */
export const addEntity: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idEntity = nanoid();
  state.component?.componentEntities?.push({
    ...action.payload,
    idEntity,
    action: DOStatus.NEW,
  });
  state.component!.componentNodeUis?.push({
    idElement: idEntity,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENTITY_DEFAULT_WIDTH,
    height: EnumNodeUi.ENTITY_DEFAULT_HEIGHT,
    idComponentNodeUi: nanoid(),
    idComponent: state.component?.idComponent,
    action: DOStatus.NEW,
  });
  if (state.focusDrawCount > 0) {
    state.focusIds.push(idEntity);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
};

/**更新实体 */
export const updateEntity: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEntity: TComponentEntity = action.payload;
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity = { ...newEntity, extAttributes: entity.extAttributes };
      }
      return entity;
    },
  );
};
