import { TAudit } from '@/models';

/**实体在画布的属性 */
export type TDtoNodeUi = {
  idDtoNodeUi?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  idDtoEntityCollection?: string;
  idElement?: string;
} & TAudit;
