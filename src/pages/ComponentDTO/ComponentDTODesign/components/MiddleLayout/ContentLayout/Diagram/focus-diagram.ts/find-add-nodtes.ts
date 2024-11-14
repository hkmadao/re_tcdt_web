import { DOStatus } from '@/models/enums';
import {
  TConcreteDiagram,
  TDtoEntityCollection,
} from '@/pages/ComponentDTO/ComponentDTODesign/models';

const findAdd = (
  entityCollection: TDtoEntityCollection,
  focusIds: string[],
) => {
  const { dtoEntities: entities, dtoEnums: enums } = entityCollection;
  const allFocusIds = focusIds;
  return {
    addEntities:
      entities.filter(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          allFocusIds.includes(entity.idDtoEntity),
      ) || [],
    addEnums:
      enums.filter(
        (ddEnum) =>
          ddEnum.action !== DOStatus.DELETED &&
          allFocusIds.includes(ddEnum.idDtoEnum),
      ) || [],
  };
};

export default findAdd;
