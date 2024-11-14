import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/DescriptData/DescriptDesign/conf';
import {
  TConcreteDiagram,
  TEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findAdd = (
  entityCollection: TEntityCollection,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
) => {
  const { entities, outEntities, enums, outEnums } = entityCollection;
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
      .filter((idEntity) => idEntity !== '') || [];
  const addEntities =
    entities.filter(
      (entity) =>
        entity.action !== DOStatus.DELETED &&
        !elementEntityKeys.includes(entity.idEntity),
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
        !elementEnumKeys.includes(ddEnum.idEnum),
    ) || [];

  //待添加外部实体
  const elementOutEntityKeys =
    elements.mdNodeModels
      .map((mdNode) => {
        if (
          mdNode.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENTITY
        ) {
          return mdNode.getExtras().idElement;
        }
        return '';
      })
      .filter((idEntity) => idEntity !== '') || [];
  const addOutEntities =
    outEntities.filter(
      (entity) => !elementOutEntityKeys.includes(entity.idEntity),
    ) || [];

  //待添加外部枚举
  const elementOutEnumKeys =
    elements.mdNodeModels
      .map((mdNode) => {
        if (
          mdNode.getExtras().concreteType === EnumConcreteDiagramType.OUT_ENUM
        ) {
          return mdNode.getExtras().idElement;
        }
        return '';
      })
      .filter((idEnum) => idEnum !== '') || [];
  const addOutEnums =
    outEnums.filter((ddEnum) => !elementOutEnumKeys.includes(ddEnum.idEnum)) ||
    [];

  const result = {
    addEntities,
    addOutEntities,
    addEnums,
    addOutEnums,
  };
  return result;
};

export default findAdd;
