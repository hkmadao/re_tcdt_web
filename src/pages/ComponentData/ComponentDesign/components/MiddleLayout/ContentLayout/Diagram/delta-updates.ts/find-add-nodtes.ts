import { DOStatus } from '@/models/enums';
import { EnumConcreteDiagramType } from '@/pages/ComponentData/ComponentDesign/conf';
import {
  TConcreteDiagram,
  TComponent,
} from '@/pages/ComponentData/ComponentDesign/models';
import { MdLinkModel } from '../Link/MdLinkModel';
import { MdNodeModel } from '../Node/MdNodeModel';

const findAdd = (
  entityCollection: TComponent,
  elements: {
    mdNodeModels: MdNodeModel<TConcreteDiagram>[];
    mdLinkModels: MdLinkModel<TConcreteDiagram>[];
  },
) => {
  const { componentEntities, outEntities, componentEnums, outEnums } =
    entityCollection;
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
      .filter((idComponentEntity) => idComponentEntity !== '') || [];
  const addEntities =
    componentEntities?.filter(
      (entity) =>
        entity.action !== DOStatus.DELETED &&
        !elementEntityKeys.includes(entity.idComponentEntity),
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
      .filter((idComponentEnum) => idComponentEnum !== '') || [];
  const addComponentEnums =
    componentEnums?.filter(
      (componentEnum) =>
        componentEnum.action !== DOStatus.DELETED &&
        !elementEnumKeys.includes(componentEnum.idComponentEnum),
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
    outEntities?.filter(
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
    outEnums?.filter((ddEnum) => !elementOutEnumKeys.includes(ddEnum.idEnum)) ||
    [];

  const result = {
    addEntities,
    addOutEntities,
    addComponentEnums,
    addOutEnums,
  };
  return result;
};

export default findAdd;
