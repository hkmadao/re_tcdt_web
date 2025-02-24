import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EnumComponentType } from '../conf';
import {
  TComponentEntity,
  TComponentEntityAssociate,
  TEntity,
  TEntityAssociate,
  TModuleStore,
} from '../models';

/**添加主实体 */
export const addComponentEntity: CaseReducer<
  TModuleStore,
  PayloadAction<{
    mainEntity: TEntity;
  }>
> = (state, action) => {
  const { mainEntity } = action.payload;
  const { downAssociates, upAssociates } = action.payload.mainEntity;
  const allAssos: TEntityAssociate[] = [];
  if (downAssociates) {
    allAssos.push(...downAssociates.filter((asso) => asso.downAttributeName));
  }
  const assoIds = allAssos.map((asso) => asso.idEntityAssociate!);
  upAssociates?.forEach((asso) => {
    if (!assoIds.includes(asso.idEntityAssociate!)) {
      allAssos.push(asso);
      assoIds.push(asso.idEntityAssociate!);
    }
  });
  if (!state.component?.componentEntities) {
    state.component.componentEntities = [];
  }
  if (!state.component?.componentEntityAssociates) {
    state.component.componentEntityAssociates = [];
  }
  if (!state.component?.componentNodeUis) {
    state.component.componentNodeUis = [];
  }
  const idComponentEntity = nanoid();
  state.component.componentNodeUis?.push({
    idElement: idComponentEntity,
    x: 300,
    y: 300,
    width: 150,
    height: 200,
    idComponentNodeUi: nanoid(),
    idComponent: state.component?.idComponent,
    action: DOStatus.NEW,
  });
  state.component.idMainComponentEntity = idComponentEntity;
  const mainComponentEntity: TComponentEntity = {
    ddEntity: {
      ...mainEntity,
    },
    fgVirtual: state.component.componentType === EnumComponentType.Combination,
    idEntity: mainEntity.idEntity,
    idComponentEntity,
    extAttributes: [],
    action: DOStatus.NEW,
  };
  //为组件实体添加扩展属性
  mainEntity.attributes?.forEach((attribute) => {
    mainComponentEntity.extAttributes?.push({
      idComponentEntity: idComponentEntity,
      idAttribute: attribute.idAttribute,
      sn: attribute.sn,
      attribute: attribute,
      idExtAttribute: nanoid(),
      action: DOStatus.NEW,
    });
  });
  state.component?.componentEntities?.push(mainComponentEntity);
  //添加关系连线
  allAssos.forEach((asso) => {
    state.component.componentEntityAssociates?.push({
      idComponentEntityAssociate: nanoid(),
      action: DOStatus.NEW,
      fgAggAsso: false,
      idComponent: state.component.idComponent,
      idEntityAssociate: asso.idEntityAssociate,
      entityAssociate: asso,
    });
  });

  //更新图表
  state.drawCount++;
};

/**添加子实体 */
export const setComponentEntityAsso: CaseReducer<
  TModuleStore,
  PayloadAction<
    {
      idEntityAssociate: string;
      childEntity: TEntity;
    }[]
  >
> = (state, action) => {
  const params = action.payload;
  params.forEach((param, index) => {
    const { idEntityAssociate, childEntity } = param;
    const { downAssociates, upAssociates } = childEntity;
    const childAssos: TEntityAssociate[] = [];
    if (downAssociates) {
      childAssos.push(...downAssociates);
    }
    if (upAssociates) {
      childAssos.push(...upAssociates);
    }

    const allAssoIds = state.component.componentEntityAssociates?.map(
      (ceasso) => ceasso.idEntityAssociate!,
    );
    //加入关联连线
    childAssos.forEach((asso) => {
      if (!allAssoIds?.includes(asso.idEntityAssociate!)) {
        allAssoIds?.push(asso.idEntityAssociate!);
        state.component.componentEntityAssociates?.push({
          idComponentEntityAssociate: nanoid(),
          action: DOStatus.NEW,
          fgAggAsso: asso.idEntityAssociate === idEntityAssociate,
          idComponent: state.component.idComponent,
          idEntityAssociate: asso.idEntityAssociate,
          entityAssociate: asso,
        });
      }
    });
    //设置agg标识
    state.component.componentEntityAssociates?.forEach((ceasso) => {
      if (ceasso.idEntityAssociate === idEntityAssociate) {
        ceasso.fgAggAsso = true;
        ceasso.action =
          ceasso.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : ceasso.action;
      }
    });
    const mainComponentEntity = state.component.componentEntities?.find(
      (ce) =>
        ce.action !== DOStatus.DELETED &&
        ce.idComponentEntity === state.component.idMainComponentEntity,
    );
    //父实体自关联关系
    if (mainComponentEntity?.ddEntity?.idEntity === childEntity.idEntity) {
      return;
    }
    const idComponentEntity = nanoid();
    const newComponentEntity: TComponentEntity = {
      ddEntity: {
        ...childEntity,
      },
      fgVirtual:
        state.component.componentType === EnumComponentType.Combination,
      idEntity: childEntity.idEntity,
      idComponentEntity,
      action: DOStatus.NEW,
      extAttributes: [],
    };
    //为组件实体添加扩展属性
    childEntity.attributes?.forEach((attribute) => {
      newComponentEntity.extAttributes?.push({
        idComponentEntity: idComponentEntity,
        idAttribute: attribute.idAttribute,
        sn: attribute.sn,
        attribute: attribute,
        idExtAttribute: nanoid(),
        action: DOStatus.NEW,
      });
    });

    state.component.componentEntities?.push(newComponentEntity);
    state.component.componentNodeUis?.push({
      idElement: idComponentEntity,
      x: (state.component.componentNodeUis?.length! + index + 1) * 200,
      y: 100,
      width: 150,
      height: 200,
      idComponentNodeUi: nanoid(),
      idComponent: state.component?.idComponent,
      action: DOStatus.NEW,
    });
  });
  //更新图表
  state.drawCount++;
};

export const addComponentEntityAssos: CaseReducer<
  TModuleStore,
  PayloadAction<TEntityAssociate[]>
> = (state, action) => {
  const allAssoIds = state.component.componentEntityAssociates?.map(
    (ceasso) => ceasso.idEntityAssociate!,
  );

  //加入关联连线
  action.payload.forEach((asso) => {
    if (!allAssoIds?.includes(asso.idEntityAssociate!)) {
      allAssoIds?.push(asso.idEntityAssociate!);
      state.component.componentEntityAssociates?.push({
        idComponentEntityAssociate: nanoid(),
        action: DOStatus.NEW,
        fgAggAsso: false,
        idComponent: state.component.idComponent,
        idEntityAssociate: asso.idEntityAssociate,
        entityAssociate: asso,
      });
    }
  });
};

export const deleteComponentEntityAssos: CaseReducer<
  TModuleStore,
  PayloadAction<TComponentEntityAssociate[]>
> = (state, action) => {
  const allEAssoIds = action.payload.map(
    (ceasso) => ceasso.idComponentEntityAssociate,
  );
  state.component.componentEntityAssociates =
    state.component.componentEntityAssociates?.filter((eAsso) => {
      if (allEAssoIds.includes(eAsso.idComponentEntityAssociate!)) {
        if (eAsso.action === DOStatus.NEW) {
          return false;
        }
        eAsso.action = DOStatus.DELETED;
        return true;
      }
      return true;
    });
};
