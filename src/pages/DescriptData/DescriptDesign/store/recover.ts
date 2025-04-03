import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import {
  TAttribute,
  TEntity,
  TEntityAssociate,
  TEnum,
  TEnumAssociate,
  TEnumAttribute,
  TModuleStore,
} from '../models';

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

/**恢复删除的属性数据 */
export const recoverEnumAttributes: CaseReducer<
  TModuleStore,
  PayloadAction<TEnumAttribute[]>
> = (state, action) => {
  const toRecoverData = action.payload;
  if (toRecoverData.length === 0) {
    return;
  }
  const idEnum = toRecoverData[0].idEnum;
  const newEnum = state.entityCollection.enums?.find(
    (entity) => entity.idEnum === idEnum,
  );
  if (!newEnum) {
    return;
  }
  const recoverIds = toRecoverData.map((attr) => attr.idEnumAttribute!);
  const toRecoverAttrs =
    newEnum.attributes?.filter((attr) =>
      recoverIds.includes(attr.idEnumAttribute!),
    ) || [];
  const notDeleteAttrCount =
    newEnum.attributes?.filter((attr) => attr.action !== DOStatus.DELETED)
      .length || 0;

  toRecoverAttrs.forEach((attr, index) => {
    attr.action = DOStatus.UPDATED;
    attr.sn = notDeleteAttrCount + index + 1;
  });
  const newAttrs =
    newEnum.attributes?.filter(
      (attr) => !recoverIds.includes(attr.idEnumAttribute!),
    ) || [];
  newAttrs.push(...toRecoverAttrs);
  newAttrs?.sort((a1, a2) => {
    return a1.sn! - a2.sn!;
  });
  newEnum.attributes = newAttrs;

  if (newEnum.action === DOStatus.DELETED) {
    newEnum.action = DOStatus.UPDATED;
    state.entityCollection.enums = state.entityCollection.enums?.map(
      (entity) => {
        if (entity.idEnum === newEnum.idEnum) {
          return newEnum;
        }
        return entity;
      },
    );
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === idEnum) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    //更新图表
    state.drawCount++;
  } else {
    state.entityCollection.enums = state.entityCollection.enums?.map(
      (entity) => {
        if (entity.idEnum === newEnum.idEnum) {
          return newEnum;
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

/**恢复删除的枚举数据 */
export const recoverEnum: CaseReducer<TModuleStore, PayloadAction<TEnum>> = (
  state,
  action,
) => {
  const idEnum = action.payload.idEnum;
  const newEnum = state.entityCollection.enums?.find(
    (entity) => entity.idEnum === idEnum,
  );
  if (!newEnum) {
    return;
  }
  newEnum.action = DOStatus.UPDATED;
  state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
    (nodeUi) => {
      if (nodeUi.idElement === idEnum) {
        nodeUi.action = DOStatus.UPDATED;
      }
      return nodeUi;
    },
  );
  newEnum.attributes?.forEach((attr, index) => {
    attr.action = DOStatus.UPDATED;
    attr.sn = index + 1;
  });
  state.entityCollection.enums = state.entityCollection.enums?.map((entity) => {
    if (entity.idEnum === newEnum.idEnum) {
      return newEnum;
    }
    return entity;
  });
  //更新图表
  state.drawCount++;
};

/**恢复删除的实体连线数据 */
export const recoverEntityAsso: CaseReducer<
  TModuleStore,
  PayloadAction<TEntityAssociate>
> = (state, action) => {
  const idEntityAssociate = action.payload.idEntityAssociate;
  const newEntityAssociate = state.entityCollection.entityAssociates?.find(
    (asso) => asso.idEntityAssociate === idEntityAssociate,
  );
  if (!newEntityAssociate) {
    return;
  }
  newEntityAssociate.action = DOStatus.UPDATED;
  state.entityCollection.entityAssociates =
    state.entityCollection.entityAssociates?.map((asso) => {
      if (asso.idEntityAssociate === newEntityAssociate.idEntityAssociate) {
        return newEntityAssociate;
      }
      return asso;
    });
  //恢复上级实体
  const upEntityId = newEntityAssociate.idUp!;
  const upEntity = state.entityCollection.entities?.find(
    (entity) => entity.idEntity === upEntityId,
  );
  if (upEntity && upEntity.action === DOStatus.DELETED) {
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === upEntityId) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    upEntity.attributes?.forEach((attr, index) => {
      attr.action = DOStatus.UPDATED;
      attr.sn = index + 1;
    });
    state.entityCollection.entities = state.entityCollection.entities?.map(
      (entity) => {
        if (entity.idEntity === upEntity.idEntity) {
          return { ...upEntity, action: DOStatus.UPDATED };
        }
        return entity;
      },
    );
  }
  //恢复下级实体
  const downEntityId = newEntityAssociate.idDown!;
  const downEntity = state.entityCollection.entities?.find(
    (entity) => entity.idEntity === downEntityId,
  );
  if (downEntity && downEntity.action === DOStatus.DELETED) {
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === downEntityId) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    downEntity.attributes?.forEach((attr, index) => {
      attr.action = DOStatus.UPDATED;
      attr.sn = index + 1;
    });
    state.entityCollection.entities = state.entityCollection.entities?.map(
      (entity) => {
        if (entity.idEntity === downEntity.idEntity) {
          return { ...downEntity, action: DOStatus.UPDATED };
        }
        return entity;
      },
    );
  }
  //更新图表
  state.drawCount++;
};

/**恢复删除的枚举连线数据 */
export const recoverEnumAsso: CaseReducer<
  TModuleStore,
  PayloadAction<TEnumAssociate>
> = (state, action) => {
  const idEnumAssociate = action.payload.idEnumAssociate;
  const newEntityAssociate = state.entityCollection.enumAssociates?.find(
    (asso) => asso.idEnumAssociate === idEnumAssociate,
  );
  if (!newEntityAssociate) {
    return;
  }
  newEntityAssociate.action = DOStatus.UPDATED;
  state.entityCollection.enumAssociates =
    state.entityCollection.enumAssociates?.map((asso) => {
      if (asso.idEnumAssociate === newEntityAssociate.idEnumAssociate) {
        return newEntityAssociate;
      }
      return asso;
    });
  //恢复实体
  const entityId = newEntityAssociate.idEntity!;
  const entity = state.entityCollection.entities?.find(
    (entity) => entity.idEntity === entityId,
  );
  if (entity && entity.action === DOStatus.DELETED) {
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === entityId) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    entity.attributes?.forEach((attr, index) => {
      attr.action = DOStatus.UPDATED;
      attr.sn = index + 1;
    });
    state.entityCollection.entities = state.entityCollection.entities?.map(
      (entity) => {
        if (entity.idEntity === entity.idEntity) {
          return { ...entity, action: DOStatus.UPDATED };
        }
        return entity;
      },
    );
  }
  //恢复下级实体
  const ddEnumId = newEntityAssociate.idEnum!;
  const ddEnum = state.entityCollection.enums?.find(
    (entity) => entity.idEnum === ddEnumId,
  );
  if (ddEnum && ddEnum.action === DOStatus.DELETED) {
    state.entityCollection.nodeUis = state.entityCollection.nodeUis?.map(
      (nodeUi) => {
        if (nodeUi.idElement === ddEnumId) {
          nodeUi.action = DOStatus.UPDATED;
        }
        return nodeUi;
      },
    );
    ddEnum.attributes?.forEach((attr, index) => {
      attr.action = DOStatus.UPDATED;
      attr.sn = index + 1;
    });
    state.entityCollection.enums = state.entityCollection.enums?.map(
      (entity) => {
        if (entity.idEnum === ddEnum.idEnum) {
          return { ...ddEnum, action: DOStatus.UPDATED };
        }
        return entity;
      },
    );
  }
  //更新图表
  state.drawCount++;
};
