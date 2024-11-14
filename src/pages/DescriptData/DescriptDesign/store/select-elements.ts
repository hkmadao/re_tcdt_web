import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import {
  TConcreteDiagram,
  TEntityAssociate,
  TEnumAssociate,
  TModuleStore,
  TNodeUi,
} from '../models';

export const setSelectElement: CaseReducer<
  TModuleStore,
  PayloadAction<{
    /**选中的节点 */
    selectNodes: TConcreteDiagram[];
    /**选中的连线 */
    selectLines: (TConcreteDiagram & {
      idEntityCollection?: string;
      sourceId?: string;
      targetId?: string;
    })[];
    /**图形的ui */
    nodeUis: TNodeUi[];
  }>
> = (state, action) => {
  if (!state.entityCollection.idEntityCollection) {
    return;
  }
  const { selectNodes, selectLines, nodeUis } = action.payload;
  //判断是否加入新连线
  const newLine = selectLines.find((line) => {
    return !line.idElement && line.targetId;
  });
  if (newLine) {
    const lineType = newLine.concreteType;
    const idElementNew = nanoid();
    if (lineType === EnumConcreteDiagramType.ASSOLINK) {
      const findAssos =
        state.entityCollection.entityAssociates?.filter((oldAsso) => {
          return (
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idUp === newLine.targetId &&
            oldAsso.idDown === newLine.sourceId
          );
        }) || [];
      const asso: TEntityAssociate = {
        idEntityCollection: newLine.idEntityCollection,
        idUp: newLine.targetId,
        idDown: newLine.sourceId,
        idEntityAssociate: idElementNew,
        action: DOStatus.NEW,
      };
      findAssos.push(asso);
      //为连线生成序列号
      findAssos.forEach((findAsso, index) => (findAsso.groupOrder = index));
      const unChangeAssos =
        state.entityCollection.entityAssociates?.filter((oldAsso) => {
          return !(
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idUp === newLine.targetId &&
            oldAsso.idDown === newLine.sourceId
          );
        }) || [];
      state.entityCollection.entityAssociates = unChangeAssos.concat(findAssos);
    }

    if (lineType === EnumConcreteDiagramType.ENUMASSOLINK) {
      const findAssos =
        state.entityCollection.enumAssociates?.filter((oldAsso) => {
          return (
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idEnum === newLine.targetId &&
            oldAsso.idEntity === newLine.sourceId
          );
        }) || [];
      const asso: TEnumAssociate = {
        idEntityCollection: newLine.idEntityCollection,
        idEnum: newLine.targetId,
        idEntity: newLine.sourceId,
        idEnumAssociate: idElementNew,
        action: DOStatus.NEW,
      };
      findAssos.push(asso);
      //为连线生成序列号
      findAssos.forEach((findAsso, index) => (findAsso.groupOrder = index));
      const unChangeAssos =
        state.entityCollection.enumAssociates?.filter((oldAsso) => {
          return !(
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idEnum === newLine.targetId &&
            oldAsso.idEntity === newLine.sourceId
          );
        }) || [];
      state.entityCollection.enumAssociates = unChangeAssos.concat(findAssos);
    }

    //新增连线需要刷新图形，为连线赋值属性
    let newNodeUis: TNodeUi[] = nodeUis;
    state.entityCollection!.nodeUis = state.entityCollection?.nodeUis?.map(
      (nodeUi) => {
        for (let i = 0; i < newNodeUis.length; i++) {
          if (nodeUi.idNodeUi === newNodeUis[i].idNodeUi) {
            nodeUi = { ...newNodeUis[i] };
            break;
          }
        }
        return nodeUi;
      },
    );
    state.selectNodes = [];
    state.currentSelect = {
      concreteType: lineType,
      idElement: idElementNew,
    };
    state.selectLines = [state.currentSelect];
    //更新图表
    state.drawCount++;
    return;
  }

  //多选的数据用于删除
  state.selectNodes = selectNodes;
  state.selectLines = selectLines;
  //单选
  if (selectLines.length + selectNodes.length === 1) {
    if (selectLines.length === 1) {
      state.currentSelect = {
        ...selectLines[0],
      };
    } else {
      state.currentSelect = {
        ...selectNodes[0],
      };
    }
    return;
  }

  //多选
  state.currentSelect = {
    concreteType: EnumConcreteDiagramType.PANEL,
  };
};

export const deleteSelectElement: CaseReducer<
  TModuleStore,
  PayloadAction<void>
> = (state, action) => {
  //删除选中连线
  state.selectLines?.forEach((concreteDiagram) => {
    const idElement = concreteDiagram.idElement;
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ASSOLINK) {
      const deleteAsso = state.entityCollection.entityAssociates?.find(
        (asso) =>
          asso.action !== DOStatus.DELETED &&
          idElement === asso.idEntityAssociate,
      );
      state.entityCollection!.entityAssociates =
        state.entityCollection?.entityAssociates?.filter((entityAsso) => {
          if (entityAsso.idEntityAssociate === deleteAsso?.idEntityAssociate) {
            if (entityAsso.action === DOStatus.NEW) {
              return false;
            }
            entityAsso.action = DOStatus.DELETED;
          }
          return true;
        });
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUMASSOLINK) {
      const deleteAsso = state.entityCollection.enumAssociates?.find(
        (asso) =>
          asso.action !== DOStatus.DELETED &&
          idElement === asso.idEnumAssociate,
      );
      state.entityCollection!.enumAssociates =
        state.entityCollection?.enumAssociates?.filter((entityAsso) => {
          if (entityAsso.idEnumAssociate === deleteAsso?.idEnumAssociate) {
            if (entityAsso.action === DOStatus.NEW) {
              return false;
            }
            entityAsso.action = DOStatus.DELETED;
          }
          return true;
        });
    }
  });
  //删除选中节点
  state.selectNodes?.forEach((concreteDiagram) => {
    const idElement = concreteDiagram.idElement;
    //删除连线
    state.entityCollection!.entityAssociates =
      state.entityCollection?.entityAssociates?.filter((entityAsso) => {
        if (entityAsso.idUp === idElement || entityAsso.idDown === idElement) {
          //没有保存过的数据直接删除
          if (entityAsso.action === DOStatus.NEW) {
            return;
          }
          entityAsso.action = DOStatus.DELETED;
        }
        return true;
      });
    state.entityCollection!.enumAssociates =
      state.entityCollection?.enumAssociates?.filter((enumAsso) => {
        if (enumAsso.idEntity === idElement || enumAsso.idEnum === idElement) {
          //没有保存过的数据直接删除
          if (enumAsso.action === DOStatus.NEW) {
            return;
          }
          enumAsso.action = DOStatus.DELETED;
        }
        return true;
      });
    //删除ui
    state.entityCollection!.nodeUis = state.entityCollection?.nodeUis?.filter(
      (nodeUi) => {
        if (nodeUi.idElement === idElement) {
          //没有保存过的数据直接删除
          if (nodeUi.action === DOStatus.NEW) {
            return false;
          }
          nodeUi.action = DOStatus.DELETED;
        }
        return true;
      },
    );
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.OUT_ENTITY) {
      //删除外部实体
      state.entityCollection!.outEntities =
        state.entityCollection?.outEntities?.filter((entity) => {
          if (entity.idEntity === idElement) {
            return false;
          }
          return true;
        });
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENTITY) {
      //删除实体
      state.entityCollection!.entities =
        state.entityCollection?.entities?.filter((entity) => {
          if (entity.idEntity === idElement) {
            //没有保存过的数据直接删除
            if (entity.action === DOStatus.NEW) {
              return false;
            }
            entity.attributes = entity.attributes?.filter((attribute) => {
              if (attribute.action === DOStatus.NEW) {
                return false;
              }
              attribute.action = DOStatus.DELETED;
              return true;
            });
            entity.action = DOStatus.DELETED;
          }
          return true;
        });
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUM) {
      //删除枚举
      state.entityCollection!.enums = state.entityCollection?.enums?.filter(
        (ddEnum) => {
          if (ddEnum.idEnum === idElement) {
            //没有保存过的数据直接删除
            if (ddEnum.action === DOStatus.NEW) {
              return false;
            }
            ddEnum.attributes = ddEnum.attributes?.filter((attribute) => {
              if (attribute.action === DOStatus.NEW) {
                return false;
              }
              attribute.action = DOStatus.DELETED;
              return true;
            });
            ddEnum.action = DOStatus.DELETED;
          }
          return true;
        },
      );
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.OUT_ENUM) {
      //删除外部枚举
      state.entityCollection!.outEnums =
        state.entityCollection?.outEnums?.filter((outEnum) => {
          if (outEnum.idEnum === idElement) {
            return false;
          }
          return true;
        });
    }
  });
  //更新图表
  state.drawCount++;
};

export const cleanAllElement: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  //删除实体
  state.entityCollection!.entities = state.entityCollection?.entities?.filter(
    (entity) => {
      //没有保存过的数据直接删除
      if (entity.action === DOStatus.NEW) {
        return false;
      }
      entity.attributes = entity.attributes?.filter((attribute) => {
        if (attribute.action === DOStatus.NEW) {
          return false;
        }
        attribute.action = DOStatus.DELETED;
        return true;
      });
      entity.action = DOStatus.DELETED;
      return true;
    },
  );
  state.entityCollection!.enums = state.entityCollection?.enums?.filter(
    (ddEnum) => {
      //没有保存过的数据直接删除
      if (ddEnum.action === DOStatus.NEW) {
        return false;
      }
      ddEnum.attributes = ddEnum.attributes?.filter((attribute) => {
        if (attribute.action === DOStatus.NEW) {
          return false;
        }
        attribute.action = DOStatus.DELETED;
        return true;
      });
      ddEnum.action = DOStatus.DELETED;
      return true;
    },
  );

  state.entityCollection!.nodeUis = state.entityCollection?.nodeUis?.filter(
    (nodeUi) => {
      //没有保存过的数据直接删除
      if (nodeUi.action === DOStatus.NEW) {
        return false;
      }
      nodeUi.action = DOStatus.DELETED;
      return true;
    },
  );
  //删除连线
  state.entityCollection!.entityAssociates =
    state.entityCollection?.entityAssociates?.filter((entityAsso) => {
      //没有保存过的数据直接删除
      if (entityAsso.action === DOStatus.NEW) {
        return;
      }
      entityAsso.action = DOStatus.DELETED;
      return true;
    });
  state.entityCollection!.enumAssociates =
    state.entityCollection?.enumAssociates?.filter((enumAsso) => {
      //没有保存过的数据直接删除
      if (enumAsso.action === DOStatus.NEW) {
        return;
      }
      enumAsso.action = DOStatus.DELETED;
      return true;
    });

  //更新图表
  state.drawCount++;
};
