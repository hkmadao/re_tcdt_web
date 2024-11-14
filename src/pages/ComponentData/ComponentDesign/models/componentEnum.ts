import { TAudit } from '@/models';
import { TEnum } from '.';

/**组件枚举 */
export type TComponentEnum = {
  idComponentEnum: string;
  idComponent?: string;
  idEnum?: string;
  ddEnum?: TEnum;
} & TAudit;
