import { DOStatus } from '@/models/enums';
import {
  TConcreteDiagram,
  TEntityCollection,
} from '@/pages/DescriptData/DescriptDesign/models';

const findAdd = (entityCollection: TEntityCollection, focusIds: string[]) => {
  const { entities, outEntities, enums, outEnums } = entityCollection;
  const allFocusIds = focusIds;
  return {
    addEntities:
      entities.filter(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          allFocusIds.includes(entity.idEntity),
      ) || [],
    addOutEntities:
      outEntities.filter(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          allFocusIds.includes(entity.idEntity),
      ) || [],
    addEnums:
      enums.filter(
        (ddEnum) =>
          ddEnum.action !== DOStatus.DELETED &&
          allFocusIds.includes(ddEnum.idEnum),
      ) || [],
    addOutEnums:
      outEnums.filter(
        (ddEnum) =>
          ddEnum.action !== DOStatus.DELETED &&
          allFocusIds.includes(ddEnum.idEnum),
      ) || [],
  };
};

export default findAdd;
