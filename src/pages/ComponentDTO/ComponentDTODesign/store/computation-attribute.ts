import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TDtoComputationAttribute, TModuleStore } from '../models';

/**属性保存 */
export const updateComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoComputationAttribute>
> = (state, action) => {
  const newEntityAttr = action.payload;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idDtoEntity === newEntityAttr.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEntity.dcAttributes?.map((entityAttr) => {
    if (
      entityAttr.idDtoComputationAttribute ===
      newEntityAttr.idDtoComputationAttribute
    ) {
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
  newEntity.dcAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  // if (fgPrimaryKeyChange) {
  //   //更新图表
  //   state.drawCount++;
  // }
};

/**属性类型保存 */
export const updateComputationAttributeType: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEntityAttr = action.payload as TDtoComputationAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idDtoEntity === newEntityAttr.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  let fgPrimaryKeyChange: boolean = false;
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEntity.dcAttributes?.map((entityAttr) => {
    if (
      entityAttr.idDtoComputationAttribute ===
      newEntityAttr.idDtoComputationAttribute
    ) {
      return {
        ...entityAttr,
        idAttributeType: newEntityAttr.idAttributeType,
        attributeTypeName: newEntityAttr.attributeTypeName,
        action:
          entityAttr.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : entityAttr.action,
      };
    }
    return entityAttr;
  });
  newEntity.dcAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  // if (fgPrimaryKeyChange) {
  //   //更新图表
  //   state.drawCount++;
  // }
};

/**底部属性新增 */
export const addComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newAttributes = action.payload as TDtoComputationAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEntity === newAttributes.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.dcAttributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.dcAttributes) {
    newEntity.dcAttributes = [];
  }
  newEntity.dcAttributes?.push({
    ...newAttributes,
    sn: notDeleteAattributes.length + 1,
    action: DOStatus.NEW,
  });
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**删除底部属性数据 */
export const deleteComputationAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const deleteAttribute = action.payload as TDtoComputationAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEntity === deleteAttribute.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  let newEntityAttrs = newEntity.dcAttributes?.filter((entityAttr) => {
    if (
      entityAttr.idDtoComputationAttribute ===
      deleteAttribute.idDtoComputationAttribute
    ) {
      //没有保存过的数据直接删除
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
  newEntity.dcAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**底部属性上移 */
export const attrComputationRowUp: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const moveAttribute = action.payload as TDtoComputationAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idDtoEntity === moveAttribute.idDtoEntity,
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
  if (!newEntity.dcAttributes) {
    newEntity.dcAttributes = [];
  }
  newEntity.dcAttributes?.map((attribute) => {
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
  newEntity.dcAttributes?.sort(
    (a1: TDtoComputationAttribute, a2: TDtoComputationAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**底部属性下移 */
export const attrComputationRowDown: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const moveAttribute = action.payload as TDtoComputationAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idDtoEntity === moveAttribute.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.dcAttributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  if (moveAttribute.sn === notDeleteAattributes.length) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.dcAttributes) {
    newEntity.dcAttributes = [];
  }
  newEntity.dcAttributes?.map((attribute) => {
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
  newEntity.dcAttributes?.sort(
    (a1: TDtoComputationAttribute, a2: TDtoComputationAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.dcAttributes = newEntity.dcAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};
