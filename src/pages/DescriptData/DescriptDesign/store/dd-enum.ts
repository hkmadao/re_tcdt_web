import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumNodeUi } from '../conf';
import { TEnum, TModuleStore, TNodeUi } from '../models';

/**添加枚举 */
export const addEnum: CaseReducer<TModuleStore, PayloadAction<any>> = (
  state,
  action,
) => {
  const idEnum = nanoid();
  state.entityCollection?.enums?.push({
    ...action.payload,
    idEnum: idEnum,
    enumValueType: 'String',
    action: DOStatus.NEW,
  });
  state.entityCollection!.nodeUis?.push({
    idElement: idEnum,
    x: 50,
    y: 100,
    width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
    height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
    idNodeUi: nanoid(),
    idEntityCollection: state.entityCollection?.idEntityCollection,
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

/** 粘贴实体 */
export const patseEnums: CaseReducer<TModuleStore, PayloadAction<TEnum[]>> = (
  state,
  action,
) => {
  const newEnums: TEnum[] = action.payload;
  const newNodeUis: TNodeUi[] = [];
  newEnums.forEach((newEnum, index) => {
    newEnum.idEnum = nanoid();
    const nodeUi: TNodeUi = {
      idNodeUi: nanoid(),
      x: index * EnumNodeUi.ENUM_DEFAULT_WIDTH,
      y: 0,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idEntityCollection: state.entityCollection?.idEntityCollection,
      idElement: newEnum.idEnum,
      action: DOStatus.NEW,
    };
    newNodeUis.push(nodeUi);
    newEnum.action = DOStatus.NEW;
    newEnum.attributes?.forEach((attr) => {
      attr.idEnum = newEnum.idEnum;
      attr.idEnumAttribute = nanoid();
      attr.action = DOStatus.NEW;
    });
  });
  state.entityCollection.nodeUis =
    state.entityCollection.nodeUis?.concat(newNodeUis);
  state.entityCollection.enums = state.entityCollection.enums?.concat(newEnums);
  //更新图表
  state.drawCount++;
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
  state.entityCollection.enums = state.entityCollection.enums?.map((ddEnum) => {
    if (ddEnum.idEnum == newEnum.idEnum) {
      ddEnum = { ...newEnum, attributes: ddEnum.attributes };
    }
    return ddEnum;
  });
};
