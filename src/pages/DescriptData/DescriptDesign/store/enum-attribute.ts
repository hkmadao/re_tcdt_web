import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TEnumAttribute, TModuleStore } from '../models';

/**枚举属性保存 */
export const updateEnumAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEnumAttribute = action.payload as TEnumAttribute;
  const newEnum = state.entityCollection.enums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEnum === newEnumAttribute.idEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEnum.attributes?.map((enumAttribute) => {
    if (enumAttribute.idEnumAttribute === newEnumAttribute.idEnumAttribute) {
      return {
        ...enumAttribute,
        ...newEnumAttribute,
        action:
          enumAttribute.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : enumAttribute.action,
      };
    }
    return enumAttribute;
  });
  newEnum.attributes = newEntityAttrs;
  state.entityCollection.enums = state.entityCollection.enums?.map((entity) => {
    if (entity.idEnum == newEnum.idEnum) {
      entity.action = newEnum.action;
      entity.attributes = newEnum.attributes;
    }
    return entity;
  });
};

/**枚举属性新增 */
export const addEnumAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEnumAttribute = action.payload as TEnumAttribute;
  const newEnum = state.entityCollection.enums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEnum === newEnumAttribute.idEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  if (!newEnum.attributes) {
    newEnum.attributes = [];
  }
  newEnum.attributes?.push({
    ...action.payload,
    sn: newEnum.attributes.length + 1,
    action: DOStatus.NEW,
  });
  state.entityCollection.enums = state.entityCollection.enums?.map((entity) => {
    if (entity.idEnum == newEnum.idEnum) {
      entity.attributes = newEnum.attributes;
    }
    return entity;
  });
  //更新图表
  // state.drawCount++;
};

/**删除枚举属性数据 */
export const deleteEnumAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const deleteEnumAttribute = action.payload as TEnumAttribute;
  const newEnum = state.entityCollection.enums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEnum === deleteEnumAttribute.idEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  let newEnumAttrs = newEnum.attributes?.filter((entityAttr) => {
    if (entityAttr.idEnumAttribute === deleteEnumAttribute.idEnumAttribute) {
      //没有保存过的数据直接删除
      if (entityAttr.action === DOStatus.NEW) {
        return false;
      }
      entityAttr.sn = 9999;
      entityAttr.action = DOStatus.DELETED;
    }
    return true;
  });
  newEnumAttrs?.sort((a1, a2) => {
    return a1.sn! - a2.sn!;
  });
  newEnumAttrs = newEnumAttrs?.filter((entityAttr, index) => {
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
  newEnum.attributes = newEnumAttrs;
  state.entityCollection.enums = state.entityCollection.enums?.map((ddEnum) => {
    if (ddEnum.idEnum == newEnum.idEnum) {
      ddEnum.action = newEnum.action;
      ddEnum.attributes = newEnum.attributes;
    }
    return ddEnum;
  });
  //更新图表
  // state.drawCount++;
};

/**枚举属性上移 */
export const enumAttrRowUp: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const moveEnumAttribute = action.payload as TEnumAttribute;
  const newEnum = state.entityCollection.enums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEnum === moveEnumAttribute.idEnum,
  );
  if (!newEnum) {
    return;
  }
  if (moveEnumAttribute.sn === 1) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  if (!newEnum.attributes) {
    newEnum.attributes = [];
  }
  newEnum.attributes?.map((attribute) => {
    const oldSn = attribute.sn;
    if (oldSn === moveEnumAttribute.sn! - 1) {
      attribute.sn = attribute.sn! + 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    if (oldSn === moveEnumAttribute.sn) {
      attribute.sn = attribute.sn! - 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    return attribute;
  });
  newEnum.attributes?.sort((a1: TEnumAttribute, a2: TEnumAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.entityCollection.enums = state.entityCollection.enums?.map((ddEnum) => {
    if (ddEnum.idEnum == newEnum.idEnum) {
      ddEnum.attributes = newEnum.attributes;
    }
    return ddEnum;
  });
  //更新图表
  // state.drawCount++;
};

/**枚举属性下移 */
export const enumAttrRowDown: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const moveEnumAttribute = action.payload as TEnumAttribute;
  const newEnum = state.entityCollection.enums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEnum === moveEnumAttribute.idEnum,
  );
  if (!newEnum) {
    return;
  }
  if (moveEnumAttribute.sn === newEnum.attributes?.length) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  if (!newEnum.attributes) {
    newEnum.attributes = [];
  }
  if (moveEnumAttribute.sn === newEnum.attributes.length) {
    return;
  }
  newEnum.attributes?.map((attribute) => {
    const oldSn = attribute.sn;
    if (oldSn === moveEnumAttribute.sn! + 1) {
      attribute.sn = attribute.sn! - 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    if (oldSn === moveEnumAttribute.sn) {
      attribute.sn = attribute.sn! + 1;
      if (attribute.action !== DOStatus.NEW) {
        attribute.action = DOStatus.UPDATED;
      }
    }
    return attribute;
  });
  newEnum.attributes?.sort((a1: TEnumAttribute, a2: TEnumAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.entityCollection.enums = state.entityCollection.enums?.map((ddEnum) => {
    if (ddEnum.idEnum == newEnum.idEnum) {
      ddEnum.attributes = newEnum.attributes;
    }
    return ddEnum;
  });
  //更新图表
  // state.drawCount++;
};
