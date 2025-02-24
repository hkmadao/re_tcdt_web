import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  TConcreteDiagram,
  TDtoEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findDelete = (
  entityCollection: TDtoEntityCollection,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
) => {
  const {
    deAssociates: entityAssociates,
    dtoEnumAssociates: enumAssociates,
    dtoEntities: entities,
    dtoEnums: enums,
  } = entityCollection;
  //待删除实体
  const entityKeys =
    entities
      .filter((entity) => entity.action !== DOStatus.DELETED)
      .map((entity) => entity.idDtoEntity) || [];
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
      .map((entity) => entity.idDtoEnum) || [];
  const deleteMdEnumNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
        if (!enumKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
      }
      return false;
    }) || [];

  //待删除连线
  const entityAssoKeys =
    entityAssociates
      .filter((asso) => asso.action !== DOStatus.DELETED)
      .map((asso) => asso.idDtoEntityAssociate) || [];
  const allEntityKeys = entityKeys;

  const enumAssoKeys =
    enumAssociates
      .filter((asso) => asso.action !== DOStatus.DELETED)
      .map((asso) => asso.idDtoEnumAssociate) || [];
  const allEnumKeys = enumKeys;

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
            asso.idDtoEntityAssociate === idElement,
        );
        if (!entityAssoKeys.includes(idElement)) {
          return true;
        }
        if (
          !entityKeys.includes(findAsso?.idUp!) ||
          !entityKeys.includes(findAsso?.idDown!)
        ) {
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
            asso.idDtoEnumAssociate === idElement,
        );
        if (!enumAssoKeys.includes(idElement)) {
          return true;
        }
        if (!enumKeys.includes(findAsso?.idDtoEnum!)) {
          if (
            !allEnumKeys.includes(findAsso?.idDtoEnum!) ||
            !allEntityKeys.includes(findAsso?.idDtoEntity!)
          ) {
            return true;
          }
        }
      }
      return false;
    }) || [];
  const result = {
    deleteMdNodes: deleteMdNodes.concat(deleteMdEnumNodes),
    deleteMdLinks,
  };
  return result;
};

export default findDelete;
