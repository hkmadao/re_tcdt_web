import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TModuleStore, TEnum, TComponentEnum } from '../models';

/**添加组件枚举 */
export const addComponentEnums: CaseReducer<
  TModuleStore,
  PayloadAction<TEnum[]>
> = (state, action) => {
  const ddEnums = action.payload;
  ddEnums.forEach((ddEnum, index) => {
    const idComponentEnum = nanoid();
    state.component.componentNodeUis?.push({
      idElement: idComponentEnum,
      x: 100 * index,
      y: 300,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idComponentNodeUi: nanoid(),
      idComponent: state.component?.idComponent,
      action: DOStatus.NEW,
    });
    const newComponentEnum: TComponentEnum = {
      idComponentEnum: idComponentEnum,
      idComponent: state.component?.idComponent,
      idEnum: ddEnum.idEnum,
      ddEnum: ddEnum,
      action: DOStatus.NEW,
    };
    state.component?.componentEnums?.push(newComponentEnum);
  });
  //更新图表
  state.drawCount++;
};
