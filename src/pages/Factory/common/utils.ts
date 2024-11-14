import { TTree } from '@/models';
import { TAttribute, TCompUpTreeInfo, TModuleType } from './model';
import { EnumTreeNodeType } from '@/pages/ComponentData/ComponentTree/conf';
import { TDescriptionInfo } from '../Units/common/model';
import { nanoid } from '@reduxjs/toolkit';

/**找出层级关系的id，并存储到result参数中 */
export const findCompUpTreeInfoByNodeId: (
  idComponent: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => boolean = (
  idComponent: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => {
  if (!trees || trees.length === 0) {
    return false;
  }
  let fgFound = false;
  for (let i = 0; i < trees.length; i++) {
    if (
      trees[i].level === EnumTreeNodeType.COMPONENT_ENTITY_COLLECTION &&
      trees[i].id === idComponent
    ) {
      result.compDisplayName = trees[i].displayName;
      result.componentType = trees[i].componentType;
      result.idComponent = trees[i].id;
      result.componentName = trees[i].name;
      fgFound = true;
      break;
    }
    fgFound = findCompUpTreeInfoByNodeId(
      idComponent,
      result,
      trees[i].children,
    );
    if (fgFound) {
      if (trees[i].level === EnumTreeNodeType.COMPONENT_MODULE) {
        result.idComponentModule = trees[i].id;
        result.componentModuleName = trees[i].displayName;
      }
      if (trees[i].level === EnumTreeNodeType.SUB_PROJECT) {
        result.idSubProject = trees[i].id;
        result.subProjectName = trees[i].displayName;
      }
      if (trees[i].level === EnumTreeNodeType.PROJECT) {
        result.idProject = trees[i].id;
        result.projectName = trees[i].displayName;
      }
      break;
    }
  }
  return fgFound;
};

/**找出层级关系的id，并存储到result参数中 */
export const findCompModuleUpTreeInfoByNodeId: (
  idComponentModule: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => boolean = (
  idComponentModule: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => {
  if (!trees || trees.length === 0) {
    return false;
  }
  let fgFound = false;
  for (let i = 0; i < trees.length; i++) {
    if (
      trees[i].level === EnumTreeNodeType.COMPONENT_MODULE &&
      trees[i].id === idComponentModule
    ) {
      result.idComponentModule = trees[i].id;
      result.componentModuleName = trees[i].displayName;
      fgFound = true;
      break;
    }
    fgFound = findCompModuleUpTreeInfoByNodeId(
      idComponentModule,
      result,
      trees[i].children,
    );
    if (fgFound) {
      if (trees[i].level === EnumTreeNodeType.SUB_PROJECT) {
        result.idSubProject = trees[i].id;
        result.subProjectName = trees[i].displayName;
      }
      if (trees[i].level === EnumTreeNodeType.PROJECT) {
        result.idProject = trees[i].id;
        result.projectName = trees[i].displayName;
      }
      break;
    }
  }
  return fgFound;
};

/**找出层级关系的id，并存储到result参数中 */
export const findSubProjectUpTreeInfoByNodeId: (
  idSubProject: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => boolean = (
  idSubProject: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => {
  if (!trees || trees.length === 0) {
    return false;
  }
  let fgFound = false;
  for (let i = 0; i < trees.length; i++) {
    if (
      trees[i].level === EnumTreeNodeType.SUB_PROJECT &&
      trees[i].id === idSubProject
    ) {
      result.idSubProject = trees[i].id;
      result.subProjectName = trees[i].displayName;
      fgFound = true;
      break;
    }
    fgFound = findSubProjectUpTreeInfoByNodeId(
      idSubProject,
      result,
      trees[i].children,
    );
    if (fgFound) {
      if (trees[i].level === EnumTreeNodeType.PROJECT) {
        result.idProject = trees[i].id;
        result.projectName = trees[i].displayName;
      }
      break;
    }
  }
  return fgFound;
};

/**找出层级关系的id，并存储到result参数中 */
export const findProjectUpTreeInfoByNodeId: (
  idProject: String,
  result: TCompUpTreeInfo,
  trees?: TTree[],
) => void = (idProject: String, result: TCompUpTreeInfo, trees?: TTree[]) => {
  if (!trees || trees.length === 0) {
    return false;
  }
  for (let i = 0; i < trees.length; i++) {
    if (
      trees[i].level === EnumTreeNodeType.PROJECT &&
      trees[i].id === idProject
    ) {
      result.idProject = trees[i].id;
      result.projectName = trees[i].displayName;
      break;
    }
  }
};

export const getModuleTypes = (
  metaData: TDescriptionInfo,
  fgTop: boolean,
): TModuleType[] => {
  //主类型
  const mainType: TModuleType = {
    id: nanoid(),
    className: 'T' + metaData.entityInfo?.className!,
    displayName: metaData.entityInfo?.displayName!,
    attributes: [],
    fgMain: fgTop,
    mainProperty: '',
  };
  mainType.attributes =
    metaData.children?.map((child) => {
      return getAtribute(child);
    }) || [];
  const pkAttr = mainType.attributes.find((attr) => attr.fgPk);
  mainType.mainProperty = pkAttr?.attributeName ?? '';
  //引用类型
  const refChildren =
    metaData.children?.filter(
      (child) => child.attributeTypeCode === 'InternalRef',
    ) ?? [];
  const refTypes = refChildren.map((refMetaData) => {
    return getRefType(refMetaData);
  });
  //引用类型
  const singleRefChildren =
    metaData.children?.filter(
      (child) => child.attributeTypeCode === 'InternalSingleRef',
    ) || [];
  const singleRefTypes = singleRefChildren.map((refMetaData) => {
    return getRefType(refMetaData);
  });
  //子引用类型
  const arrayChildren =
    metaData.children?.filter(
      (child) =>
        child.attributeTypeCode === 'InternalArray' && !child.fgPartner,
    ) || [];
  const arrayRefTypes = arrayChildren.map((refMetaData) => {
    return getRefType(refMetaData);
  });
  //单子引用类型
  const singleChildRefChildren =
    metaData.children?.filter(
      (child) =>
        child.attributeTypeCode === 'InternalSingle' && !child.fgPartner,
    ) || [];
  const singleChildRefTypes = singleChildRefChildren.map((refMetaData) => {
    return getRefType(refMetaData);
  });

  const aggArrayRefTypes: TModuleType[] = [];
  const aggSingleChildRefTypes: TModuleType[] = [];
  if (fgTop) {
    //聚合子引用类型
    const aggArrayChildren =
      metaData.children?.filter(
        (child) =>
          child.attributeTypeCode === 'InternalArray' && child.fgPartner,
      ) || [];
    aggArrayChildren.forEach((refMetaData) => {
      aggArrayRefTypes.push(...getModuleTypes(refMetaData, false));
    });
    //单子引用类型
    const aggSingleChildRefChildren =
      metaData.children?.filter(
        (child) =>
          child.attributeTypeCode === 'InternalSingle' && child.fgPartner,
      ) || [];
    aggSingleChildRefChildren.forEach((refMetaData) => {
      aggSingleChildRefTypes.push(...getModuleTypes(refMetaData, false));
    });
  }

  const names: string[] = [];
  const resultTypes: TModuleType[] = [];
  resultTypes.push(mainType);
  names.push(mainType.className);

  const allRefTypes = [
    ...aggArrayRefTypes,
    ...aggSingleChildRefTypes,
    ...refTypes,
    ...singleRefTypes,
    ...arrayRefTypes,
    ...singleChildRefTypes,
  ];

  allRefTypes.forEach((refType) => {
    if (names.includes(refType.className)) {
      return;
    }
    names.push(refType.className);
    resultTypes.push(refType);
  });

  return resultTypes;
};

const getRefType = (refMetaData: TDescriptionInfo) => {
  const refType: TModuleType = {
    id: nanoid(),
    className: 'T' + refMetaData.entityInfo?.className!,
    displayName: refMetaData.entityInfo?.displayName!,
    attributes: [],
    fgMain: false,
    mainProperty: '',
  };
  const baseMataDatas =
    refMetaData.children?.filter((child) => {
      return !(
        child.attributeTypeCode === 'InternalRef' ||
        child.attributeTypeCode === 'InternalSingleRef' ||
        child.attributeTypeCode === 'InternalSingle' ||
        child.attributeTypeCode === 'InternalArray'
      );
    }) || [];
  refType.attributes = baseMataDatas.map((child) => {
    return getAtribute(child);
  });
  const pkAttr = refType.attributes.find((attr) => attr.fgPk);
  refType.mainProperty = pkAttr?.attributeName ?? '';
  return refType;
};

const getAtribute = (child: TDescriptionInfo) => {
  if (child.attributeTypeCode === 'InternalRef') {
    const attribute: TAttribute = {
      id: nanoid(),
      attributeName: child.attributeName!,
      displayName: child.displayName!,
      attributeType: 'T' + child.entityInfo?.className!,
      fgPk: false,
    };
    return attribute;
  }
  if (child.attributeTypeCode === 'InternalSingleRef') {
    const attribute: TAttribute = {
      id: nanoid(),
      attributeName: child.attributeName!,
      displayName: child.displayName!,
      attributeType: 'T' + child.entityInfo?.className!,
      fgPk: false,
    };
    return attribute;
  }
  if (child.attributeTypeCode === 'InternalSingle') {
    const attribute: TAttribute = {
      id: nanoid(),
      attributeName: child.attributeName!,
      displayName: child.displayName!,
      attributeType: 'T' + child.entityInfo?.className!,
      fgPk: false,
    };
    return attribute;
  }
  if (child.attributeTypeCode === 'InternalArray') {
    const attribute: TAttribute = {
      id: nanoid(),
      attributeName: child.attributeName!,
      displayName: child.displayName!,
      attributeType: 'T' + child.entityInfo?.className! + '[]',
      fgPk: false,
    };
    return attribute;
  }
  const attribute: TAttribute = {
    id: nanoid(),
    attributeName: child.attributeName!,
    displayName: child.displayName!,
    attributeType: child.typeScriptType!,
    fgPk: child.fgPrimaryKey ?? false,
  };
  return attribute;
};
