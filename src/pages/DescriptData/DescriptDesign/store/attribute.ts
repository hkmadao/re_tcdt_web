import { DOStatus } from '@/models/enums';
import { underlineToHump } from '@/util/name-convent';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { EnumDownAssociateType, EnumUpAssociateType } from '../conf';
import {
  TAttribute,
  TCommonAttribute,
  TEntityAssociate,
  TModuleStore,
} from '../models';
import { nanoid } from '@ant-design/pro-components';

/**属性保存 */
export const updateAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TAttribute>
> = (state, action) => {
  const newEntityAttr = action.payload;
  const newEntity = state.entityCollection.entities?.find(
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
  //主属性修改
  if (newEntityAttr.fgPrimaryKey) {
    newEntity.pkAttributeCode = newEntityAttr.columnName;
    newEntity.pkAttributeName = newEntityAttr.displayName;
    newEntity.pkAttributeTypeName = newEntityAttr.attributeTypeName;
    newEntityAttr.fgMandatory = true;
    const newEntityAttrs = newEntity.attributes?.map((entityAttr) => {
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
      //取消其它主属性字段
      if (entityAttr.action !== DOStatus.DELETED && entityAttr.fgPrimaryKey) {
        entityAttr.fgPrimaryKey = false;
        if (entityAttr.action === DOStatus.UNCHANGED) {
          entityAttr.action = DOStatus.UPDATED;
        }
      }
      return entityAttr;
    });
    newEntity.attributes = newEntityAttrs;
  } else {
    const newEntityAttrs = newEntity.attributes?.map((entityAttr) => {
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
    newEntity.attributes = newEntityAttrs;
  }
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.action = newEntity.action;
        entity.attributes = newEntity.attributes;
      }
      return entity;
    },
  );
};

/**设置主属性 */
// export const setAttributePrimaryKey: CaseReducer<
//   TModuleStore,
//   PayloadAction<TAttribute>
// > = (state, action) => {
//   const newEntityAttr = action.payload;
//   state.entityCollection.entities?.find((entity) => {
//     if (entity.idEntity === newEntityAttr.idEntity) {
//       entity.action === DOStatus.UNCHANGED
//         ? (entity.action = DOStatus.UPDATED)
//         : undefined;
//       if (entity.attributes) {
//         entity.attributes.forEach((attribute) => {
//           if (attribute.fgPrimaryKey) {
//             attribute.fgPrimaryKey = false;
//             attribute.action = DOStatus.UPDATED;
//             return;
//           }
//           if (attribute.idAttribute === newEntityAttr.idAttribute) {
//             entity.pkAttributeCode = newEntityAttr.attributeName;
//             entity.pkAttributeName = newEntityAttr.displayName;
//             entity.pkAttributeTypeName = newEntityAttr.attributeTypeName;

//             attribute.fgPrimaryKey = true;
//             attribute.action = DOStatus.UPDATED;
//             return;
//           }
//         });
//       }
//       return true;
//     }
//     return false;
//   });
// };

/**属性类型保存 */
export const updateAttributeType: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const newEntityAttr = action.payload as TAttribute;
  const newEntity = state.entityCollection.entities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idEntity === newEntityAttr.idEntity,
  );
  if (!newEntity) {
    return;
  }
  let fgPrimaryKeyChange: boolean = false;
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newEntity.attributes?.map((entityAttr) => {
    if (entityAttr.idAttribute === newEntityAttr.idAttribute) {
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
  newEntity.attributes = newEntityAttrs;
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.action = newEntity.action;
        entity.attributes = newEntity.attributes;
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
  const newAttributes = action.payload as TAttribute;
  const newEntity = state.entityCollection.entities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEntity === newAttributes.idEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.attributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.attributes) {
    newEntity.attributes = [];
  }
  newEntity.attributes?.push({
    ...newAttributes,
    sn: notDeleteAattributes.length + 1,
    action: DOStatus.NEW,
  });
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.attributes = newEntity.attributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**从公共属性选中添加属性 */
export const addAttributesByCommAttr: CaseReducer<
  TModuleStore,
  PayloadAction<{ idEntity: string; commonAttrs: TCommonAttribute[] }>
> = (state, action) => {
  const { idEntity, commonAttrs } = action.payload;
  //基础属性添加
  const baseCommonAttrs = commonAttrs.filter((ca) => !ca.idRefEntity);
  const newEntity = state.entityCollection.entities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED && ddEnum.idEntity === idEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.attributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.attributes) {
    newEntity.attributes = [];
  }
  const newAttributes = baseCommonAttrs.map((baseCommAttr, index) => {
    let attr: TAttribute = {
      idAttribute: nanoid(),
      action: DOStatus.NEW,
      idEntity: idEntity,
      displayName: baseCommAttr.displayName,
      columnName: baseCommAttr.columnName,
      attributeName: baseCommAttr.attributeName,
      idAttributeType: baseCommAttr.idDataType,
      pcs: baseCommAttr.pcs,
      len: baseCommAttr.len,
      defaultValue: baseCommAttr.defaultValue,
      sn: notDeleteAattributes.length + 1 + index,
    };
    return attr;
  });
  newEntity.attributes = newEntity.attributes.concat(newAttributes);
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.attributes = newEntity.attributes;
      }
      return entity;
    },
  );
  //连线添加
  const assoCommonAttrs = commonAttrs.filter((ca) => ca.idRefEntity);
  const newAssos = assoCommonAttrs.map((assoCommAttr, index) => {
    let asso: TEntityAssociate = {
      idEntityAssociate: nanoid(),
      action: DOStatus.NEW,
      idDown: idEntity,
      idUp: assoCommAttr.idRefEntity,
      fgForeignKey: true,
      fkColumnName: assoCommAttr.columnName,
      fkAttributeName: assoCommAttr.attributeName,
      fkAttributeDisplayName: assoCommAttr.displayName,
      refAttributeName: assoCommAttr.refAttributeName,
      refAttributeDisplayName: assoCommAttr.refDisplayName,
      upAssociateType: EnumUpAssociateType.ZERO_ONE,
      downAssociateType: EnumDownAssociateType.ZERO_TO_MANY,
    };
    return asso;
  });
  state.entityCollection.entityAssociates =
    state.entityCollection.entityAssociates.concat(newAssos);
  //更新图表
  state.drawCount++;
};

/**从表信息生成主键 */
export const addKeyAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<string>
> = (state, action) => {
  const idEntity = action.payload;
  const ddEntity = state.entityCollection.entities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED && ddEnum.idEntity === idEntity,
  );
  if (!ddEntity) {
    return;
  }
  const notDeleteAattributes =
    ddEntity.attributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  ddEntity.action === DOStatus.UNCHANGED
    ? (ddEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!ddEntity.attributes) {
    ddEntity.attributes = [];
  }
  //取消其它主属性字段
  notDeleteAattributes.forEach((attr) => {
    if (attr.action !== DOStatus.DELETED && attr.fgPrimaryKey) {
      attr.fgPrimaryKey = false;
      if (attr.action === DOStatus.UNCHANGED) {
        attr.action = DOStatus.UPDATED;
      }
    }
  });
  const pkAttr: TAttribute = {
    idAttribute: nanoid(),
    idEntity: idEntity,
    sn: notDeleteAattributes.length + 1,
    action: DOStatus.NEW,
    fgPrimaryKey: true,
    fgMandatory: true,
    columnName: 'id_' + ddEntity.tableName,
    attributeName: 'id' + ddEntity.className,
    displayName: ddEntity.displayName + '主属性',
  };
  ddEntity.attributes?.push(pkAttr);
  ddEntity.pkAttributeCode = pkAttr.columnName;
  ddEntity.pkAttributeName = pkAttr.displayName;
  ddEntity.pkAttributeTypeName = pkAttr.attributeTypeName;
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == ddEntity.idEntity) {
        entity.attributes = ddEntity.attributes;
      }
      return entity;
    },
  );
};

/**删除底部属性数据 */
export const deleteAttribute: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const deleteAttribute = action.payload as TAttribute;
  const newEntity = state.entityCollection.entities?.find(
    (ddEnum) =>
      ddEnum.action !== DOStatus.DELETED &&
      ddEnum.idEntity === deleteAttribute.idEntity,
  );
  if (!newEntity) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  let newEntityAttrs = newEntity.attributes?.filter((entityAttr) => {
    if (entityAttr.idAttribute === deleteAttribute.idAttribute) {
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
  newEntity.attributes = newEntityAttrs;
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.action = newEntity.action;
        entity.attributes = newEntity.attributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};

/**底部属性上移 */
export const attrRowUp: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const moveAttribute = action.payload as TAttribute;
  const newEntity = state.entityCollection.entities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idEntity === moveAttribute.idEntity,
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
  if (!newEntity.attributes) {
    newEntity.attributes = [];
  }
  newEntity.attributes?.map((attribute) => {
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
  newEntity.attributes?.sort((a1: TAttribute, a2: TAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.attributes = newEntity.attributes;
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
  const moveAttribute = action.payload as TAttribute;
  const newEntity = state.entityCollection.entities?.find(
    (entity) =>
      entity.action !== DOStatus.DELETED &&
      entity.idEntity === moveAttribute.idEntity,
  );
  if (!newEntity) {
    return;
  }
  const notDeleteAattributes =
    newEntity.attributes?.filter(
      (attribute) => attribute.action !== DOStatus.DELETED,
    ) || [];
  if (moveAttribute.sn === notDeleteAattributes.length) {
    return;
  }
  newEntity.action === DOStatus.UNCHANGED
    ? (newEntity.action = DOStatus.UPDATED)
    : undefined;
  if (!newEntity.attributes) {
    newEntity.attributes = [];
  }
  newEntity.attributes?.map((attribute) => {
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
  newEntity.attributes?.sort((a1: TAttribute, a2: TAttribute) => {
    return a1.sn! - a2.sn!;
  });
  state.entityCollection.entities = state.entityCollection.entities?.map(
    (entity) => {
      if (entity.idEntity == newEntity.idEntity) {
        entity.attributes = newEntity.attributes;
      }
      return entity;
    },
  );
  //更新图表
  // state.drawCount++;
};
