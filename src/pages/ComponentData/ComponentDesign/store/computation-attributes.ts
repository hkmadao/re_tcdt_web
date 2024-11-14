import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import {
  TAttribute,
  TComputationAttribute,
  TEntity,
  TModuleStore,
} from '../models';

/**属性保存 */
export const updateComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TComputationAttribute>
> = (state, action) => {
  const newCa = action.payload;
  state.component.componentEntities = state.component.componentEntities?.map(
    (ce) => {
      if (
        ce.action !== DOStatus.DELETED &&
        ce.idComponentEntity === newCa.idComponentEntity
      ) {
        ce.computationAttributes = ce.computationAttributes?.map((ca) => {
          if (ca.idComputationAttribute === newCa.idComputationAttribute) {
            if (ce.action !== DOStatus.NEW) {
              ce.action = DOStatus.UPDATED;
            }
            return {
              ...ca,
              ...newCa,
              action:
                ca.action === DOStatus.UNCHANGED ? DOStatus.UPDATED : ca.action,
            };
          }
          return ca;
        });
      }
      return ce;
    },
  );
};

/**底部属性新增 */
export const addComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TComputationAttribute>
> = (state, action) => {
  const newCa = action.payload;
  state.component.componentEntities = state.component.componentEntities?.map(
    (ce) => {
      if (
        ce.action !== DOStatus.DELETED &&
        ce.idComponentEntity === newCa.idComponentEntity
      ) {
        if (ce.action !== DOStatus.NEW) {
          ce.action = DOStatus.UPDATED;
        }
        if (!ce.computationAttributes) {
          ce.computationAttributes = [];
        }
        // 用于序号
        const notDeleteAattributes =
          ce.computationAttributes?.filter(
            (computationAttribute) =>
              computationAttribute.action !== DOStatus.DELETED,
          ) || [];
        ce.computationAttributes?.push({
          ...newCa,
          action: DOStatus.NEW,
          sn: notDeleteAattributes.length + 1,
        });
      }
      return ce;
    },
  );
};

/** 删除底部属性数据 */
export const deleteComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TComputationAttribute>
> = (state, action) => {
  const deleteAttribute = action.payload as TComputationAttribute;
  const newEntity = state.component.componentEntities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idComponentEntity === deleteAttribute.idComponentEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  let newEntityAttrs = newEntity.computationAttributes?.filter((entityAttr) => {
    if (
      entityAttr.idComputationAttribute ===
      deleteAttribute.idComputationAttribute
    ) {
      // 没有保存过的数据直接删除
      if (entityAttr.action === DOStatus.NEW) {
        return false;
      }
      entityAttr.sn = 9999;
      entityAttr.action = DOStatus.DELETED;
    }
    return true;
  });
  newEntityAttrs?.sort((a1, a2) => {
    return a1.sn! - a2.sn!;
  });
  newEntityAttrs = newEntityAttrs?.filter((entityAttr, index) => {
    if (entityAttr.action === DOStatus.DELETED) {
      entityAttr.sn = 9999;
      return true;
    }
    entityAttr.action =
      entityAttr.action === DOStatus.UNCHANGED
        ? DOStatus.UPDATED
        : entityAttr.action;
    entityAttr.sn = index + 1;
    return true;
  });
  newEntity.computationAttributes = newEntityAttrs;
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idComponentEntity == newEntity.idComponentEntity) {
        if (entity.action !== DOStatus.NEW) {
          entity.action = DOStatus.UPDATED;
        }
        entity.computationAttributes = newEntity.computationAttributes;
      }
      return entity;
    },
  );
  // 更新图表
  // state.drawCount++;
};

/** 底部属性上移 */
export const computationAttributeRowUp: CaseReducer<
  TModuleStore,
  PayloadAction<TComputationAttribute>
> = (state, action) => {
  const moveAttribute = action.payload as TComputationAttribute;
  const newEntity = state.component.componentEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idComponentEntity === moveAttribute.idComponentEntity,
  );
  if (!newEntity) {
    return;
  }
  if (moveAttribute.sn === 1) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.computationAttributes) {
    newEntity.computationAttributes = [];
  }
  newEntity.computationAttributes?.map((attribute) => {
    const oldSn = attribute.sn;
    if (oldSn === moveAttribute.sn! - 1) {
      attribute.sn = attribute.sn! + 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    if (oldSn === moveAttribute.sn) {
      attribute.sn = attribute.sn! - 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    return attribute;
  });
  newEntity.computationAttributes?.sort((a1: TAttribute, a2: TAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idComponentEntity == newEntity.idComponentEntity) {
        if (entity.action !== DOStatus.NEW) {
          entity.action = DOStatus.UPDATED;
        }
        entity.computationAttributes = newEntity.computationAttributes;
      }
      return entity;
    },
  );
  // 更新图表
  // state.drawCount++;
};

/** 底部属性下移 */
export const computationAttributeRowDown: CaseReducer<
  TModuleStore,
  PayloadAction<TComputationAttribute>
> = (state, action) => {
  const moveAttribute = action.payload as TComputationAttribute;
  const newEntity = state.component.componentEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idComponentEntity === moveAttribute.idComponentEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.computationAttributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  if (moveAttribute.sn === notDeleteAattributes.length) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.computationAttributes) {
    newEntity.computationAttributes = [];
  }
  newEntity.computationAttributes?.map((attribute) => {
    const oldSn = attribute.sn;
    if (oldSn === moveAttribute.sn! + 1) {
      attribute.sn = attribute.sn! - 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    if (oldSn === moveAttribute.sn) {
      attribute.sn = attribute.sn! + 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    return attribute;
  });
  newEntity.computationAttributes?.sort((a1: TAttribute, a2: TAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.component.componentEntities = state.component.componentEntities?.map(
    (entity) => {
      if (entity.idComponentEntity == newEntity.idComponentEntity) {
        if (entity.action !== DOStatus.NEW) {
          entity.action = DOStatus.UPDATED;
        }
        entity.computationAttributes = newEntity.computationAttributes;
      }
      return entity;
    },
  );
  // 更新图表
  // state.drawCount++;
};
