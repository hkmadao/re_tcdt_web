import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import { TAttribute, TEntity, TModuleStore } from '../models';

/**属性保存 */
export const updateAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TAttribute>
> = (state, action) => {
  const newEntityAttr = action.payload;
  const newEntity = state.component.componentEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idEntity === newEntityAttr.idEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEntity.extAttributes?.map((entityAttr) => {
    if (entityAttr.idAttribute === newEntityAttr.idAttribute) {
      return {
        ...entityAttr,
        ...newEntityAttr,
        action:
          entityAttr.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : entityAttr.action,
      };
    }
    return entityAttr;
  });
  newEntity.extAttributes = newEntityAttrs;
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.action = newEntity.action;
        entity.extAttributes = newEntity.extAttributes;
      }
      return entity;
    },
  );
};

/**属性类型保存 */
export const updateAttributeType: CaseReducer<
  TModuleStore,
  PayloadAction<TAttribute>
> = (state, action) => {
  const newEntityAttr = action.payload;
  const newEntity = state.component.componentEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idEntity === newEntityAttr.idEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEntity.extAttributes?.map((entityAttr) => {
    if (entityAttr.idAttribute === newEntityAttr.idAttribute) {
      return {
        ...entityAttr,
        idAttributeType: newEntityAttr.idAttributeType,
        attributeTypeName: newEntityAttr.attributeType?.code,
        action:
          entityAttr.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : entityAttr.action,
      };
    }
    return entityAttr;
  });
  newEntity.extAttributes = newEntityAttrs;
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.action = newEntity.action;
        entity.extAttributes = newEntity.extAttributes;
      }
      return entity;
    },
  );
};

/**底部属性新增 */
export const addAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {};

/**删除底部属性数据 */
export const deleteAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {};

/**底部属性上移 */
export const attrRowUp: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {};

/**底部属性下移 */
export const attrRowDown: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {};
