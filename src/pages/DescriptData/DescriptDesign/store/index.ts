import { DOStatus } from '@/models/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType, moduleName } from '../conf';
import { TEntity, TEntityCollection } from '../models';
import initialState, { resetState } from './initial-state';
import { moveInEntities, moveInElements } from './move-in-entities';
import * as selectElementsCaseReducer from './select-elements';
import * as attributeCaseReducer from './attribute';
import * as associateCaseReducer from './associate';
import * as ddEntityCaseReducer from './dd-entity';
import * as ddEnumCaseReducer from './dd-enum';
import * as nodeUiCaseReducer from './node-ui';
import * as enumAttributeCaseReducer from './enum-attribute';
import * as enumAssociateCaseReducer from './enum-associate';
import * as moduleUiCaseReducer from './module-ui';
import * as focusCaseReducer from './focus';
import * as outElementsCaseReducer from './out-elements';
import * as recoverCaseReducer from './recover';
import {
  fetchEntityAttributes,
  fetchOutEntityAttribute,
} from './fetch-entity-attribute';
import {
  fetchEntityCollection,
  fetchFullCollection,
  saveEntityCollection,
} from './async-thunk';

export * from './async-thunk';
export * from './selects';
export * from './fetch-entity-attribute';

export const designSlice = createSlice({
  name: moduleName,
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<void>) => {
      state.entityCollection = initialState.entityCollection;
    },
    /**切换显示外部实体状态 */
    toggleFgShowOutEntities: (state, action: PayloadAction<void>) => {
      state.fgShowOutEntities = !state.fgShowOutEntities;
      //更新图表
      state.drawCount++;
    },
    /**切换显示枚举连线 */
    toggleFgShowEnumAsso: (state, action: PayloadAction<void>) => {
      state.fgShowEnumAsso = !state.fgShowEnumAsso;
      //更新图表
      state.drawCount++;
    },
    /**切换显示系统引用连线 */
    toggleShowSysRefAsso: (state, action: PayloadAction<void>) => {
      state.fgShowSysRefAsso = !state.fgShowSysRefAsso;
      //更新图表
      state.drawCount++;
    },
    updateEntityCollection: (
      state,
      action: PayloadAction<TEntityCollection>,
    ) => {
      const newEntityCollection = action.payload;
      state.entityCollection.displayName = newEntityCollection.displayName;
      state.entityCollection.packageName = newEntityCollection.packageName;
    },
    importCollection: (state, action: PayloadAction<TEntityCollection>) => {
      const newCollection = action.payload;
      const newEntitys = newCollection.entities
        .filter((enti) => enti.action !== DOStatus.DELETED)
        .map((enti) => {
          enti.action = DOStatus.NEW;
          enti.attributes = enti.attributes
            ?.filter((attr) => attr.action !== DOStatus.DELETED)
            .map((attr) => {
              attr.action = DOStatus.NEW;
              const attrType = state.entityCollection.sysDataTypes.find(
                (dt) => dt.code === attr.attributeType?.code,
              );
              if (!attrType) {
                attr.idAttributeType = undefined;
                attr.attributeType = undefined;
                return attr;
              }
              attr.idAttributeType = attrType.idDataType;
              attr.attributeType = attrType;
              return attr;
            });
          return enti;
        });
      const newEnums = newCollection.enums
        .filter((enti) => enti.action !== DOStatus.DELETED)
        .map((enti) => {
          enti.action = DOStatus.NEW;
          enti.attributes = enti.attributes
            ?.filter((attr) => attr.action !== DOStatus.DELETED)
            .map((attr) => {
              attr.action = DOStatus.NEW;
              return attr;
            });
          return enti;
        });
      const entiIds = newEntitys.map((enti) => enti.idEntity);
      const enumIds = newEnums.map((en) => en.idEnum);
      const ids = entiIds.concat(enumIds);
      const newNodeUis = newCollection.nodeUis.filter((enti) => {
        if (
          enti.action !== DOStatus.DELETED &&
          enti.idElement &&
          ids.includes(enti.idElement)
        ) {
          enti.action = DOStatus.NEW;
          return true;
        }
        return false;
      });
      const newEntityAssociates = newCollection.entityAssociates.filter(
        (enti) => {
          if (
            enti.action !== DOStatus.DELETED &&
            enti.idUp &&
            entiIds.includes(enti.idUp)
          ) {
            enti.action = DOStatus.NEW;
            return true;
          }
          return false;
        },
      );
      const newEnumAssociates = newCollection.enumAssociates.filter((enti) => {
        if (
          enti.action !== DOStatus.DELETED &&
          enti.idEnum &&
          enumIds.includes(enti.idEnum)
        ) {
          enti.action = DOStatus.NEW;
          return true;
        }
        return false;
      });
      state.entityCollection.entities =
        state.entityCollection.entities.concat(newEntitys);
      state.entityCollection.enums =
        state.entityCollection.enums.concat(newEnums);
      state.entityCollection.nodeUis =
        state.entityCollection.nodeUis.concat(newNodeUis);
      state.entityCollection.entityAssociates =
        state.entityCollection.entityAssociates.concat(newEntityAssociates);
      state.entityCollection.enumAssociates =
        state.entityCollection.enumAssociates.concat(newEnumAssociates);
      //更新图表
      state.drawCount++;
    },
    ...attributeCaseReducer,
    ...selectElementsCaseReducer,
    ...associateCaseReducer,
    ...ddEntityCaseReducer,
    ...ddEnumCaseReducer,
    ...nodeUiCaseReducer,
    ...enumAttributeCaseReducer,
    ...enumAssociateCaseReducer,
    ...moduleUiCaseReducer,
    ...focusCaseReducer,
    ...outElementsCaseReducer,
    ...recoverCaseReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntityCollection.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchEntityCollection.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchEntityCollection.fulfilled, (state, action) => {
        const { fgCurrent, idElement, concreteType, collection } =
          action.payload;
        if (fgCurrent) {
          state.status = 'succeeded';
          state.moduleUi.goToId = idElement;
          state.moduleUi.zoomLevel = 100;
          if (concreteType) {
            state.currentSelect = {
              concreteType: concreteType,
              idElement: idElement,
            };
            state.selectNodes = [
              {
                concreteType: concreteType,
                idElement: idElement,
              },
            ];
          }
          return;
        }
        if (!collection) {
          return;
        }
        resetState(state);
        state.entityCollection = fillEntityCollection(collection);
        state.status = 'succeeded';
        state.moduleUi.goToId = idElement;
        state.moduleUi.zoomLevel = 100;
        if (concreteType) {
          state.currentSelect = {
            concreteType: concreteType,
            idElement: idElement,
          };
          state.selectNodes = [
            {
              concreteType: concreteType,
              idElement: idElement,
            },
          ];
        }
      })
      .addCase(fetchFullCollection.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFullCollection.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchFullCollection.fulfilled, (state, action) => {
        const { fgCurrent, idElement, concreteType, collection } =
          action.payload;
        if (fgCurrent) {
          state.status = 'succeeded';
          state.moduleUi.goToId = idElement;
          state.moduleUi.zoomLevel = 100;
          if (concreteType) {
            state.currentSelect = {
              concreteType: concreteType,
              idElement: idElement,
            };
            state.selectNodes = [
              {
                concreteType: concreteType,
                idElement: idElement,
              },
            ];
          }
          return;
        }
        if (!collection) {
          return;
        }
        resetState(state);
        state.entityCollection = fillEntityCollection(collection);
        state.status = 'succeeded';
        state.moduleUi.goToId = idElement;
        state.moduleUi.zoomLevel = 100;
        if (concreteType) {
          state.currentSelect = {
            concreteType: concreteType,
            idElement: idElement,
          };
          state.selectNodes = [
            {
              concreteType: concreteType,
              idElement: idElement,
            },
          ];
        }
      })
      .addCase(saveEntityCollection.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(saveEntityCollection.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(saveEntityCollection.fulfilled, (state, action) => {
        if (!action.payload) {
          state.status = 'failed';
          return;
        }
        state.entityCollection = fillEntityCollection(action.payload);
        state.addElementStatus = undefined;
        if (state.focusDrawCount > 0) {
          state.focusDrawCount++;
        } else {
          state.drawCount++;
        }
        state.currentSelect = {
          concreteType: EnumConcreteDiagramType.PANEL,
        };
        state.connectionMode = false;
        state.selectLines = [];
        state.selectNodes = [];
        state.status = 'succeeded';
      })
      .addCase(moveInEntities.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(moveInEntities.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(moveInEntities.fulfilled, (state, action) => {
        state.entityCollection = fillEntityCollection(action.payload);
        state.fgShowOutEntities = false;
        state.fgShowEnumAsso = false;
        state.drawCount++;
        state.currentSelect = {
          concreteType: EnumConcreteDiagramType.PANEL,
        };
        state.connectionMode = false;
        state.selectLines = [];
        state.selectNodes = [];
        state.status = 'succeeded';
      })
      .addCase(moveInElements.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(moveInElements.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(moveInElements.fulfilled, (state, action) => {
        state.entityCollection = fillEntityCollection(action.payload);
        state.fgShowOutEntities = false;
        state.fgShowEnumAsso = false;
        state.drawCount++;
        state.currentSelect = {
          concreteType: EnumConcreteDiagramType.PANEL,
        };
        state.connectionMode = false;
        state.selectLines = [];
        state.selectNodes = [];
        state.status = 'succeeded';
      })
      .addCase(fetchEntityAttributes.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchEntityAttributes.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchEntityAttributes.fulfilled, (state, action) => {
        const resEntities = action.payload;
        if (resEntities) {
          state.entityCollection.entities?.forEach((entity) => {
            const resEntity = resEntities.find((resEnti) => {
              return entity.idEntity === resEnti.idEntity;
            });
            if (!resEntity) {
              return;
            }
            if (entity.action === DOStatus.DELETED) {
              entity.attributes = resEntity.attributes?.map((attr) => {
                attr.action = DOStatus.DELETED;
                return attr;
              });
            }
            entity.attributes = resEntity.attributes;
            return;
          });
          state.entityCollection.outEntities?.forEach((entity) => {
            const resEntity = resEntities.find((resE) => {
              return entity.idEntity === resE.idEntity;
            });
            if (!resEntity) {
              return;
            }
            entity.attributes = resEntity.attributes;
          });
        }
        state.status = 'succeeded';
      })
      .addCase(fetchOutEntityAttribute.pending, (state, action) => {})
      .addCase(fetchOutEntityAttribute.rejected, (state, action) => {})
      .addCase(fetchOutEntityAttribute.fulfilled, (state, action) => {
        const resEntity = action.payload as TEntity;
        state.entityCollection.outEntities?.forEach((entity) => {
          if (entity.idEntity === resEntity.idEntity) {
            entity.attributes = resEntity.attributes;
          }
        });
      });
  },
});

const fillEntityCollection = (entityCollection: TEntityCollection) => {
  if (!entityCollection.entities) {
    entityCollection.entities = [];
  }
  if (!entityCollection.outEntities) {
    entityCollection.outEntities = [];
  }
  if (!entityCollection.entityAssociates) {
    entityCollection.entityAssociates = [];
  }
  if (!entityCollection.enums) {
    entityCollection.enums = [];
  }
  if (!entityCollection.outEnums) {
    entityCollection.outEnums = [];
  }
  if (!entityCollection.enumAssociates) {
    entityCollection.enumAssociates = [];
  }
  if (!entityCollection.nodeUis) {
    entityCollection.nodeUis = [];
  }
  if (!entityCollection.sysDataTypes) {
    entityCollection.sysDataTypes = [];
  }
  if (!entityCollection.commonAttributes) {
    entityCollection.commonAttributes = [];
  }
  return entityCollection;
};

export const actions = designSlice.actions;

export default designSlice;
