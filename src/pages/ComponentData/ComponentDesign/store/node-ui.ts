import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore, TComponentNodeUi } from '../models';

/**更新图形的ui */
export const updateNodeUi: CaseReducer<
  TModuleStore,
  PayloadAction<TComponentNodeUi>
> = (state, action) => {
  const newComponentNodeUi = action.payload;
  state.component!.componentNodeUis = state.component!.componentNodeUis?.map(
    (componentNodeUi) => {
      if (
        componentNodeUi.idComponentNodeUi ===
        newComponentNodeUi.idComponentNodeUi
      ) {
        componentNodeUi = { ...action.payload, action: componentNodeUi.action };
        if (
          componentNodeUi.action !== DOStatus.NEW &&
          componentNodeUi.action !== DOStatus.DELETED
        ) {
          componentNodeUi.action = DOStatus.UPDATED;
        }
      }
      return componentNodeUi;
    },
  );
};

/**设置图形的ui */
export const setNodeUis: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  let newNodeUis: TComponentNodeUi[] = action.payload;
  newNodeUis = newNodeUis.map((newNodeUi) => {
    if (
      newNodeUi.action !== DOStatus.NEW &&
      newNodeUi.action !== DOStatus.DELETED
    ) {
      newNodeUi.action = DOStatus.UPDATED;
    }
    return newNodeUi;
  });
  state.component!.componentNodeUis = state.component?.componentNodeUis?.map(
    (nodeUi) => {
      const findNodeUi = newNodeUis.find(
        (nu) => nu.idComponentNodeUi === nodeUi.idComponentNodeUi,
      );
      if (findNodeUi) {
        if (
          nodeUi.x === findNodeUi.x &&
          nodeUi.y === findNodeUi.y &&
          nodeUi.width === findNodeUi.width &&
          nodeUi.height === findNodeUi.height
        ) {
          return nodeUi;
        }
      }
      return (nodeUi = { ...nodeUi, ...findNodeUi });
    },
  );
};
