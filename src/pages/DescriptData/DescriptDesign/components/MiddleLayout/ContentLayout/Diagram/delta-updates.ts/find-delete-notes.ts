import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import {
  TConcreteDiagram,
  TEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findDelete = (
  entityCollection: TEntityCollection,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
  fgShowOutEntities: boolean,
  fgShowSysInterfaces: boolean,
) => {
  const {
    entityAssociates,
    enumAssociates,
    entities,
    outEntities,
    enums,
    outEnums,
  } = entityCollection;
  //待删除实体
  const entityKeys =
    entities
      .filter((entity) => entity.action !== DOStatus.DELETED)
      .map((entity) => entity.idEntity) || [];
  const deleteMdNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        if (!entityKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
      }
      return false;
    }) || [];
  //待删除枚举
  const enumKeys =
    enums
      .filter((ddEnum) => ddEnum.action !== DOStatus.DELETED)
      .map((entity) => entity.idEnum) || [];
  const deleteMdEnumNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
        if (!enumKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
      }
      return false;
    }) || [];
  //待删除外部实体
  const outEntityKeys = outEntities.map((entity) => entity.idEntity) || [];
  const deleteOutMdNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (
        mdNode.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENTITY
      ) {
        if (!fgShowOutEntities) {
          return true;
        }
        if (!outEntityKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
        return false;
      }
      return false;
    }) || [];

  //待删除外部枚举
  const outEnumKeys = outEnums.map((outEnum) => outEnum.idEnum) || [];
  const deleteOutMdEnumNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (
        mdNode.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENUM
      ) {
        if (!fgShowOutEntities) {
          return true;
        }
        if (!outEnumKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
        return false;
      }
      return false;
    }) || [];

  //待删除连线
  const entityAssoKeys =
    entityAssociates
      .filter((asso) => asso.action !== DOStatus.DELETED)
      .map((asso) => asso.idEntityAssociate) || [];
  const allEntityKeys = entityKeys.concat(outEntityKeys);

  const enumAssoKeys =
    enumAssociates
      .filter((asso) => asso.action !== DOStatus.DELETED)
      .map((asso) => asso.idEnumAssociate) || [];
  const allEnumKeys = enumKeys.concat(outEnumKeys);

  const deleteMdLinks =
    elements.mdLinkModels.filter((mdLink) => {
      if (!mdLink.getExtras()) {
        return true;
      }
      if (
        mdLink.getExtras().concreteType === EnumConcreteDiagramType.ASSOLINK
      ) {
        const idElement = mdLink.getExtras().idElement;
        const findAsso = entityAssociates.find(
          (asso) =>
            asso.action !== DOStatus.DELETED &&
            asso.idEntityAssociate === idElement,
        );
        if (!entityAssoKeys.includes(idElement)) {
          return true;
        }
        if (
          !entityKeys.includes(findAsso?.idUp!) ||
          !entityKeys.includes(findAsso?.idDown!)
        ) {
          //一端是外部实体的连线
          if (!fgShowOutEntities) {
            return true;
          }
          if (
            !allEntityKeys.includes(findAsso?.idUp!) ||
            !allEntityKeys.includes(findAsso?.idDown!)
          ) {
            return true;
          }
        }
      } else if (
        mdLink.getExtras().concreteType === EnumConcreteDiagramType.ENUMASSOLINK
      ) {
        const idElement = mdLink.getExtras().idElement;
        const findAsso = enumAssociates.find(
          (asso) =>
            asso.action !== DOStatus.DELETED &&
            asso.idEnumAssociate === idElement,
        );
        if (!enumAssoKeys.includes(idElement)) {
          return true;
        }
        if (!enumKeys.includes(findAsso?.idEnum!)) {
          //枚举是外部枚举
          if (!fgShowOutEntities) {
            return true;
          }
          if (
            !allEnumKeys.includes(findAsso?.idEnum!) ||
            !allEntityKeys.includes(findAsso?.idEntity!)
          ) {
            return true;
          }
        }
      }
      return false;
    }) || [];
  const result = {
    deleteMdNodes: deleteMdNodes
      .concat(deleteOutMdNodes)
      .concat(deleteMdEnumNodes)
      .concat(deleteOutMdEnumNodes),
    deleteMdLinks,
  };
  // console.log(result);
  return result;
};

export default findDelete;
