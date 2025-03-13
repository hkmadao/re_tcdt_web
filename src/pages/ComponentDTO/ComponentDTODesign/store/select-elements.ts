import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import {
  TConcreteDiagram,
  TDtoEntityAssociate,
  TDtoEnumAssociate,
  TModuleStore,
  TDtoNodeUi,
} from '../models';

export const setSelectElement: CaseReducer<
  TModuleStore,
  PayloadAction<{
    /**选中的节点 */
    selectNodes: TConcreteDiagram[];
    /**选中的连线 */
    selectLines: (TConcreteDiagram & {
      idDtoEntityCollection?: string;
      sourceId?: string;
      targetId?: string;
    })[];
    /**图形的ui */
    nodeUis: TDtoNodeUi[];
  }>
> = (state, action) => {
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
        state.dtoCollection.deAssociates?.filter((oldAsso) => {
          return (
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idUp === newLine.targetId &&
            oldAsso.idDown === newLine.sourceId
          );
        }) || [];
      const asso: TDtoEntityAssociate = {
        idDtoEntityCollection: newLine.idDtoEntityCollection,
        idUp: newLine.targetId,
        idDown: newLine.sourceId,
        idDtoEntityAssociate: idElementNew,
        action: DOStatus.NEW,
        fgSysRef: false,
      };
      findAssos.push(asso);
      //为连线生成序列号
      findAssos.forEach((findAsso, index) => (findAsso.groupOrder = index));
      const unChangeAssos =
        state.dtoCollection.deAssociates?.filter((oldAsso) => {
          return !(
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idUp === newLine.targetId &&
            oldAsso.idDown === newLine.sourceId
          );
        }) || [];
      state.dtoCollection.deAssociates = unChangeAssos.concat(findAssos);
    }

    if (lineType === EnumConcreteDiagramType.ENUMASSOLINK) {
      const findAssos =
        state.dtoCollection.dtoEnumAssociates?.filter((oldAsso) => {
          return (
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idDtoEnum === newLine.targetId &&
            oldAsso.idDtoEntity === newLine.sourceId
          );
        }) || [];
      const asso: TDtoEnumAssociate = {
        idDtoEntityCollection: newLine.idDtoEntityCollection,
        idDtoEnum: newLine.targetId,
        idDtoEntity: newLine.sourceId,
        idDtoEnumAssociate: idElementNew,
        action: DOStatus.NEW,
      };
      findAssos.push(asso);
      //为连线生成序列号
      findAssos.forEach((findAsso, index) => (findAsso.groupOrder = index));
      const unChangeAssos =
        state.dtoCollection.dtoEnumAssociates?.filter((oldAsso) => {
          return !(
            oldAsso.action !== DOStatus.DELETED &&
            oldAsso.idDtoEnum === newLine.targetId &&
            oldAsso.idDtoEntity === newLine.sourceId
          );
        }) || [];
      state.dtoCollection.dtoEnumAssociates = unChangeAssos.concat(findAssos);
    }

    //新增连线需要刷新图形，为连线赋值属性
    let newNodeUis: TDtoNodeUi[] = nodeUis;
    state.dtoCollection!.dtoNodeUis = state.dtoCollection?.dtoNodeUis?.map(
      (nodeUi) => {
        for (let i = 0; i < newNodeUis.length; i++) {
          if (nodeUi.idDtoNodeUi === newNodeUis[i].idDtoNodeUi) {
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
      const deleteAsso = state.dtoCollection.deAssociates?.find(
        (asso) =>
          asso.action !== DOStatus.DELETED &&
          idElement === asso.idDtoEntityAssociate,
      );
      state.dtoCollection!.deAssociates =
        state.dtoCollection?.deAssociates?.filter((entityAsso) => {
          if (
            entityAsso.idDtoEntityAssociate === deleteAsso?.idDtoEntityAssociate
          ) {
            if (entityAsso.action === DOStatus.NEW) {
              return false;
            }
            entityAsso.action = DOStatus.DELETED;
          }
          return true;
        });
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUMASSOLINK) {
      const deleteAsso = state.dtoCollection.dtoEnumAssociates?.find(
        (asso) =>
          asso.action !== DOStatus.DELETED &&
          idElement === asso.idDtoEnumAssociate,
      );
      state.dtoCollection!.dtoEnumAssociates =
        state.dtoCollection?.dtoEnumAssociates?.filter((entityAsso) => {
          if (
            entityAsso.idDtoEnumAssociate === deleteAsso?.idDtoEnumAssociate
          ) {
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
    state.dtoCollection!.deAssociates =
      state.dtoCollection?.deAssociates?.filter((entityAsso) => {
        if (entityAsso.idUp === idElement || entityAsso.idDown === idElement) {
          //没有保存过的数据直接删除
          if (entityAsso.action === DOStatus.NEW) {
            return;
          }
          entityAsso.action = DOStatus.DELETED;
        }
        return true;
      });
    state.dtoCollection!.dtoEnumAssociates =
      state.dtoCollection?.dtoEnumAssociates?.filter((enumAsso) => {
        if (
          enumAsso.idDtoEntity === idElement ||
          enumAsso.idDtoEnum === idElement
        ) {
          //没有保存过的数据直接删除
          if (enumAsso.action === DOStatus.NEW) {
            return;
          }
          enumAsso.action = DOStatus.DELETED;
        }
        return true;
      });
    //删除ui
    state.dtoCollection!.dtoNodeUis = state.dtoCollection?.dtoNodeUis?.filter(
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
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENTITY) {
      //删除的是主实体，主实体配置id置空
      if (state.dtoCollection.idMainDtoEntity === idElement) {
        state.dtoCollection.idMainDtoEntity = undefined;
      }
      //删除实体
      state.dtoCollection!.dtoEntities =
        state.dtoCollection?.dtoEntities?.filter((entity) => {
          if (entity.idDtoEntity === idElement) {
            //没有保存过的数据直接删除
            if (entity.action === DOStatus.NEW) {
              return false;
            }
            entity.deAttributes = entity.deAttributes?.filter((attribute) => {
              if (attribute.action === DOStatus.NEW) {
                return false;
              }
              attribute.action = DOStatus.DELETED;
              return true;
            });
            entity.dcAttributes = entity.dcAttributes?.filter((dcAttribute) => {
              if (dcAttribute.action === DOStatus.NEW) {
                return false;
              }
              dcAttribute.action = DOStatus.DELETED;
              return true;
            });
            entity.action = DOStatus.DELETED;
          }
          return true;
        });
    }
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUM) {
      //删除枚举
      state.dtoCollection!.dtoEnums = state.dtoCollection?.dtoEnums?.filter(
        (ddEnum) => {
          if (ddEnum.idDtoEnum === idElement) {
            //没有保存过的数据直接删除
            if (ddEnum.action === DOStatus.NEW) {
              return false;
            }
            ddEnum.dtoEnumAttributes = ddEnum.dtoEnumAttributes?.filter(
              (attribute) => {
                if (attribute.action === DOStatus.NEW) {
                  return false;
                }
                attribute.action = DOStatus.DELETED;
                return true;
              },
            );
            ddEnum.action = DOStatus.DELETED;
          }
          return true;
        },
      );
    }
  });
  //更新图表
  state.drawCount++;
};

export const cleanAllElement: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.dtoCollection.idMainDtoEntity = undefined;
  //删除实体
  state.dtoCollection!.dtoEntities = state.dtoCollection?.dtoEntities?.filter(
    (entity) => {
      //没有保存过的数据直接删除
      if (entity.action === DOStatus.NEW) {
        return false;
      }
      entity.deAttributes = entity.deAttributes?.filter((attribute) => {
        if (attribute.action === DOStatus.NEW) {
          return false;
        }
        attribute.action = DOStatus.DELETED;
        return true;
      });
      entity.dcAttributes = entity.dcAttributes?.filter((dcAttribute) => {
        if (dcAttribute.action === DOStatus.NEW) {
          return false;
        }
        dcAttribute.action = DOStatus.DELETED;
        return true;
      });
      entity.action = DOStatus.DELETED;
      return true;
    },
  );
  state.dtoCollection!.dtoEnums = state.dtoCollection?.dtoEnums?.filter(
    (ddEnum) => {
      //没有保存过的数据直接删除
      if (ddEnum.action === DOStatus.NEW) {
        return false;
      }
      ddEnum.dtoEnumAttributes = ddEnum.dtoEnumAttributes?.filter(
        (attribute) => {
          if (attribute.action === DOStatus.NEW) {
            return false;
          }
          attribute.action = DOStatus.DELETED;
          return true;
        },
      );
      ddEnum.action = DOStatus.DELETED;
      return true;
    },
  );

  state.dtoCollection!.dtoNodeUis = state.dtoCollection?.dtoNodeUis?.filter(
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
  state.dtoCollection!.deAssociates = state.dtoCollection?.deAssociates?.filter(
    (entityAsso) => {
      //没有保存过的数据直接删除
      if (entityAsso.action === DOStatus.NEW) {
        return;
      }
      entityAsso.action = DOStatus.DELETED;
      return true;
    },
  );
  state.dtoCollection!.dtoEnumAssociates =
    state.dtoCollection?.dtoEnumAssociates?.filter((enumAsso) => {
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
