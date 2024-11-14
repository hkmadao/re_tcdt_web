import { DOStatus } from '@/models/enums';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { TModuleStore } from '../models';

/**取消初始化状态标志 */
export const cancelFgInit: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.fgInit = false;
};

/**更新图表区域ui */
export const updateDiagramUi: CaseReducer<
  TModuleStore,
  PayloadAction<{ width: number; height: number }>
> = (state, action) => {
  const { width, height } = action.payload;
  state.moduleUi.cWidth = width;
  state.moduleUi.cHeight = height;
};

/**更新顶部区域高度 */
export const updateHeaderHeight: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const hHeight = action.payload;
  state.moduleUi.hHeight = hHeight;
};

/**更新左侧区域宽度 */
export const updateLeftWidth: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const width = action.payload;
  state.moduleUi.lWidth = width;
};

/**更新右侧区域宽度 */
export const updateRightWidth: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const width = action.payload;
  state.moduleUi.rWidth = width;
};

/**更新底部区域高度 */
export const updateBottomHeight: CaseReducer<
  TModuleStore,
  PayloadAction<any>
> = (state, action) => {
  const height = action.payload;
  state.moduleUi.bHeight = height;
};
/**更新图表缩放比例 */
export const updateZoomLevel: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const zoomLevel = action.payload;
  state.moduleUi.zoomLevel = zoomLevel;
};
/**更新图表偏移距离 */
export const updateOffSet: CaseReducer<
  TModuleStore,
  PayloadAction<{ offsetX: number; offsetY: number }>
> = (state, action: { payload: { offsetX: number; offsetY: number } }) => {
  const { offsetX, offsetY } = action.payload;
  state.moduleUi.offsetX = offsetX;
  state.moduleUi.offsetY = offsetY;
};
/**更新鼠标坐标 */
export const updateMouseCoordinates: CaseReducer<
  TModuleStore,
  PayloadAction<{ mouseX: number; mouseY: number }>
> = (state, action: { payload: { mouseX: number; mouseY: number } }) => {
  const { mouseX, mouseY } = action.payload;
  state.moduleUi.mouseX = mouseX;
  state.moduleUi.mouseY = mouseY;
};
/**更新图表跳转元素id */
export const updateGoToId: CaseReducer<TModuleStore, PayloadAction<string>> = (
  state,
  action,
) => {
  const goToId = action.payload;
  if (!goToId) {
    return;
  }
  state.moduleUi.goToId = goToId;
  state.moduleUi.zoomLevel = 100;
  const findNodeUi = state.component.componentNodeUis?.find(
    (node) => node.action !== DOStatus.DELETED && node.idElement === goToId,
  );
  if (findNodeUi) {
    state.moduleUi.offsetX = -findNodeUi.x!;
    state.moduleUi.offsetY = -findNodeUi.y!;
  }
};
/**重置图表跳转元素id */
export const resetGoToId: CaseReducer<TModuleStore, PayloadAction<void>> = (
  state,
  action,
) => {
  state.moduleUi.goToId = '';
};

/**增加适配画布次数 */
export const increaseZoomToFitCount: CaseReducer<
  TModuleStore,
  PayloadAction<void>
> = (state, action) => {
  state.zoomToFitCount++;
  state.moduleUi.lWidth = 0;
  state.moduleUi.rWidth = 0;
  state.moduleUi.bHeight = 0;
};
