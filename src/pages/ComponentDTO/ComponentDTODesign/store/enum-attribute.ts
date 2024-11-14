import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TDtoEnumAttribute, TModuleStore } from '../models';

/**枚举属性保存 */
export const updateEnumAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEnumAttribute = action.payload as TDtoEnumAttribute;
  const newEnum = state.dtoCollection.dtoEnums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEnum === newEnumAttribute.idDtoEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEnum.dtoEnumAttributes?.map((enumAttribute) => {
    if (
      enumAttribute.idDtoEnumAttribute === newEnumAttribute.idDtoEnumAttribute
    ) {
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
  newEnum.dtoEnumAttributes = newEntityAttrs;
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((entity) => {
    if (entity.idDtoEnum == newEnum.idDtoEnum) {
      entity.action = newEnum.action;
      entity.dtoEnumAttributes = newEnum.dtoEnumAttributes;
    }
    return entity;
  });
};

/**枚举属性新增 */
export const addEnumAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEnumAttribute = action.payload as TDtoEnumAttribute;
  const newEnum = state.dtoCollection.dtoEnums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEnum === newEnumAttribute.idDtoEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  if (!newEnum.dtoEnumAttributes) {
    newEnum.dtoEnumAttributes = [];
  }
  newEnum.dtoEnumAttributes?.push({
    ...action.payload,
    sn: newEnum.dtoEnumAttributes.length + 1,
    action: DOStatus.NEW,
  });
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((entity) => {
    if (entity.idDtoEnum == newEnum.idDtoEnum) {
      entity.dtoEnumAttributes = newEnum.dtoEnumAttributes;
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
  const deleteEnumAttribute = action.payload as TDtoEnumAttribute;
  const newEnum = state.dtoCollection.dtoEnums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEnum === deleteEnumAttribute.idDtoEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  let newEntityAttrs = newEnum.dtoEnumAttributes?.filter((enumAttribute) => {
    if (enumAttribute.idDtoEnum === deleteEnumAttribute.idDtoEnum) {
      if (
        deleteEnumAttribute.idDtoEnumAttribute ===
        enumAttribute.idDtoEnumAttribute
      ) {
        //没有保存过的数据直接删除
        if (enumAttribute.action === DOStatus.NEW) {
          return false;
        }
        enumAttribute.action = DOStatus.DELETED;
      }
    }
    return true;
  });
  newEnum.dtoEnumAttributes = newEntityAttrs;
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((ddEnum) => {
    if (ddEnum.idDtoEnum == newEnum.idDtoEnum) {
      ddEnum.action = newEnum.action;
      ddEnum.dtoEnumAttributes = newEnum.dtoEnumAttributes;
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
  const moveEnumAttribute = action.payload as TDtoEnumAttribute;
  const newEnum = state.dtoCollection.dtoEnums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEnum === moveEnumAttribute.idDtoEnum,
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
  if (!newEnum.dtoEnumAttributes) {
    newEnum.dtoEnumAttributes = [];
  }
  newEnum.dtoEnumAttributes?.map((attribute) => {
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
  newEnum.dtoEnumAttributes?.sort(
    (a1: TDtoEnumAttribute, a2: TDtoEnumAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((ddEnum) => {
    if (ddEnum.idDtoEnum == newEnum.idDtoEnum) {
      ddEnum.dtoEnumAttributes = newEnum.dtoEnumAttributes;
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
  const moveEnumAttribute = action.payload as TDtoEnumAttribute;
  const newEnum = state.dtoCollection.dtoEnums?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idDtoEnum === moveEnumAttribute.idDtoEnum,
  );
  if (!newEnum) {
    return;
  }
  if (moveEnumAttribute.sn === newEnum.dtoEnumAttributes?.length) {
    return;
  }
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  if (!newEnum.dtoEnumAttributes) {
    newEnum.dtoEnumAttributes = [];
  }
  if (moveEnumAttribute.sn === newEnum.dtoEnumAttributes.length) {
    return;
  }
  newEnum.dtoEnumAttributes?.map((attribute) => {
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
  newEnum.dtoEnumAttributes?.sort(
    (a1: TDtoEnumAttribute, a2: TDtoEnumAttribute) => {
      return a1.sn! - a2.sn!;
    },
  );
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((ddEnum) => {
    if (ddEnum.idDtoEnum == newEnum.idDtoEnum) {
      ddEnum.dtoEnumAttributes = newEnum.dtoEnumAttributes;
    }
    return ddEnum;
  });
  //更新图表
  // state.drawCount++;
};
