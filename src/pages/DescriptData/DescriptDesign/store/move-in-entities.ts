import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import {
  TEntity,
  TEntityAssociate,
  TEntityCollection,
  TEnum,
  TEnumAssociate,
} from '../models';
import API from '@/pages/DescriptData/DescriptDesign/api';
import { DOStatus } from '@/models/enums';
import { EnumNodeUi, moduleName } from '../conf';

export const moveInEntities = createAsyncThunk(
  `${moduleName}/moveInEntities`,
  async (params: {
    entityCollection: TEntityCollection;
    moveData: {
      entities: TEntity[];
      entityAssociates: TEntityAssociate[];
      enumAssociates: TEnumAssociate[];
    };
  }) => {
    const entityCollection: TEntityCollection = JSON.parse(
      JSON.stringify(params.entityCollection),
    );
    //ui信息
    const existUis =
      entityCollection.nodeUis?.map((nodeUi) => {
        if (nodeUi.action !== DOStatus.DELETED) {
          return nodeUi.idElement;
        }
      }) || [];
    const {
      entities: moveInEntities,
      entityAssociates: moveInEntityAssociates,
      enumAssociates: moveEnumAssociates,
    } = params.moveData;
    moveInEntities.forEach((moveInEntity, index) => {
      //外部实体变为内部实体
      entityCollection.outEntities = entityCollection.outEntities?.filter(
        (outEntity) => outEntity.idEntity !== moveInEntity.idEntity,
      );
      if (!existUis.includes(moveInEntity.idEntity)) {
        entityCollection.nodeUis?.push({
          idNodeUi: nanoid(),
          idElement: moveInEntity.idEntity,
          idEntityCollection: entityCollection.idEntityCollection,
          action: DOStatus.NEW,
          x: 200 * index,
          y: 250,
          width: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_WIDTH,
          height: EnumNodeUi.ENTITY_SIMPLE_DEFAULT_HEIGHT,
        });
      }

      moveInEntity.action = DOStatus.UPDATED;
      moveInEntity.idEntityCollection = entityCollection?.idEntityCollection;
    });
    entityCollection.entities =
      entityCollection?.entities?.concat(moveInEntities);

    //连线信息
    moveInEntityAssociates.forEach((entityAssociate) => {
      entityAssociate.action = DOStatus.UPDATED;
      entityAssociate.idEntityCollection =
        params?.entityCollection?.idEntityCollection;
    });
    entityCollection.entityAssociates =
      entityCollection?.entityAssociates?.concat(moveInEntityAssociates);
    //连线信息
    moveEnumAssociates.forEach((entityAssociate) => {
      entityAssociate.action = DOStatus.UPDATED;
      entityAssociate.idEntityCollection =
        params?.entityCollection?.idEntityCollection;
    });
    entityCollection.enumAssociates =
      entityCollection?.enumAssociates?.concat(moveEnumAssociates);
    const newEntityCollection: TEntityCollection =
      await API.entityCollectionSaveByAction(entityCollection);
    return newEntityCollection;
  },
);

export const moveInEnnums = createAsyncThunk(
  `${moduleName}/moveInEnums`,
  async (params: {
    entityCollection: TEntityCollection;
    moveData: {
      enums: TEnum[];
    };
  }) => {
    const entityCollection: TEntityCollection = JSON.parse(
      JSON.stringify(params.entityCollection),
    );
    //ui信息
    const existUis =
      entityCollection.nodeUis?.map((nodeUi) => {
        if (nodeUi.action !== DOStatus.DELETED) {
          return nodeUi.idElement;
        }
      }) || [];
    const { enums: moveInEnums } = params.moveData;
    moveInEnums.forEach((moveInEnum, index) => {
      //外部枚举变为内部枚举
      entityCollection.outEnums = entityCollection.outEnums?.filter(
        (outEntity) => outEntity.idEnum !== moveInEnum.idEnum,
      );
      if (!existUis.includes(moveInEnum.idEnum)) {
        entityCollection.nodeUis?.push({
          idNodeUi: nanoid(),
          idElement: moveInEnum.idEnum,
          idEntityCollection: entityCollection.idEntityCollection,
          action: DOStatus.NEW,
          x: 200 * index,
          y: 250,
          width: EnumNodeUi.ENUM_DEFAULT_WIDTH,
          height: EnumNodeUi.ENUM_DEFAULT_HEIGHT,
        });
      }

      moveInEnum.action = DOStatus.UPDATED;
      moveInEnum.idEntityCollection = entityCollection?.idEntityCollection;
    });
    entityCollection.enums = entityCollection?.enums?.concat(moveInEnums);

    const newEntityCollection: TEntityCollection =
      await API.entityCollectionSaveByAction(entityCollection);
    return newEntityCollection;
  },
);

export const moveInElements = createAsyncThunk(
  `${moduleName}/moveInElements`,
  async (params: {
    entityCollection: TEntityCollection;
    moveData: {
      entities: TEntity[];
      enums: TEnum[];
    };
  }) => {
    const entityCollection: TEntityCollection = JSON.parse(
      JSON.stringify(params.entityCollection),
    );
    const entityIds = params.moveData.entities.map((entity) => entity.idEntity);
    const enumIds = params.moveData.enums.map((ddEnum) => ddEnum.idEnum);
    const newEntityCollection: TEntityCollection = await API.joinEntities({
      entityCollection: entityCollection,
      entityIds,
      enumIds,
    });
    return newEntityCollection;
  },
);
