import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TEntity, TEnum, TModuleStore } from '../models';

/**添加外部实体集合 */
export const addOutElements: CaseReducer<
  TModuleStore,
  PayloadAction<{ outEntities: TEntity[]; outEnums: TEnum[] }>
> = (
  state,
  action: { payload: { outEntities: TEntity[]; outEnums: TEnum[] } },
) => {
  const { outEntities, outEnums } = action.payload;
  //外部实体
  outEntities.forEach((outEntity) => {
    state.component?.outEntities?.push(outEntity);
    state.component!.componentNodeUis?.push({
      idElement: outEntity.idEntity,
      x: 50,
      y: 100,
      width: EnumNodeUi.ENTITY_DEFAULT_WIDTH,
      height: EnumNodeUi.ENTITY_DEFAULT_HEIGHT,
      idComponentNodeUi: nanoid(),
      idComponent: state.component?.idComponent,
      action: DOStatus.NEW,
    });
  });
  //外部枚举
  outEnums.forEach((outEnum) => {
    state.component?.outEnums?.push(outEnum);
    state.component!.componentNodeUis?.push({
      idElement: outEnum.idEnum,
      x: 50,
      y: 100,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idComponentNodeUi: nanoid(),
      idComponent: state.component?.idComponent,
      action: DOStatus.NEW,
    });
  });
  if (!state.fgShowOutEntities) {
    state.fgShowOutEntities = true;
  }
  if (state.focusDrawCount > 0) {
    const outEntityIds = outEntities.map((outEntity) => outEntity.idEntity!);
    const outEnumIds = outEnums.map((outEnum) => outEnum.idEnum!);
    state.focusIds = state.focusIds.concat(outEntityIds).concat(outEnumIds);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
};

/**复制实体集合 */
export const importEntities: CaseReducer<
  TModuleStore,
  PayloadAction<TEntity[]>
> = (state, action: { payload: TEntity[] }) => {};
