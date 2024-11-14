import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/ComponentDTO/ComponentDTODesign/conf';
import {
  TConcreteDiagram,
  TDtoEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findAdd = (
  entityCollection: TDtoEntityCollection,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
) => {
  const { dtoEntities: entities, dtoEnums: enums } = entityCollection;
  //待添加实体
  const elementEntityKeys =
    elements.mdNodeModels
      .map((mdNode) => {
        if (
          mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENTITY
        ) {
          return mdNode.getExtras().idElement;
        }
        return '';
      })
      .filter((idDtoEntity) => idDtoEntity !== '') || [];
  const addEntities =
    entities.filter(
      (entity) =>
        entity.action !== DOStatus.DELETED &&
        !elementEntityKeys.includes(entity.idDtoEntity),
    ) || [];

  //待添加枚举
  const elementEnumKeys =
    elements.mdNodeModels
      .map((mdNode) => {
        if (mdNode.getExtras().concreteType === EnumConcreteDiagramType.ENUM) {
          return mdNode.getExtras().idElement;
        }
        return '';
      })
      .filter((idEnum) => idEnum !== '') || [];
  const addEnums =
    enums.filter(
      (ddEnum) =>
        ddEnum.action !== DOStatus.DELETED &&
        !elementEnumKeys.includes(ddEnum.idDtoEnum),
    ) || [];

  const result = {
    addEntities,
    addEnums,
  };
  return result;
};

export default findAdd;
