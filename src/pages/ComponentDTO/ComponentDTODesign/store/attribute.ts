import { DOStatus } from '@/models/enums';
import { underlineToHump } from '@/util/name-convent';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import { TDtoEntityAttribute, TModuleStore } from '../models';

/**属性保存 */
export const updateAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoEntityAttribute>
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
  const newEntityAttrs = newEntity.deAttributes?.map((entityAttr) => {
    if (
      entityAttr.idDtoEntityAttribute === newEntityAttr.idDtoEntityAttribute
    ) {
      if (entityAttr.fgPrimaryKey) {
        newEntity.pkAttributeCode = newEntityAttr.columnName;
        newEntity.pkAttributeName = newEntityAttr.displayName;
        newEntity.pkAttributeTypeName = newEntityAttr.attributeTypeName;
      }
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
  newEntity.deAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.deAttributes = newEntity.deAttributes;
      }
      return entity;
    },
  );
  // if (fgPrimaryKeyChange) {
  //   //更新图表
  //   state.drawCount++;
  // }
};

/**设置主属性 */
export const setAttributePrimaryKey: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoEntityAttribute>
> = (state, action) => {
  const newEntityAttr = action.payload;
  state.dtoCollection.dtoEntities?.find((entity) => {
    if (entity.idDtoEntity === newEntityAttr.idDtoEntity) {
      entity.action === DOStatus.UNCHANGED
        ? (entity.action = DOStatus.UPDATED)
        : undefined;
      if (entity.deAttributes) {
        entity.deAttributes.forEach((attribute) => {
          if (attribute.fgPrimaryKey) {
            attribute.fgPrimaryKey = false;
            attribute.action = DOStatus.UPDATED;
            return;
          }
          if (
            attribute.idDtoEntityAttribute ===
            newEntityAttr.idDtoEntityAttribute
          ) {
            entity.pkAttributeCode = newEntityAttr.attributeName;
            entity.pkAttributeName = newEntityAttr.displayName;
            entity.pkAttributeTypeName = newEntityAttr.attributeTypeName;

            attribute.fgPrimaryKey = true;
            attribute.action = DOStatus.UPDATED;
            return;
          }
        });
      }
      return true;
    }
    return false;
  });
};

/**属性类型保存 */
export const updateAttributeType: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEntityAttr = action.payload as TDtoEntityAttribute;
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
  const newEntityAttrs = newEntity.deAttributes?.map((entityAttr) => {
    if (
      entityAttr.idDtoEntityAttribute === newEntityAttr.idDtoEntityAttribute
    ) {
      if (newEntityAttr.fgPrimaryKey && !entityAttr.fgPrimaryKey) {
        fgPrimaryKeyChange = true;
      }
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
    //旧的主键，需要取消
    if (newEntityAttr.fgPrimaryKey && entityAttr.fgPrimaryKey) {
      entityAttr.fgPrimaryKey = false;
      entityAttr.action === DOStatus.UNCHANGED
        ? (entityAttr.action = DOStatus.UPDATED)
        : undefined;
    }
    return entityAttr;
  });
  newEntity.deAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.deAttributes = newEntity.deAttributes;
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
export const addAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newAttributes = action.payload as TDtoEntityAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEntity === newAttributes.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.deAttributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.deAttributes) {
    newEntity.deAttributes = [];
  }
  newEntity.deAttributes?.push({
    ...newAttributes,
    sn: notDeleteAattributes.length + 1,
    action: DOStatus.NEW,
  });
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.deAttributes = newEntity.deAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**删除底部属性数据 */
export const deleteAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const deleteAttribute = action.payload as TDtoEntityAttribute;
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
  let newEntityAttrs = newEntity.deAttributes?.filter((entityAttr) => {
    if (
      entityAttr.idDtoEntityAttribute === deleteAttribute.idDtoEntityAttribute
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
  newEntity.deAttributes = newEntityAttrs;
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.action = newEntity.action;
        entity.deAttributes = newEntity.deAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**底部属性上移 */
export const attrRowUp: CaseReducer<
  TModuleStore,
  PayloadAction<TDtoEntityAttribute>
> = (state, action) => {
  const moveAttribute = action.payload as TDtoEntityAttribute;
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
  if (!newEntity.deAttributes) {
    newEntity.deAttributes = [];
  }
  newEntity.deAttributes?.map((attribute) => {
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
  newEntity.deAttributes?.sort(
    (a1: TDtoEntityAttribute, a2: TDtoEntityAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.deAttributes = newEntity.deAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**底部属性下移 */
export const attrRowDown: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const moveAttribute = action.payload as TDtoEntityAttribute;
  const newEntity = state.dtoCollection.dtoEntities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idDtoEntity === moveAttribute.idDtoEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.deAttributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  if (moveAttribute.sn === notDeleteAattributes.length) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.deAttributes) {
    newEntity.deAttributes = [];
  }
  newEntity.deAttributes?.map((attribute) => {
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
  newEntity.deAttributes?.sort(
    (a1: TDtoEntityAttribute, a2: TDtoEntityAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEntities = state.dtoCollection.dtoEntities?.map(
    (entity) => {
      if (entity.idDtoEntity == newEntity.idDtoEntity) {
        entity.deAttributes = newEntity.deAttributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};
