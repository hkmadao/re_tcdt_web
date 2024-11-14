import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import {
  TDiagramUi,
  TModuleUi,
} from '@/pages/DescriptData/DescriptDesign/models';
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
    state.entityCollection?.outEntities?.push(outEntity);
    state.entityCollection!.nodeUis?.push({
      idElement: outEntity.idEntity,
      x: 50,
      y: 100,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
      action: DOStatus.NEW,
    });
  });
  //外部枚举
  outEnums.forEach((outEnum) => {
    state.entityCollection?.outEnums?.push(outEnum);
    state.entityCollection!.nodeUis?.push({
      idElement: outEnum.idEnum,
      x: 50,
      y: 100,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
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
export const copyAddElements: CaseReducer<
  TModuleStore,
  PayloadAction<{
    entities: TEntity[];
    enums: TEnum[];
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
    copyEntity.idEntity = nanoid();
    copyEntity.action = DOStatus.NEW;
    copyEntity.idEntityCollection = state.entityCollection.idEntityCollection;
    copyEntity.attributes?.forEach((attribute) => {
      attribute.idEntity = copyEntity.idEntity;
      attribute.idAttribute = nanoid();
      attribute.action = DOStatus.NEW;
    });
    // console.log(
    //   moduleUi.hHeight,
    //   moduleUi.rWidth,
    //   moduleUi.bHeight,
    //   moduleUi.lWidth,
    // );
    const width = moduleUi.cWidth - moduleUi.lWidth - moduleUi.rWidth;
    const height = moduleUi.cHeight - moduleUi.hHeight - moduleUi.bHeight;
    const x =
      (width / 2.0 + moduleUi.lWidth - diagramUi.offsetX) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    const y =
      (height / 2.0 + moduleUi.hHeight - diagramUi.offsetY) *
      (1.0 / (moduleUi.zoomLevel / 100.0));
    // const x = state.diagramUi.mouseX;
    // const y = state.diagramUi.mouseY;
    state.entityCollection.nodeUis?.push({
      idElement: copyEntity.idEntity,
      x: x + 200 * index,
      y: y,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
      action: DOStatus.NEW,
    });
  });
  copyEnums.forEach((copyEnum, index) => {
    copyEnum.idEnum = nanoid();
    copyEnum.action = DOStatus.NEW;
    copyEnum.idEntityCollection = state.entityCollection.idEntityCollection;
    copyEnum.attributes?.forEach((attribute) => {
      attribute.idEnum = copyEnum.idEnum;
      attribute.idEnumAttribute = nanoid();
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
    // const x = state.diagramUi.mouseX;
    // const y = state.diagramUi.mouseY;
    state.entityCollection.nodeUis?.push({
      idElement: copyEnum.idEnum,
      x: x + 200 * index,
      y: y,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
      action: DOStatus.NEW,
    });
  });
  state.entityCollection.entities =
    state.entityCollection.entities?.concat(copyEntities);
  state.entityCollection.enums =
    state.entityCollection.enums?.concat(copyEnums);
  if (state.focusDrawCount > 0) {
    const copyEntityIds = copyEntities.map(
      (copyEntity) => copyEntity.idEntity!,
    );
    state.focusIds = state.focusIds.concat(copyEntityIds);
    const copyEnumIds = copyEnums.map((copyEnum) => copyEnum.idEnum!);
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
    const entity: TEntity = {
      idEntity: nanoid(),
      action: DOStatus.NEW,
      idEntityCollection: state.entityCollection.idEntityCollection,
      displayName: '新实体',
      className: 'newEntity',
      tableName: 'new_table',
      attributes: [],
    };
    state.entityCollection?.entities?.push({
      ...entity,
      idEntity: idElement,
      action: DOStatus.NEW,
    });
    state.entityCollection!.nodeUis?.push({
      idElement: idElement,
      x: diagramUi.mouseX,
      y: diagramUi.mouseY,
      width: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_WIDTH,
      height: EnumNodeUi.OUT_ENTITY_SIMPLE_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
      action: DOStatus.NEW,
    });
  } else if (state.addElementStatus === 'enum') {
    const newEnum: TEnum = {
      idEnum: nanoid(),
      action: DOStatus.NEW,
      idEntityCollection: state.entityCollection.idEntityCollection,
      displayName: '新枚举',
      className: 'newEnum',
      attributes: [],
    };
    state.entityCollection?.enums?.push({
      ...newEnum,
      idEnum: idElement,
      enumValueType: 'String',
      action: DOStatus.NEW,
    });
    state.entityCollection!.nodeUis?.push({
      idElement: idElement,
      x: diagramUi.mouseX,
      y: diagramUi.mouseY,
      width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
      height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
      idNodeUi: nanoid(),
      idEntityCollection: state.entityCollection?.idEntityCollection,
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
  if (connectionMode) {
    state.fgShowEnumAsso = true;
    //更新图表
    state.drawCount++;
  }
};
