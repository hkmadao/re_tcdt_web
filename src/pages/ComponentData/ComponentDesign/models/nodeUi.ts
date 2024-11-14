import { TAudit } from '@/models';

/**组件实体在画布的属性*/
export type TComponentNodeUi = {
  idComponentNodeUi?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  idComponent?: string;
  idElement?: string;
} & TAudit;

/**实体在画布的属性 */
export type TNodeUi = {
  idNodeUi?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  idEntityCollection?: string;
  idElement?: string;
} & TAudit;
