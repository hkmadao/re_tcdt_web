import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TDtoEnum, TModuleStore } from '../models';

/**添加枚举 */
export const addEnum: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idEnum = nanoid();
  state.dtoCollection?.dtoEnums?.push({
    ...action.payload,
    idDtoEnum: idEnum,
    enumValueType: 'String',
    action: DOStatus.NEW,
  });
  state.dtoCollection!.dtoNodeUis?.push({
    idElement: idEnum,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
    height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
    idDtoNodeUi: nanoid(),
    idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
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
export const updateEnum: CaseReducer<TModuleStore, PayloadAction<TDtoEnum>> = (
  state,
  action,
) => {
  const newEnum: TDtoEnum = action.payload;
  newEnum.action === DOStatus.UNCHANGED
    ? (newEnum.action = DOStatus.UPDATED)
    : undefined;
  state.dtoCollection.dtoEnums = state.dtoCollection.dtoEnums?.map((ddEnum) => {
    if (ddEnum.idDtoEnum === newEnum.idDtoEnum) {
      ddEnum = { ...newEnum, dtoEnumAttributes: ddEnum.dtoEnumAttributes };
    }
    return ddEnum;
  });
};
