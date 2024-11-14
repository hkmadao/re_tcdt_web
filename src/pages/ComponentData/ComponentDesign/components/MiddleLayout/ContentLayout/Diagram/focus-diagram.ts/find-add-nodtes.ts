import { DOStatus } from '@/models/enums';
import {
  TConcreteDiagram,
  TComponent,
} from '@/pages/ComponentData/ComponentDesign/models';

const findAdd = (entityCollection: TComponent, focusIds: string[]) => {
  const { componentEntities, outEntities, componentEnums, outEnums } =
    entityCollection;
  const allFocusIds = focusIds;
  return {
    addEntities:
      componentEntities?.filter(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          allFocusIds.includes(entity.idComponentEntity),
      ) || [],
    addOutEntities:
      outEntities?.filter(
        (entity) =>
          entity.action !== DOStatus.DELETED &&
          allFocusIds.includes(entity.idEntity),
      ) || [],
    addComponentEnums:
      componentEnums?.filter(
        (componentEnum) =>
          componentEnum.action !== DOStatus.DELETED &&
          allFocusIds.includes(componentEnum.idComponentEnum),
      ) || [],
  };
};

export default findAdd;
