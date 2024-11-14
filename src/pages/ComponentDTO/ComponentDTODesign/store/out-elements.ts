import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import {
  TDiagramUi,
  TModuleUi,
} from '@/pages/ComponentDTO/ComponentDTOTree/models';
import { EnumNodeUi } from '../conf';
import { TDtoEntity, TDtoEnum, TModuleStore } from '../models';

/**复制实体集合 */
export const copyAddElements: CaseReducer<
  TModuleStore,
  PayloadAction<{
    entities: TDtoEntity[];
    enums: TDtoEnum[];
    moduleUi: TModuleUi;
    diagramUi: TDiagramUi;
  }>
> = (state, action) => {
  const {
    entities: copyEntities,
    enums: copyEnums,
    moduleUi,
    diagramUi,
  } = action.payload;
  copyEntities.forEach((copyEntity, index) => {
    copyEntity.idDtoEntity = nanoid();
    copyEntity.action = DOStatus.NEW;
    copyEntity.idDtoEntityCollection =
      state.dtoCollection.idDtoEntityCollection;
    copyEntity.deAttributes?.forEach((attribute) => {
      attribute.idDtoEntity = copyEntity.idDtoEntity;
      attribute.idDtoEntityAttribute = nanoid();
      attribute.action = DOStatus.NEW;
    });
    const width = moduleUi.cWidth - moduleUi.lWidth - moduleUi.rWidth;
    const height = moduleUi.cHeight - moduleUi.hHeight - moduleUi.bHeight;
    const x =
      (width / 2.0 + moduleUi.lWidth - diagramUi.offsetX) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    const y =
      (height / 2.0 + moduleUi.hHeight - diagramUi.offsetY) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    state.dtoCollection.dtoNodeUis?.push({
      idElement: copyEntity.idDtoEntity,
      x: x + 200 * index,
      y: y,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idDtoNodeUi: nanoid(),
      idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
      action: DOStatus.NEW,
    });
  });
  copyEnums.forEach((copyEnum, index) => {
    copyEnum.idDtoEnum = nanoid();
    copyEnum.action = DOStatus.NEW;
    copyEnum.idDtoEntityCollection = state.dtoCollection.idDtoEntityCollection;
    copyEnum.dtoEnumAttributes?.forEach((attribute) => {
      attribute.idDtoEnum = copyEnum.idDtoEnum;
      attribute.idDtoEnumAttribute = nanoid();
      attribute.action = DOStatus.NEW;
    });
    const width = moduleUi.cWidth - moduleUi.lWidth - moduleUi.rWidth;
    const height = moduleUi.cHeight - moduleUi.hHeight - moduleUi.bHeight;
    const x =
      (width / 2.0 + moduleUi.lWidth - diagramUi.offsetX) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    const y =
      (height / 2.0 + moduleUi.hHeight - diagramUi.offsetY) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    state.dtoCollection.dtoNodeUis?.push({
      idElement: copyEnum.idDtoEnum,
      x: x + 200 * index,
      y: y,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idDtoNodeUi: nanoid(),
      idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
      action: DOStatus.NEW,
    });
  });
  state.dtoCollection.dtoEntities =
    state.dtoCollection.dtoEntities?.concat(copyEntities);
  state.dtoCollection.dtoEnums =
    state.dtoCollection.dtoEnums?.concat(copyEnums);
  if (state.focusDrawCount > 0) {
    const copyEntityIds = copyEntities.map(
      (copyEntity) => copyEntity.idDtoEntity!,
    );
    state.focusIds = state.focusIds.concat(copyEntityIds);
    const copyEnumIds = copyEnums.map((copyEnum) => copyEnum.idDtoEnum!);
    state.focusIds = state.focusIds.concat(copyEntityIds).concat(copyEnumIds);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
};

/**设置添加元素状态 */
export const setAddElementStatus: CaseReducer<
  TModuleStore,
  PayloadAction<{ addElementStatus?: 'entity' | 'enum' }>
> = (state, action) => {
  const { addElementStatus } = action.payload;
  state.addElementStatus = addElementStatus;
};

/**添加元素 */
export const addElement: CaseReducer<
  TModuleStore,
  PayloadAction<TDiagramUi>
> = (state, action) => {
  if (!state.addElementStatus) {
    return;
  }
  const diagramUi: TDiagramUi = action.payload;
  const idElement = nanoid();
  if (state.addElementStatus === 'entity') {
    const entity: TDtoEntity = {
      idDtoEntity: nanoid(),
      action: DOStatus.NEW,
      idDtoEntityCollection: state.dtoCollection.idDtoEntityCollection,
      displayName: '新实体',
      className: 'newEntity',
      tableName: 'new_table',
      deAttributes: [],
    };
    state.dtoCollection?.dtoEntities?.push({
      ...entity,
      idDtoEntity: idElement,
      action: DOStatus.NEW,
    });
    state.dtoCollection!.dtoNodeUis?.push({
      idElement: idElement,
      x: diagramUi.mouseX,
      y: diagramUi.mouseY,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idDtoNodeUi: nanoid(),
      idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
      action: DOStatus.NEW,
    });
  } else if (state.addElementStatus === 'enum') {
    const newEnum: TDtoEnum = {
      idDtoEnum: nanoid(),
      action: DOStatus.NEW,
      idDtoEntityCollection: state.dtoCollection.idDtoEntityCollection,
      displayName: '新枚举',
      className: 'newEnum',
      dtoEnumAttributes: [],
    };
    state.dtoCollection?.dtoEnums?.push({
      ...newEnum,
      idDtoEnum: idElement,
      enumValueType: 'String',
      action: DOStatus.NEW,
    });
    state.dtoCollection!.dtoNodeUis?.push({
      idElement: idElement,
      x: diagramUi.mouseX,
      y: diagramUi.mouseY,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idDtoNodeUi: nanoid(),
      idDtoEntityCollection: state.dtoCollection?.idDtoEntityCollection,
      action: DOStatus.NEW,
    });
  }
  //取消添加状态
  if (state.focusDrawCount > 0) {
    state.focusIds.push(idElement);
    state.focusDrawCount++;
  } else {
    //更新图表
    state.drawCount++;
  }
  state.addElementStatus = undefined;
};

/**设置连线状态 */
export const setConnectionMode: CaseReducer<
  TModuleStore,
  PayloadAction<{ connectionMode: boolean }>
> = (state, action) => {
  const { connectionMode } = action.payload;
  state.connectionMode = connectionMode;
};
