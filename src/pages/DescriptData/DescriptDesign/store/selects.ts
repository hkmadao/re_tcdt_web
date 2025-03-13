import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType, moduleName } from '../conf';
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
/**选择添加元素状态标志 */
export const selectAddElementStatus = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].addElementStatus;
};
/**选择连线标志 */
export const selectConnectionMode = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].connectionMode;
};
/**选择实体集 */
export const selectEntityCollection = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].entityCollection;
};
/**选择显示外部实体标志 */
export const selectFgShowOutEntities = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].fgShowOutEntities;
};
/**选择显示枚举连线 */
export const selectFgShowEnumAsso = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].fgShowEnumAsso;
};
/**选择显示系统引用连线 */
export const selectFgShowSysRefAsso = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].fgShowSysRefAsso;
};
/**选择绘图次数 */
export const selectDrawCount = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].drawCount;
};
/**选择实体 */
export const selectEntitys = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.entities;
};
/**选择非删除状态实体 */
export const selectNotDeleteEntities = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].entityCollection?.entities?.filter(
    (entity) => entity.action !== DOStatus.DELETED,
  );
};
/**选择外部实体 */
export const selectOutEntities = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.outEntities;
};
/**选择枚举 */
export const selectEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.enums;
};
/**选择非删除状态枚举 */
export const selectNotDeleteEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.enums?.filter(
    (ddEnum) => ddEnum.action !== DOStatus.DELETED,
  );
};
/**选择外部枚举 */
export const selectOutEnums = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.outEnums;
};
/**选择系统数据类型 */
export const selectSysDataTypes = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.sysDataTypes;
};
/**选择系统公共字段 */
export const selectSysCommonAttributes = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].entityCollection?.commonAttributes;
};
/**选择实体连线 */
export const selectEntityAssos = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.entityAssociates;
};
/**选择非删除状态实体连线 */
export const selectNotDeleteEntityAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].entityCollection?.entityAssociates?.filter(
    (entityAssociate) => entityAssociate.action !== DOStatus.DELETED,
  );
};
/**选择下级关系非删除状态实体连线 */
export const selectDownEntityAssos = (state: { [x: string]: TModuleStore }) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection?.entityAssociates?.filter(
      (entityAssociate) =>
        entityAssociate.action !== DOStatus.DELETED &&
        entityAssociate.idUp === idElement &&
        entityAssociate.downAttributeName,
    );
  }
};
/**选择上级级关系非删除状态实体连线 */
export const selectUpEntityAssos = (state: { [x: string]: TModuleStore }) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection?.entityAssociates?.filter(
      (entityAssociate) =>
        entityAssociate.action !== DOStatus.DELETED &&
        entityAssociate.idDown === idElement &&
        entityAssociate.refAttributeName,
    );
  }
};
/**选择外键级关系非删除状态实体连线 */
export const selectFKColumnEntityAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection?.entityAssociates?.filter(
      (entityAssociate) =>
        entityAssociate.action !== DOStatus.DELETED &&
        entityAssociate.idDown === idElement &&
        entityAssociate.fkColumnName,
    );
  }
};
/**选择实体枚举连线 */
export const selectEnumAssos = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection?.enumAssociates;
};
/**选择非删除状态实体枚举连线 */
export const selectNotDeleteEnumAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  return state[moduleName].entityCollection?.enumAssociates?.filter(
    (enumAssociate) => enumAssociate.action !== DOStatus.DELETED,
  );
};
/**选择当前实体的枚举关系非删除状态枚举连线 */
export const selectNotCurrentEnumAssos = (state: {
  [x: string]: TModuleStore;
}) => {
  const concreteType = state[moduleName].currentSelect.concreteType;
  if (concreteType === EnumConcreteDiagramType.ENTITY) {
    const idElement = state[moduleName].currentSelect.idElement;
    return state[moduleName].entityCollection?.enumAssociates?.filter(
      (entityAssociate) =>
        entityAssociate.action !== DOStatus.DELETED &&
        entityAssociate.idEntity === idElement,
    );
  }
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
/**选择图形ui */
export const selectNodeUis = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].entityCollection.nodeUis;
};
/**选择选中元素 */
export const selectElements = (state: { [x: string]: TModuleStore }) => {
  return {
    selectNodes: state[moduleName].selectNodes,
    selectLines: state[moduleName].selectLines,
  };
};

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

/**选择缩放适配画布次数 */
export const selectZoomToFitCount = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].zoomToFitCount;
};

/**选择实体集信息是否改变过 */
export const selectFgChange = (state: { [x: string]: TModuleStore }) => {
  const coll = state[moduleName].entityCollection;
  if (coll.action !== DOStatus.UNCHANGED) {
    return true;
  }
  const enti = coll.entities.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (enti) {
    return true;
  }
  const ddEnum = coll.enums.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (ddEnum) {
    return true;
  }
  const nodeUi = coll.nodeUis.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (nodeUi) {
    return true;
  }
  const entityAssociate = coll.entityAssociates.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (entityAssociate) {
    return true;
  }
  const enumAssociate = coll.enumAssociates.find(
    (entity) => entity.action !== DOStatus.UNCHANGED,
  );
  if (enumAssociate) {
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
  return state[moduleName].diagramUi;
};

/**选择图表偏移坐标 */
export const selectDiagramOffset = (state: { [x: string]: TModuleStore }) => {
  return {
    offsetX: state[moduleName].diagramUi.offsetX,
    offsetY: state[moduleName].diagramUi.offsetY,
  };
};

/**选择长宽 */
export const selectBorderWH = (state: { [x: string]: TModuleStore }) => {
  return {
    width: state[moduleName].moduleUi.cWidth,
    height: state[moduleName].moduleUi.cHeight,
  };
};

/**选择图表ui */
export const selectDigramUi = (state: { [x: string]: TModuleStore }) => {
  return state[moduleName].diagramUi;
};
