import { DOStatus } from '@/models/enums';
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType, moduleName } from '../conf';
import { TDtoEntityCollection } from '../models';
import initialState, { resetState } from './initial-state';
export * from './selects';
export * from './fetch-entity-attribute';
import type {
  TAttribute,
  TEnumAttribute,
} from '@/pages/ComponentDTO/ComponentDTOTree/models';
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
import * as computationAttributeReducer from './computation-attribute';
import { fetchEntityAttributes } from './fetch-entity-attribute';
import {
  fetchEntites,
  fetchEnums,
  fetchEntityCollection,
  saveEntityCollection,
} from './async-thunk';

export * from './async-thunk';

export const designSlice = createSlice({
  name: moduleName,
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<void>) => {
      state.dtoCollection = initialState.dtoCollection;
    },
    /**切换显示系统引用连线 */
    toggleShowSysRefAsso: (state, action: PayloadAction<void>) => {
      state.fgShowSysRefAsso = !state.fgShowSysRefAsso;
      //更新图表
      state.drawCount++;
    },
    updateEntityCollection: (
      state,
      action: PayloadAction<TDtoEntityCollection>,
    ) => {
      const newEntityCollection = action.payload;
      state.dtoCollection.displayName = newEntityCollection.displayName;
      state.dtoCollection.packageName = newEntityCollection.packageName;
      state.dtoCollection.idMainDtoEntity = newEntityCollection.idMainDtoEntity;
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
    ...computationAttributeReducer,
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
        state.dtoCollection = fillEntityCollection(collection);
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
        state.dtoCollection = {
          ...fillEntityCollection(action.payload),
          dtoModule: state.dtoCollection.dtoModule,
        };
        state.addElementStatus = undefined;
        if (state.focusDrawCount > 0) {
          state.focusDrawCount++;
        } else {
          state.drawCount++;
        }
        state.currentSelect = {
          concreteType: EnumConcreteDiagramType.PANEL,
        };
        state.selectLines = [];
        state.selectNodes = [];
        state.status = 'succeeded';
      })
      .addCase(fetchEntityAttributes.pending, (state, action) => {})
      .addCase(fetchEntityAttributes.rejected, (state, action) => {})
      .addCase(fetchEntityAttributes.fulfilled, (state, action) => {
        const resEntities = action.payload;
        if (resEntities) {
          state.dtoCollection.dtoEntities?.forEach((entity) => {
            const resEntity = resEntities.find((resE) => {
              return entity.idDtoEntity === resE.idDtoEntity;
            });
            if (!resEntity) {
              return;
            }
            entity.deAttributes = resEntity.deAttributes;
            entity.dcAttributes = resEntity.dcAttributes;
          });
        }
        state.status = 'succeeded';
      })
      .addCase(fetchEntites.pending, (state, action) => {})
      .addCase(fetchEntites.rejected, (state, action) => {})
      .addCase(fetchEntites.fulfilled, (state, action) => {
        const entities = action.payload;
        state.dtoCollection.dtoEntities.forEach((dtoEntityState) => {
          if (dtoEntityState.action === DOStatus.DELETED) {
            return;
          }
          const entity = entities.find(
            (entityTemp) => entityTemp.idEntity === dtoEntityState.idRef,
          );
          if (!entity) {
            return;
          }
          // dtoEntityState.className = entity.className;
          // dtoEntityState.displayName = entity.displayName;
          dtoEntityState.tableName = entity.tableName;
          const deAttributes =
            dtoEntityState.deAttributes?.filter((attr) => {
              if (attr.action === DOStatus.NEW) {
                return false;
              }
              attr.action = DOStatus.DELETED;
              return true;
            }) || [];
          const attrs: TAttribute[] = entity.attributes || [];
          attrs.forEach((attr) => {
            deAttributes.push({
              ...attr,
              idRefAttribute: attr.idAttribute,
              idDtoEntity: dtoEntityState.idDtoEntity,
              idDtoEntityAttribute: nanoid(),
              action: DOStatus.NEW,
            });
          });
          dtoEntityState.deAttributes = deAttributes;
        });
      })
      .addCase(fetchEnums.pending, (state, action) => {})
      .addCase(fetchEnums.rejected, (state, action) => {})
      .addCase(fetchEnums.fulfilled, (state, action) => {
        const enums = action.payload;
        state.dtoCollection.dtoEnums.forEach((dtoEnumState) => {
          if (dtoEnumState.action === DOStatus.DELETED) {
            return;
          }
          const ddEnum = enums.find(
            (enumTemp) => enumTemp.idEnum === dtoEnumState.idRef,
          );
          if (!ddEnum) {
            return;
          }
          // dtoEntityState.className = entity.className;
          // dtoEntityState.displayName = entity.displayName;
          const dtoEnumAttributes =
            dtoEnumState.dtoEnumAttributes?.filter((attr) => {
              if (attr.action === DOStatus.NEW) {
                return false;
              }
              attr.action = DOStatus.DELETED;
              return true;
            }) || [];
          const attrs: TEnumAttribute[] = ddEnum.attributes || [];
          attrs.forEach((attr) => {
            dtoEnumAttributes.push({
              ...attr,
              idRef: attr.idEnumAttribute,
              idDtoEnum: dtoEnumState.idDtoEnum,
              idDtoEnumAttribute: nanoid(),
              action: DOStatus.NEW,
            });
          });
          dtoEnumState.dtoEnumAttributes = dtoEnumAttributes;
        });
      });
  },
});

const fillEntityCollection = (entityCollection: TDtoEntityCollection) => {
  if (!entityCollection.dtoEntities) {
    entityCollection.dtoEntities = [];
  }
  if (!entityCollection.deAssociates) {
    entityCollection.deAssociates = [];
  }
  if (!entityCollection.dtoEnums) {
    entityCollection.dtoEnums = [];
  }
  if (!entityCollection.dtoEnumAssociates) {
    entityCollection.dtoEnumAssociates = [];
  }
  if (!entityCollection.dtoNodeUis) {
    entityCollection.dtoNodeUis = [];
  }
  if (!entityCollection.sysDataTypes) {
    entityCollection.sysDataTypes = [];
  }
  return entityCollection;
};

export const actions = designSlice.actions;

export default designSlice;
