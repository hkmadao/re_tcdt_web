import { DOStatus } from '@/models/enums';
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumConcreteDiagramType, EnumNodeUi, moduleName } from '../conf';
import { TComponent } from '../models';
import initialState, { resetState } from './initial-state';

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
import * as addComponentEntityCaseReducer from './add-component-entity';
import * as addComponentEnumCaseReducer from './add-component-enum';
import * as componentEntityCaseReducer from './component-entity';
import * as componentEntityAttributeCaseReducer from './component-entity-attribute';
import * as computationAttributeCaseReducer from './computation-attributes';

import { fetchComponent, saveComponent } from './async-thunk';

export * from './async-thunk';
export * from './selects';

export const designSlice = createSlice({
  name: moduleName,
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<void>) => {
      state.component = initialState.component;
    },
    /**切换显示外部实体状态 */
    toggleFgShowOutEntities: (state, action: PayloadAction<void>) => {
      state.fgShowOutEntities = !state.fgShowOutEntities;
      //更新图表
      state.drawCount++;
    },
    /**切换显示系统接口状态 */
    toggleFgShowSysInterfaces: (state, action: PayloadAction<void>) => {
      state.fgShowSysInterfaces = !state.fgShowSysInterfaces;
      //更新图表
      state.drawCount++;
    },
    updateComponent: (state, action: PayloadAction<TComponent>) => {
      const newComponent = action.payload;
      state.component.displayName = newComponent.displayName;
      state.component.packageName = newComponent.packageName;
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
    ...addComponentEntityCaseReducer,
    ...componentEntityCaseReducer,
    ...addComponentEnumCaseReducer,
    ...componentEntityAttributeCaseReducer,
    ...computationAttributeCaseReducer,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponent.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchComponent.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(fetchComponent.fulfilled, (state, action) => {
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
        state.component = fillEntityCollection(collection);
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
      .addCase(saveComponent.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(saveComponent.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(saveComponent.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        state.component = fillEntityCollection(
          action.payload,
          state.component.idMainComponentEntity,
        );
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
      });
  },
});

const fillEntityCollection = (
  component: TComponent,
  idMainComponentEntity?: string,
) => {
  if (!component.componentEntities) {
    component.componentEntities = [];
  } else {
    component.componentEntities.forEach((componentEntity) => {
      const ddEntity = componentEntity.ddEntity;
      if (!ddEntity) {
        componentEntity.action = DOStatus.DELETED;
        componentEntity.extAttributes?.forEach(
          (extAttribute) => (extAttribute.action = DOStatus.DELETED),
        );
        return;
      }
      //将实体属性合并到扩展属性中
      componentEntity.extAttributes = componentEntity.extAttributes?.map(
        (extAttribute) => {
          const findAttribute = ddEntity?.attributes?.find(
            (attribute) => attribute.idAttribute === extAttribute.idAttribute,
          );
          if (!findAttribute) {
            // extAttribute.action = DOStatus.DELETED;
            return extAttribute;
          }
          extAttribute = {
            ...extAttribute,
            attribute: findAttribute,
            sn: findAttribute.sn,
            action: DOStatus.UPDATED,
          };
          return extAttribute;
        },
      );
      componentEntity.extAttributes?.sort((a, b) => a.sn! - b.sn!);
    });
  }
  if (!component.componentEnums) {
    component.componentEnums = [];
  }
  if (!component.componentEntityAssociates) {
    component.componentEntityAssociates = [];
  }
  if (!component.componentNodeUis) {
    component.componentNodeUis = [];
  }
  if (!component.outEntities) {
    component.outEntities = [];
  }
  if (!component.enums) {
    component.enums = [];
  } else {
    component.enums.forEach((ddEnums) => {
      const findNodeUi = component.componentNodeUis?.find(
        (nodeUi) =>
          nodeUi.action !== DOStatus.DELETED &&
          nodeUi.idElement === ddEnums.idEnum,
      );
      if (!findNodeUi) {
        component.componentNodeUis?.push({
          idComponentNodeUi: nanoid(),
          idElement: ddEnums.idEnum,
          x: 0,
          y: 0,
          width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
          height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
          action: DOStatus.NEW,
        });
      }
    });
  }
  if (!component.outEnums) {
    component.outEnums = [];
  }
  if (!component.enumAssociates) {
    component.enumAssociates = [];
  }
  if (!component.sysDataTypes) {
    component.sysDataTypes = [];
  }
  return component;
};

export const actions = designSlice.actions;

export default designSlice;
