import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import {
  TConcreteDiagram,
  TComponent,
} from '@/pages/ComponentData/ComponentDesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findDelete = (
  entityCollection: TComponent,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
  fgShowOutEntities: boolean,
  fgShowSysInterfaces: boolean,
) => {
  const {
    componentEntityAssociates,
    enumAssociates,
    componentEntities,
    componentEnums,
    outEntities,
    outEnums,
  } = entityCollection;
  //待删除实体
  const componentEntityKeys =
    componentEntities
      ?.filter((entity) => entity.action !== DOStatus.DELETED)
      .map((entity) => entity.idComponentEntity) || [];
  const entityKeys =
    componentEntities
      ?.filter((entity) => entity.action !== DOStatus.DELETED)
      .map((entity) => entity.idEntity) || [];
  const deleteMdNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENTITY) {
        if (!componentEntityKeys.includes(mdNode.getExtras().idElement!)) {
          return true;
        }
      }
      return false;
    }) || [];
  //待删除枚举
  const enumKeys =
    componentEnums
      ?.filter((componentEnum) => componentEnum.action !== DOStatus.DELETED)
      .map((entity) => entity.ddEnum?.idEnum) || [];
  const deleteMdEnumNodes =
    elements.mdNodeModels.filter((mdNode) => {
      if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
        const idElement = mdNode.getExtras().idElement;
        const componentEnumFind = componentEnums?.find(
          (componentEnum) => componentEnum.idComponentEnum === idElement,
        );
        if (!componentEnumFind) {
          return true;
        }
        if (!enumKeys.includes(componentEnumFind?.ddEnum?.idEnum)) {
          return true;
        }
      }
      return false;
    }) || [];
  //待删除外部实体
  const outEntityKeys = outEntities?.map((entity) => entity.idEntity) || [];
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
  const outEnumKeys = outEnums?.map((outEnum) => outEnum.idEnum) || [];
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
    componentEntityAssociates
      ?.filter((asso) => asso.action !== DOStatus.DELETED)
      .map((asso) => asso.idComponentEntityAssociate) || [];
  const allEntityKeys = entityKeys.concat(outEntityKeys);

  const enumAssoKeys =
    enumAssociates
      ?.filter((asso) => asso.action !== DOStatus.DELETED)
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
        const findAsso = componentEntityAssociates?.find(
          (asso) =>
            asso.action !== DOStatus.DELETED &&
            asso.idEntityAssociate === idElement,
        );
        if (!entityAssoKeys.includes(idElement!)) {
          return true;
        }
        if (
          !entityKeys.includes(findAsso?.entityAssociate?.idUp!) ||
          !entityKeys.includes(findAsso?.entityAssociate?.idDown!)
        ) {
          //一端是外部实体的连线
          if (!fgShowOutEntities) {
            return true;
          }
          if (
            !allEntityKeys.includes(findAsso?.entityAssociate?.idUp!) ||
            !allEntityKeys.includes(findAsso?.entityAssociate?.idDown!)
          ) {
            return true;
          }
        }
      } else if (
        mdLink.getExtras().concreteType === EnumConcreteDiagramType.ENUMASSOLINK
      ) {
        const idElement = mdLink.getExtras().idElement;
        const findAsso = enumAssociates?.find(
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
