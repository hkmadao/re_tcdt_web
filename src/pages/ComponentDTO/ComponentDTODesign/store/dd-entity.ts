import { DOStatus } from '@/models/enums';
import {
  CaseReducer,
  createAsyncThunk,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import { EnumNodeUi, moduleName } from '../conf';
import { TDtoEntity, TModuleStore } from '../models';

/**添加实体 */
export const addEntity: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idDtoEntity = nanoid();
  state.dtoCollection?.dtoEntities?.push({
    ...action.payload,
    idDtoEntity: idDtoEntity,
    action: DOStatus.NEW,
  });
  state.dtoCollection!.dtoNodeUis?.push({
    idElement: idDtoEntity,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_WIDTH,
    height: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_HEIGHT,
    idDtoNodeUi: nanoid(),
    idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
    action: DOStatus.NEW,
  });
  if (state.focusDrawCount > 0) {
    state.focusIds.push(idDtoEntity);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
};

/**更新实体 */
export const updateEntity: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoEntity>
> = (state, action) => {
  const newEntity: TDtoEntity = action.payload;
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity = { ...newEntity, deAttributes: entity.deAttributes };
      }
      return entity;
    },
  );
};
