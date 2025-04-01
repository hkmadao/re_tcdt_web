import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TAttribute, TEntity, TModuleStore } from '../models';

/**恢复删除的属性数据 */
export const recoverAttributes: CaseReducer<
  TModuleStore,
  PayloadAction<TAttribute[]>
> = (state, action) => {
  const toRecoverData = action.payload;
  if (toRecoverData.length === 0) {
    return;
  }
  const idEntity = toRecoverData[0].idEntity;
  const newEntity = state.entityCollection.entities?.find(
    (entity) => entity.idEntity === idEntity,
  );
  if (!newEntity) {
    return;
  }
  const recoverIds = toRecoverData.map((attr) => attr.idAttribute!);
  const toRecoverAttrs =
    newEntity.attributes?.filter((attr) =>
      recoverIds.includes(attr.idAttribute!),
    ) || [];
  const notDeleteAttrCount =
    newEntity.attributes?.filter((attr) => attr.action !== DOStatus.DELETED)
      .length || 0;

  toRecoverAttrs.forEach((attr, index) => {
    attr.action = DOStatus.UPDATED;
    attr.sn = notDeleteAttrCount + index + 1;
  });
  const newAttrs =
    newEntity.attributes?.filter(
      (attr) => !recoverIds.includes(attr.idAttribute!),
    ) || [];
  newAttrs.push(...toRecoverAttrs);
  newAttrs?.sort((a1, a2) => {
    return a1.sn! - a2.sn!;
  });
  newEntity.attributes = newAttrs;

  if (newEntity.action === DOStatus.DELETED) {
    newEntity.action = DOStatus.UPDATED;
    state.entityCollection.entities = state.entityCollection.entities?.map(
      (entity) => {
        if (entity.idEntity === newEntity.idEntity) {
          return newEntity;
        }
        return entity;
      },
    );
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === idEntity) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    //更新图表
    state.drawCount++;
  } else {
    state.entityCollection.entities = state.entityCollection.entities?.map(
      (entity) => {
        if (entity.idEntity === newEntity.idEntity) {
          return newEntity;
        }
        return entity;
      },
    );
  }
};

/**恢复删除的实体数据 */
export const recoverEntity: CaseReducer<
  TModuleStore,
  PayloadAction<TEntity>
> = (state, action) => {
  const idEntity = action.payload.idEntity;
  const newEntity = state.entityCollection.entities?.find(
    (entity) => entity.idEntity === idEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action = DOStatus.UPDATED;
  state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
    (nodeUi) => {
      if (nodeUi.idElement === idEntity) {
        nodeUi.action = DOStatus.UPDATED;
      }
      return nodeUi;
    },
  );
  newEntity.attributes?.forEach((attr, index) => {
    attr.action = DOStatus.UPDATED;
    attr.sn = index + 1;
  });
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity === newEntity.idEntity) {
        return newEntity;
      }
      return entity;
    },
  );
  //更新图表
  state.drawCount++;
};
