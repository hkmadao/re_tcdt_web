import { DOStatus } from '@/models/enums';
import { underlineToHump } from '@/util/name-convent';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TEntity, TModuleStore, TNodeUi } from '../models';

/**添加实体 */
export const addEntity: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idEntity = nanoid();
  state.entityCollection?.entities?.push({
    ...action.payload,
    idEntity,
    action: DOStatus.NEW,
  });
  state.entityCollection!.nodeUis?.push({
    idElement: idEntity,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_WIDTH,
    height: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_HEIGHT,
    idNodeUi: nanoid(),
    idEntityCollection: state.entityCollection?.idEntityCollection,
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

/** 粘贴实体 */
export const patseEntities: CaseReducer<
  TModuleStore,
  PayloadAction<TEntity[]>
> = (state, action) => {
  const newEntities: TEntity[] = action.payload;
  const newNodeUis: TNodeUi[] = [];
  newEntities.forEach((newEntity, index) => {
    newEntity.idEntity = nanoid();
    const nodeUi: TNodeUi = {
      idNodeUi: nanoid(),
      x: index * EnumNodeUi.ENTITY_SIMPLE_DEFAULT_WIDTH,
      y: 0,
      width: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idEntityCollection: state.entityCollection?.idEntityCollection,
      idElement: newEntity.idEntity,
      action: DOStatus.NEW,
    };
    newNodeUis.push(nodeUi);
    newEntity.action = DOStatus.NEW;
    newEntity.attributes?.forEach((attr) => {
      attr.idEntity = newEntity.idEntity;
      attr.idAttribute = nanoid();
      attr.action = DOStatus.NEW;
      attr.idAttributeType = undefined;
      if (!!attr.attributeName) {
        attr.attributeName = attr.columnName
          ? underlineToHump(attr.columnName)
          : undefined;
      }
    });
  });
  state.entityCollection.nodeUis =
    state.entityCollection.nodeUis?.concat(newNodeUis);
  state.entityCollection.entities =
    state.entityCollection.entities?.concat(newEntities);
  //更新图表
  state.drawCount++;
};

/**更新实体 */
export const updateEntity: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEntity: TEntity = action.payload;
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity = { ...newEntity, attributes: entity.attributes };
      }
      return entity;
    },
  );
};
