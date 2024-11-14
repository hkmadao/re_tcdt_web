import { DOStatus } from '@/models/enums';
import { CaseReducer, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TExtAttribute, TJoinColumn, TModuleStore } from '../models';

/**组件实体属性添加 */
export const addExtAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TExtAttribute[]>
> = (state, action) => {
  const addExtAttrs = action.payload;
  state.component.componentEntities?.forEach((componentEntity) => {
    if (componentEntity.action !== DOStatus.DELETED) {
      addExtAttrs.forEach((newExtAttr) => {
        if (
          newExtAttr.idComponentEntity === componentEntity.idComponentEntity
        ) {
          componentEntity.extAttributes?.push({
            ...newExtAttr,
            idExtAttribute: nanoid(),
            action: DOStatus.NEW,
          });
        }
      });
    }
  });
};

/**组件实体属性保存 */
export const updateExtAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TExtAttribute>
> = (state, action) => {
  const newExtAttr = action.payload;
  const newComponentEntity = state.component.componentEntities?.find(
    (componentEntity) =>
      componentEntity.action !== DOStatus.DELETED &&
      componentEntity.idComponentEntity === newExtAttr.idComponentEntity,
  );
  if (!newComponentEntity) {
    return;
  }
  newComponentEntity.action === DOStatus.UNCHANGED
    ? (newComponentEntity.action = DOStatus.UPDATED)
    : undefined;
  const newEntityAttrs = newComponentEntity.extAttributes?.map((extAttr) => {
    if (extAttr.idExtAttribute === newExtAttr.idExtAttribute) {
      return {
        ...extAttr,
        ...newExtAttr,
        action:
          extAttr.action === DOStatus.UNCHANGED
            ? DOStatus.UPDATED
            : extAttr.action,
      };
    }
    return extAttr;
  });
  newComponentEntity.extAttributes = newEntityAttrs;
  state.component.componentEntities = state.component.componentEntities?.map(
    (componentEntity) => {
      if (
        componentEntity.idComponentEntity ==
        newComponentEntity.idComponentEntity
      ) {
        componentEntity.action = newComponentEntity.action;
        componentEntity.extAttributes = newComponentEntity.extAttributes;
      }
      return componentEntity;
    },
  );
};

/**更新关联字段 */
export const updateJoinColumns: CaseReducer<
  TModuleStore,
  PayloadAction<{
    idComponentEntity: string;
    idExtAttribute: string;
    joinColumns: TJoinColumn[];
  }>
> = (state, action) => {
  const {
    idComponentEntity,
    idExtAttribute,
    joinColumns: newJoinColumns,
  } = action.payload;
  const newIdRefs = newJoinColumns.map((joinColumn) => joinColumn.idRef || '');
  state.component.componentEntities?.forEach((componentEntity) => {
    if (
      componentEntity.action !== DOStatus.DELETED &&
      componentEntity.idComponentEntity === idComponentEntity
    ) {
      if (componentEntity.extAttributes) {
        componentEntity.extAttributes.forEach((extAttribute) => {
          if (
            extAttribute.action !== DOStatus.DELETED &&
            extAttribute.idExtAttribute === idExtAttribute
          ) {
            let sourceJoinColumns = extAttribute?.joinColumns?.slice() || [];

            sourceJoinColumns = sourceJoinColumns.filter((ea) => {
              //新数据的id集合不包含的原始数据
              if (!newIdRefs.includes(ea.idRef!)) {
                if (ea.action === DOStatus.NEW) {
                  return false;
                }
                ea.action = DOStatus.DELETED;
                return true;
              }
              //包含的数据，进行修改
              const newJoinColumn = newJoinColumns.find(
                (joinColumn) => joinColumn.idRef === ea.idRef,
              );
              if (!newJoinColumn) {
                return false;
              }
              ea.attributeName = newJoinColumn.attributeName;
              ea.name = newJoinColumn.name;
              if (ea.action !== DOStatus.NEW) {
                ea.action = DOStatus.UPDATED;
              }
              return true;
            });
            //旧数据id列表
            const oldRefIds =
              sourceJoinColumns?.map((ea) => {
                return ea.idRef;
              }) || [];
            newJoinColumns.forEach((joinColumn) => {
              if (!oldRefIds.includes(joinColumn.idRef!)) {
                sourceJoinColumns.push({
                  ...joinColumn,
                  idJoinColumn: nanoid(),
                  action: DOStatus.NEW,
                });
              } else {
                const findJoinColumn = sourceJoinColumns.find(
                  (sourceJoinColumn) =>
                    joinColumn.idRef === sourceJoinColumn.idRef,
                );
                if (findJoinColumn) {
                  //先选了取消了选中，后面有重新选中
                  if (findJoinColumn.action === DOStatus.DELETED) {
                    findJoinColumn.action = DOStatus.UPDATED;
                  }
                  findJoinColumn.attributeName = joinColumn.attributeName;
                  findJoinColumn.columnName = joinColumn.columnName;
                  findJoinColumn.name = joinColumn.name;
                }
              }
            });
            extAttribute.joinColumns = sourceJoinColumns;
            extAttribute.action = DOStatus.UPDATED;
            componentEntity.action = DOStatus.UPDATED;
            return true;
          }
        });
      }
    }
  });

  // if (!newComponentEntity) {
  //   return;
  // }
  // newComponentEntity.action === DOStatus.UNCHANGED
  //   ? (newComponentEntity.action = DOStatus.UPDATED)
  //   : undefined;
  // const findExtAttribute = newComponentEntity.extAttributes?.find((extAttr) => {
  //   return extAttr.idExtAttribute === idExtAttribute;
  // });
  // const newJoinColumns = findExtAttribute?.joinColums?.slice() || [];
  // const oldRefIds = findExtAttribute?.joinColums?.map(extAttribute => { return extAttribute.idRef || '' }) || [];
  // newJoinColumns.forEach(extAttribute => {
  //   if (!idRefs.includes(extAttribute.idRef!)) {
  //     extAttribute.action = DOStatus.DELETED;
  //     return;
  //   }
  //   const newJoinColumn = joinColumns.find(joinColumn => joinColumn.idRef === extAttribute.idRef);
  //   if (newJoinColumn) {
  //     extAttribute.attributeName = newJoinColumn.attributeName;
  //     extAttribute.name = newJoinColumn.name;
  //     extAttribute.action = DOStatus.DELETED;
  //   }
  // });
  // joinColumns.forEach(joinColumn => {
  //   if (!oldRefIds.includes(joinColumn.idRef!)) {
  //     newJoinColumns.push({
  //       ...joinColumn,
  //       idJoinColumn: nanoid(),
  //       action: DOStatus.NEW,
  //     });
  //   }
  // });
};

/**组件实体属性删除 */
export const deleteExtAttribute: CaseReducer<
  TModuleStore,
  PayloadAction<TExtAttribute>
> = (state, action) => {
  const deleteExtAttr = action.payload;
  state.component.componentEntities?.forEach((componentEntity) => {
    if (
      componentEntity.action !== DOStatus.DELETED &&
      componentEntity.idComponentEntity === deleteExtAttr.idComponentEntity
    ) {
      componentEntity.extAttributes = componentEntity.extAttributes?.filter(
        (extAttr) => {
          if (extAttr.idExtAttribute === deleteExtAttr.idExtAttribute) {
            if (extAttr.action === DOStatus.NEW) {
              return false;
            }
            extAttr.action = DOStatus.DELETED;
            return true;
          }
          return true;
        },
      );
    }
  });
};
