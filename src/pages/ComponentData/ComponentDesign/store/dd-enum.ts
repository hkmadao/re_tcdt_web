import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TEnum, TModuleStore } from '../models';

/**添加枚举 */
export const addEnum: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idEnum = nanoid();
  state.component?.enums?.push({
    ...action.payload,
    idEnum: idEnum,
    action: DOStatus.NEW,
  });
  state.component!.componentNodeUis?.push({
    idElement: idEnum,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
    height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
    idComponentNodeUi: nanoid(),
    idComponent: state.component?.idComponent,
    action: DOStatus.NEW,
  });
  if (state.focusDrawCount > 0) {
    state.focusIds.push(idEnum);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
};

/**更新枚举 */
export const updateEnum: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const newEnum: TEnum = action.payload;
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  state.component.enums = state.component.enums?.map((ddEnum) => {
    if (ddEnum.idEnum == newEnum.idEnum) {
      ddEnum = { ...newEnum, attributes: ddEnum.attributes };
    }
    return ddEnum;
  });
};
