import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore, TNodeUi } from '../models';

/**更新图形的ui */
export const updateNodeUi: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  state.entityCollection!.nodeUis = state.entityCollection!.nodeUis?.map(
    (nodeUi) => {
      if (nodeUi.idNodeUi === action.payload.idNodeUi) {
        nodeUi = { ...action.payload, action: nodeUi.action };
        if (
          nodeUi.action !== DOStatus.NEW &&
          nodeUi.action !== DOStatus.DELETED
        ) {
          nodeUi.action = DOStatus.UPDATED;
        }
      }
      return nodeUi;
    },
  );
};

/**设置图形的ui */
export const setNodeUis: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  let newNodeUis: TNodeUi[] = action.payload;
  newNodeUis = newNodeUis.map((newNodeUi) => {
    if (
      newNodeUi.action !== DOStatus.NEW &&
      newNodeUi.action !== DOStatus.DELETED
    ) {
      newNodeUi.action = DOStatus.UPDATED;
    }
    return newNodeUi;
  });
  state.entityCollection!.nodeUis = state.entityCollection?.nodeUis?.map(
    (nodeUi) => {
      const findNodeUi = newNodeUis.find(
        (nu) => nu.idNodeUi === nodeUi.idNodeUi,
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
