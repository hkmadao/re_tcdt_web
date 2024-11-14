import { DOStatus } from '@/models/enums';
import {
  EnumComponentType,
  EnumConcreteDiagramType,
  moduleName,
} from '../conf';
import { TModuleStore } from '../models';
/**选择模块数据 */
export const selectModuleStore = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName];
};
/**选择状态 */
export const selectModuleStaus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].status;
};
/**选择初始状态标志 */
export const selectFgInit = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].fgInit;
};
/**选择实体集 */
export const selectEntityComponent = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component;
};
/**选择组件类型 */
export const selectComponentType = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component.componentType || EnumComponentType.Single;
};
/**选择显示外部实体标志 */
export const selectFgShowOutEntities = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].fgShowOutEntities;
};
/**选择显示系统接口标志 */
export const selectFgShowSysInterfaces = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].fgShowSysInterfaces;
};
/**选择绘图次数 */
export const selectDrawCount = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].drawCount;
};
/**选择实体 */
export const selectComponentEntities = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component?.componentEntities;
};
/**选择非删除状态实体 */
export const selectNotDeleteCompEntitys = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component?.componentEntities?.filter(
    (entity) => entity.action !== DOStatus.DELETED,
  );
};
/**选择外部实体 */
export const selectOutEntities = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.outEntities;
};
/**选择枚举 */
export const selectComponentEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.componentEnums;
};
/**选择非删除状态枚举 */
export const selectNotDeleteComponentEnums = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component?.componentEnums?.filter(
    (compoentEnum) => compoentEnum.action !== DOStatus.DELETED,
  );
};
/**选择枚举 */
export const selectEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.enums;
};
/**选择外部枚举 */
export const selectOutEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.outEnums;
};
/**选择系统数据类型 */
export const selectSysDataTypes = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.sysDataTypes;
};
/**选择实体连线 */
export const selectEntityAssos = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.componentEntityAssociates;
};
/**选择外键级关系非删除状态实体连线 */
export const selectFKColumnEntityAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    const cEntity = state[moduleName].component?.componentEntities?.find(
      (ce) =>
        ce.action !== DOStatus.DELETED && idElement === ce.idComponentEntity,
    );
    if (cEntity) {
      return state[moduleName].component?.componentEntityAssociates?.filter(
        (cAsso) =>
          cAsso.action !== DOStatus.DELETED &&
          cAsso.entityAssociate?.idDown === cEntity.idEntity &&
          cAsso.entityAssociate?.fkColumnName,
      );
    }
  }
};
/**选择下级关系非删除状态实体连线 */
export const selectDownEntityAssos = (state: { [x: string]: TModuleStore }) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    const cEntity = state[moduleName].component?.componentEntities?.find(
      (ce) =>
        ce.action !== DOStatus.DELETED && idElement === ce.idComponentEntity,
    );
    if (cEntity) {
      return state[moduleName].component?.componentEntityAssociates?.filter(
        (cAsso) =>
          cAsso.action !== DOStatus.DELETED &&
          cAsso.entityAssociate?.idUp === cEntity.idEntity &&
          cAsso.entityAssociate?.fkColumnName,
      );
    }
  }
};
/**选择非删除状态实体连线 */
export const selectNotDeleteEntityAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component?.componentEntityAssociates?.filter(
    (entityAssociate) => entityAssociate.action !== DOStatus.DELETED,
  );
};
/**选择实体枚举连线 */
export const selectEnumAssos = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].component?.enumAssociates;
};
/**选择非删除状态实体枚举连线 */
export const selectNotDeleteEnumAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component?.enumAssociates?.filter(
    (enumAssociate) => enumAssociate.action !== DOStatus.DELETED,
  );
};
/**选择当前选择 */
export const selectCurentSelect = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].currentSelect;
};
/**选择当前选择类型 */
export const selectCurentSelectType = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].currentSelect?.concreteType;
};
/**选择当前选择元素 */
export const selectCurrentDiagramContent = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].currentSelect?.idElement;
};
/**选择当前选择组件实体 */
export const selectCurrentComponentEntity = (state: {
  [x: string]: TModuleStore;
}) => {
  if (
    state[moduleName].currentSelect.concreteType ===
    EnumConcreteDiagramType.ENTITY
  ) {
    return state[moduleName].component.componentEntities?.find(
      (ce) =>
        ce.action !== DOStatus.DELETED &&
        state[moduleName].currentSelect.idElement === ce.idComponentEntity,
    );
  }
};
/**选择图形ui */
export const selectComponentNodeUis = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].component.componentNodeUis;
};
/**选择选中元素 */
export const selectElements = (state: { [x: string]: TModuleStore }) => {
  return {
    selectNodes: state[moduleName].selectNodes,
    selectLines: state[moduleName].selectLines,
  };
};
// /**选择模块ui */
// export const selectModuleUi = (state: { [x: string]: TModuleStore }) => {
//   return state[moduleName].moduleUi;
// };

// /**选择图表ui */
// export const selectDiagramUi = (state: { [x: string]: TModuleStore }) => {
//   return {
//     width: state[moduleName].moduleUi.cWidth,
//     height: state[moduleName].moduleUi.cHeight,
//   };
// };

// /**选择全屏标志 */
// export const selectFgFullscreen = (state: { [x: string]: TModuleStore }) => {
//   return state[moduleName].moduleUi.fgFullscreen;
// };

/**选择关注状态标志 */
export const selectFgFocus = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].focusDrawCount > 0;
};

/**选择关注对象id集合 */
export const selectFocusIds = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].focusIds;
};

/**选择关注状态下图形重绘次数 */
export const selectFocusDrawCount = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].focusDrawCount;
};

// /**选择图表偏移坐标 */
// export const selectDiagramOffset = (state: { [x: string]: TModuleStore }) => {
//   return {
//     offsetX: state[moduleName].moduleUi.offsetX,
//     offsetY: state[moduleName].moduleUi.offsetY,
//   };
// };

/**选择缩放适配画布次数 */
export const selectZoomToFitCount = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].zoomToFitCount;
};

/**选择实体集信息是否改变过 */
export const selectFgChange = (state: { [x: string]: TModuleStore }) => {
  const coll = state[moduleName].component;
  if (coll.action !== DOStatus.UNCHANGED) {
    return true;
  }
  const enti = coll.componentEntities?.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (enti) {
    return true;
  }
  const ddEnum = coll.componentEnums?.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (ddEnum) {
    return true;
  }
  const nodeUi = coll.componentNodeUis?.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (nodeUi) {
    return true;
  }
  const entityAssociate = coll.componentEntityAssociates?.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (entityAssociate) {
    return true;
  }
  return false;
};

/**选择模块ui */
export const selectModuleUi = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].moduleUi;
};

/**选择图表ui */
export const selectDiagramUi = (state: { [x: string]: TModuleStore }) => {
  return {
    width: state[moduleName].moduleUi.cWidth,
    height: state[moduleName].moduleUi.cHeight,
  };
};

/**选择图表偏移坐标 */
export const selectDiagramOffset = (state: { [x: string]: TModuleStore }) => {
  return {
    offsetX: state[moduleName].moduleUi.offsetX,
    offsetY: state[moduleName].moduleUi.offsetY,
  };
};
