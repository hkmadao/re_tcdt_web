import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore } from '../models';

/**切换关注状态 */
export const toggleFgFocus: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  //切换为非聚焦状态
  if (state.focusDrawCount > 0) {
    state.focusIds = [];
    state.focusDrawCount = 0;
    state.drawCount = 1;
  } else {
    const selectedNodes = state.selectNodes || [];
    const idElements =
      selectedNodes.map((selectedNode) => selectedNode.idElement!) || [];
    const linkedElementIds: string[] = [];
    if (!idElements) {
      return;
    }
    state.entityCollection.entityAssociates?.forEach((asso) => {
      if (asso.action === DOStatus.DELETED) {
        return;
      }
      if (idElements.includes(asso.idUp!)) {
        linkedElementIds.push(asso.idDown!);
      }
      if (idElements.includes(asso.idDown!)) {
        linkedElementIds.push(asso.idUp!);
      }
    });
    state.entityCollection.enumAssociates?.forEach((asso) => {
      if (asso.action === DOStatus.DELETED) {
        return;
      }
      if (idElements.includes(asso.idEntity!)) {
        linkedElementIds.push(asso.idEnum!);
      }
      if (idElements.includes(asso.idEnum!)) {
        linkedElementIds.push(asso.idEntity!);
      }
    });
    const allFocusIds = idElements.concat(linkedElementIds);
    state.focusIds = allFocusIds;
    state.focusDrawCount = 1;
    state.drawCount = 0;
  }
};
