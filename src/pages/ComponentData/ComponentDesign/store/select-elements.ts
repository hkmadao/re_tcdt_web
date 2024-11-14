import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType } from '../conf';
import { TConcreteDiagram, TModuleStore, TComponentNodeUi } from '../models';

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
    nodeUis: TComponentNodeUi[];
  }>
> = (state, action) => {
  const { selectNodes, selectLines, nodeUis } = action.payload;
  //判断是否加入新连线
  const newLine = selectLines.find((line) => {
    return !line.idElement && line.targetId;
  });

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
  const mainNode = state.selectNodes?.find((concreteDiagram) => {
    return state.component?.idMainComponentEntity === concreteDiagram.idElement;
  });
  const mainCEntity = state.component.componentEntities?.find(
    (ce) =>
      ce.action !== DOStatus.DELETED &&
      state.component.idMainComponentEntity === ce.idComponentEntity,
  );
  //主实体删除，所有元素删除
  if (mainNode) {
    state.component!.idMainComponentEntity = undefined;
    state.component!.componentEntities =
      state.component?.componentEntities?.filter((componentEntity) => {
        if (componentEntity.action === DOStatus.NEW) {
          return false;
        }
        //删除扩展属性
        componentEntity.extAttributes = componentEntity.extAttributes?.filter(
          (extAttribute) => {
            if (extAttribute.action === DOStatus.NEW) {
              return false;
            }
            extAttribute.action = DOStatus.DELETED;
            return true;
          },
        );
        //计算属性删除
        componentEntity.computationAttributes =
          componentEntity.computationAttributes?.filter(
            (computationAttribute) => {
              if (computationAttribute.action === DOStatus.NEW) {
                return false;
              }
              computationAttribute.action = DOStatus.DELETED;
              return true;
            },
          );
        componentEntity.action = DOStatus.DELETED;
        return true;
      });
    state.component!.componentEntityAssociates =
      state.component?.componentEntityAssociates?.filter(
        (componentEntityAssociate) => {
          if (componentEntityAssociate.action === DOStatus.NEW) {
            return false;
          }
          componentEntityAssociate.action = DOStatus.DELETED;
          return true;
        },
      );
    // console.log(JSON.parse(JSON.stringify(state.component!.componentNodeUis)));
    //ui删除
    state.component!.componentNodeUis =
      state.component?.componentNodeUis?.filter((componentNodeUi) => {
        if (componentNodeUi.action === DOStatus.NEW) {
          return false;
        }
        componentNodeUi.action = DOStatus.DELETED;
        return true;
      });
    // console.log(JSON.parse(JSON.stringify(state.component!.componentNodeUis)));
    //更新图表
    state.drawCount++;
    return;
  }
  //删除选中节点
  state.selectNodes?.forEach((concreteDiagram) => {
    const idElement = concreteDiagram.idElement;
    if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENTITY) {
      const deleteComponentEntity = state.component.componentEntities?.find(
        (cE) =>
          cE.action !== DOStatus.DELETED && cE.idComponentEntity === idElement,
      );
      const deleteEntity = deleteComponentEntity?.ddEntity;
      //删除连线
      state.component!.componentEntityAssociates =
        state.component!.componentEntityAssociates?.filter((cEAsso) => {
          const entityAsso = cEAsso.entityAssociate;
          if (
            !entityAsso ||
            entityAsso.idUp === deleteEntity?.idEntity ||
            entityAsso.idDown === deleteEntity?.idEntity
          ) {
            //和主实体的连线，修改标志
            if (entityAsso?.idUp === mainCEntity?.ddEntity?.idEntity) {
              cEAsso.fgAggAsso = false;
              cEAsso.action =
                cEAsso.action === DOStatus.UNCHANGED
                  ? DOStatus.UPDATED
                  : cEAsso.action;
              return true;
            }
            //没有保存过的数据直接删除
            if (cEAsso.action === DOStatus.NEW) {
              return false;
            }
            cEAsso.action = DOStatus.DELETED;
          }
          return true;
        });
      //删除ui
      state.component!.componentNodeUis =
        state.component?.componentNodeUis?.filter((nodeUi) => {
          if (nodeUi.idElement === deleteComponentEntity?.idComponentEntity) {
            //没有保存过的数据直接删除
            if (nodeUi.action === DOStatus.NEW) {
              return false;
            }
            nodeUi.action = DOStatus.DELETED;
          }
          return true;
        });
      //删除实体
      state.component!.componentEntities =
        state.component?.componentEntities?.filter((componentEntity) => {
          if (
            componentEntity.idComponentEntity ===
            deleteComponentEntity?.idComponentEntity
          ) {
            //没有保存过的数据直接删除
            if (componentEntity.action === DOStatus.NEW) {
              return false;
            }
            //删除扩展属性
            componentEntity.extAttributes =
              componentEntity.extAttributes?.filter((extAttribute) => {
                if (extAttribute.action === DOStatus.NEW) {
                  return false;
                }
                extAttribute.action = DOStatus.DELETED;
                return true;
              });
            componentEntity.action = DOStatus.DELETED;
          }
          return true;
        });
    }
    //删除枚举
    const ces = state.component.componentEntities?.filter(
      (componentEntity) => componentEntity.action !== DOStatus.DELETED,
    );

    if (ces && ces.length === 0) {
      if (concreteDiagram.concreteType === EnumConcreteDiagramType.ENUM) {
        const deleteComponentEnum = state.component.componentEnums?.find(
          (cE) =>
            cE.action !== DOStatus.DELETED && cE.idComponentEnum === idElement,
        );
        if (deleteComponentEnum) {
          //删除ui
          state.component!.componentNodeUis =
            state.component?.componentNodeUis?.filter((nodeUi) => {
              if (nodeUi.idElement === deleteComponentEnum?.idComponentEnum) {
                //没有保存过的数据直接删除
                if (nodeUi.action === DOStatus.NEW) {
                  return false;
                }
                nodeUi.action = DOStatus.DELETED;
              }
              return true;
            });
          state.component.componentEnums =
            state.component.componentEnums?.filter((componentDto) => {
              if (
                componentDto.idComponentEnum ===
                deleteComponentEnum.idComponentEnum
              ) {
                //没有保存过的数据直接删除
                if (componentDto.action === DOStatus.NEW) {
                  return false;
                }
                componentDto.action = DOStatus.DELETED;
              }
              return true;
            });
        }
      }
    }
  });
  //更新图表
  state.drawCount++;
};

export const cleanAllElement: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.component!.idMainComponentEntity = undefined;
  state.component!.componentEntities =
    state.component?.componentEntities?.filter((componentEntity) => {
      if (componentEntity.action === DOStatus.NEW) {
        return false;
      }
      //删除扩展属性
      componentEntity.extAttributes = componentEntity.extAttributes?.filter(
        (extAttribute) => {
          if (extAttribute.action === DOStatus.NEW) {
            return false;
          }
          extAttribute.action = DOStatus.DELETED;
          return true;
        },
      );
      //计算属性删除
      componentEntity.computationAttributes =
        componentEntity.computationAttributes?.filter(
          (computationAttribute) => {
            if (computationAttribute.action === DOStatus.NEW) {
              return false;
            }
            computationAttribute.action = DOStatus.DELETED;
            return true;
          },
        );
      componentEntity.action = DOStatus.DELETED;
      return true;
    });
  state.component.componentEnums = state.component?.componentEnums?.filter(
    (componentEnum) => {
      if (componentEnum.action === DOStatus.NEW) {
        return false;
      }
      componentEnum.action = DOStatus.DELETED;
      return true;
    },
  );
  state.component!.componentEntityAssociates =
    state.component?.componentEntityAssociates?.filter(
      (componentEntityAssociate) => {
        if (componentEntityAssociate.action === DOStatus.NEW) {
          return false;
        }
        componentEntityAssociate.action = DOStatus.DELETED;
        return true;
      },
    );
  //ui删除
  state.component!.componentNodeUis = state.component?.componentNodeUis?.filter(
    (componentNodeUi) => {
      if (componentNodeUi.action === DOStatus.NEW) {
        return false;
      }
      componentNodeUi.action = DOStatus.DELETED;
      return true;
    },
  );
  //更新图表
  state.drawCount++;
};
