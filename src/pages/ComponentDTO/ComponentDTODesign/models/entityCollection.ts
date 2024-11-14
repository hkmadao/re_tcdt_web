import { TAudit, TCommonResult } from '@/models';
import {
  TDtoEntity,
  TDtoEnum,
  TDtoEntityAssociate,
  TDtoEnumAssociate,
  TDtoNodeUi,
  TAttributeType,
} from '.';
import { TDtoModule } from '../../ComponentDTOTree/models';

export type TDeleteRefErrorMessage = {
  idData: string;
  message: string;
  sourceClassName: string;
  refClassName: string;
};

/** 实体集数据 */
export type TDtoEntityCollectionSaveResult = TCommonResult<
  TDtoEntityCollection | TDeleteRefErrorMessage[]
>;

/**DTO实体集 */
export type TDtoEntityCollection = {
  /**DTO实体集id */
  idDtoEntityCollection: string;
  /**主实体id */
  idMainDtoEntity?: string;
  /**所在DTO模块id */
  idDtoModule?: string;
  /**所在DTO模块 */
  dtoModule?: TDtoModule;
  /**名称 */
  packageName?: string;
  /**显示名称 */
  displayName?: string;
  /**实体集下的实体关联关系 */
  deAssociates: TDtoEntityAssociate[];
  /**实体集下的实体 */
  dtoEntities: TDtoEntity[];
  dtoNodeUis: TDtoNodeUi[];
  /**实体集下的枚举 */
  dtoEnums: TDtoEnum[];
  /**实体集下的实体和枚举关联关系 */
  dtoEnumAssociates: TDtoEnumAssociate[];
  /**系统数据类型 */
  sysDataTypes: TAttributeType[];
} & TAudit;
